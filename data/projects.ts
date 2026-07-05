// =========================================================================
// OFFICE PROJECTS — featured in the AI-driven Projects section.
// Each block is the knowledge source for that project's chat.
// =========================================================================
export type ProjectTech =
  | "react"
  | "react-native"
  | "typescript"
  | "vite"
  | "expo"
  | "node"
  | "express"
  | "redux"
  | "mongodb"
  | "firebase";

export type Project = {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  unique: string;
  stack: string;
  visualStack: ProjectTech[];
  state: string;
  auth: string;
  db: string;
  extra: string;
  role: string;
};

export const PROJECTS: Project[] = [
  {
    id: "arla",
    name: "Arla — TAINC CRM",
    tag: "Web + Mobile + API",
    blurb: "A full CRM platform for leave & merchandising management.",
    unique:
      "Spans three repos — a React 19 web admin, an Express 5 API, and a bare React Native field app — all sharing one CRM backend.",
    stack:
      "React 19 + Vite + TypeScript (web), Express 5 + TypeScript (API), React Native 0.83 bare CLI (mobile).",
    visualStack: ["react", "react-native", "typescript", "vite", "express", "mongodb"],
    state: "Redux Toolkit + RTK Query everywhere; redux-persist on mobile.",
    auth:
      "JWT (access 1d / refresh 30d) with Passport (local + Google OAuth20) on web; react-native-keychain for secure token storage on mobile with silent logout on token expiry.",
    db: "MongoDB via Mongoose 8 (Atlas dev / self-hosted taincDB prod).",
    extra:
      "40+ backend modules: attendance, campaign, merchandisingExecution, pmm, posm, posmStock, stockEntry, route, shop, region, order and more. Nodemailer email, Puppeteer PDF, ExcelJS, Luxon, node-cron. Mobile uses Vision Camera, Geolocation, image-picker.",
    role:
      "Worked across the mobile app and backend — merchandising execution screens (gift status, stock carton/pcs, POSM/PMM), role-based access, and Android Gradle/AGP build & CI fixes.",
  },
  {
    id: "nupath",
    name: "NuPath — SafePlace",
    tag: "Multi-brand AI Wellness",
    blurb:
      "A multi-brand AI wellness coach that ships 3 white-label apps from one codebase.",
    unique:
      "One Expo codebase builds NuPath, NFL and Healthful, switched by APP_BRAND + APP_ENV flags via EAS profiles.",
    stack:
      "Expo SDK 54 + expo-router 6, React Native 0.81, React 19, TypeScript. Node + Express 4 + TypeScript backend.",
    visualStack: ["expo", "react-native", "typescript", "node", "redux", "mongodb"],
    state: "Redux Toolkit + RTK Query with 26 injected API slices.",
    auth:
      "Firebase Authentication (ID token → Bearer), plus Google & Apple Sign-In. Tenancy/roles via AuthContext. Backend verifies Firebase ID tokens with Firebase Admin.",
    db: "MongoDB (native driver) + Google BigQuery + Google Analytics Data API.",
    extra:
      "AI/voice stack: OpenAI, ElevenLabs voice agent, LiveKit + WebRTC realtime, Groq, a self-hosted FastAPI voice agent, and an Ollama coach with Tavily/YouTube search tools. Wearables via Apple HealthKit, Android Health Connect, Spike SDK. NativeWind, Reanimated 4, Skia, three.js, Cloudinary uploads.",
    role:
      "Contributed to the AI coach chatroom with resource cards, morning check-in flows, voice input, and wearable data sync; fixed cross-platform modal/blur behavior.",
  },
  {
    id: "omd-app",
    name: "OptimalMD — OMD App",
    tag: "Telehealth Mobile",
    blurb: "A telehealth member app for the OptimalMD / IamND brand.",
    unique:
      "Hand-written API layer — ~29 endpoint modules with a custom resolveAuthToken resolver instead of a generated client.",
    stack: "React Native 0.80.1 bare CLI, React 19, TypeScript.",
    visualStack: ["react-native", "typescript", "redux", "firebase"],
    state:
      "Redux Toolkit + redux-persist with 17 slices (auth, otp, coupon, plans, physician, pharmacy, aiAssistant, payments, glp…), plus a visitor RTK Query API.",
    auth:
      "JWT (Bearer access + refresh, persisted). Login via POST /auth/app-login with role-based user models (User / Dependent / etc.).",
    db: "Talks to the shared OptimalMD MongoDB backend (staging/prod toggle via IS_PRODUCTION flag).",
    extra:
      "OneSignal + Firebase messaging/analytics, React Navigation (stack + tabs), Reanimated, linear-gradient, render-html, video, youtube-iframe, webview, device-info, version-check.",
    role:
      "Resolved Android Gradle/AGP build issues, fixed safe-area/navigation overlap, and worked on UI flows and feature screens.",
  },
  {
    id: "omd-portal",
    name: "OptimalMD — Portal",
    tag: "Telehealth Web Admin",
    blurb: "A large telehealth / Rx admin platform with backend.",
    unique:
      "Security-first: WebAuthn passkeys + device fingerprinting + QR-based 2FA on top of classic JWT.",
    stack:
      "React 18 + Vite frontend (JavaScript), Node + Express 4 backend running as a Windows service over HTTPS.",
    visualStack: ["react", "vite", "node", "express", "redux", "mongodb"],
    state:
      "Redux Toolkit + RTK Query, heavily sliced (training, lab, rxMedication, pricing, visitor, AI, partners…).",
    auth:
      "JWT in localStorage → Bearer, plus WebAuthn/passkeys (@simplewebauthn) and device trust. Auth middleware resolves across many user models (User, Dependent, AffiliatePartner, SalesPartner, OrgAdmin, SupportAgent, TeamAdmin, Vendor…).",
    db: "MongoDB via Mongoose 8 (+ mongoose-sequence).",
    extra:
      "Authorize.Net payments, x12 EDI healthcare claims, Lyric integration, flow builder (@xyflow/react), i18next multi-language, react-pdf/html2pdf, Swagger docs, 60+ route files, migrations & seeders.",
    role:
      "Worked on securing backend API endpoints — role-based access control and an orgAccessGuard middleware to prevent cross-organization data access.",
  },
];
