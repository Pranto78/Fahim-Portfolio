import PortfolioClient from "@/components/PortfolioClient";
import { getContent, toPublicContent } from "@/lib/content/server";

// Server component: reads content (MongoDB → hardcoded fallback) and hands the
// browser-safe part to the client page. Refreshed on demand by /api/revalidate.
export default async function Page() {
  const content = await getContent();
  return <PortfolioClient content={toPublicContent(content)} />;
}
