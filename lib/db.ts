import "server-only";
import { MongoClient, type Db } from "mongodb";

const flag = (name: string) => {
  const v = process.env[name]?.trim().toLowerCase();
  return v === "true" ? true : v === "false" ? false : undefined;
};

/**
 * Switch in .env:  LOCAL=true / LIVE=false  → local,  LOCAL=false / LIVE=true → live.
 * If the flags are missing or contradict each other, Vercel production = live, everything else = local.
 */
export function getEnvName(): "live" | "local" {
  const live = flag("LIVE");
  const local = flag("LOCAL");
  if (live === true && local !== true) return "live";
  if (local === true && live !== true) return "local";
  return process.env.VERCEL_ENV === "production" ? "live" : "local";
}

/** Live → "portfolio", local → "portfolio_dev" (never shared). MONGODB_DB overrides both. */
export function getDbName(): string {
  if (process.env.MONGODB_DB) return process.env.MONGODB_DB;
  return getEnvName() === "live" ? "portfolio" : "portfolio_dev";
}

/** False when the URI is missing or still has the <db_username>/<db_password> placeholders. */
export function isDbConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return !!uri && !/<db_(username|password)>/.test(uri);
}

const globalForMongo = globalThis as unknown as { _portfolioMongo?: Promise<MongoClient> };

export async function getDb(): Promise<Db> {
  if (!isDbConfigured()) throw new Error("MONGODB_URI is not configured");
  if (!globalForMongo._portfolioMongo) {
    const client = new MongoClient(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
      maxPoolSize: 5,
    });
    globalForMongo._portfolioMongo = client.connect().catch((err) => {
      globalForMongo._portfolioMongo = undefined; // retry on the next request
      throw err;
    });
  }
  return (await globalForMongo._portfolioMongo).db(getDbName());
}
