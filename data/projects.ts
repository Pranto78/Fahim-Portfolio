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
  /** 2–3 short bullets shown on the project card. Keep each under ~70 chars. */
  highlights: string[];
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
    name: "Arla — Iconic",
    tag: "Field-Force Mobile",
    blurb:
      "A field-force app for FMCG sales & merchandising teams in the field.",
    highlights: [
      "Camera-first in-store evidence capture with on-device compression",
      "Offline-tolerant drafts that survive backgrounding and signal loss",
      "POSM/PMM execution module, activity and competitor screens",
    ],
    unique:
      "Built for low-connectivity field work — camera-first evidence capture, draft persistence, and a background sync layer that warms every catalog on login.",
    stack:
      "React Native 0.83 bare CLI, React 19, TypeScript, Axios, consuming a JWT-secured REST API.",
    visualStack: ["react-native", "typescript", "redux", "node", "express", "mongodb"],
    state:
      "Redux Toolkit + redux-persist across 8 feature slices, plus dedicated draft services so long in-store forms survive navigation, backgrounding and signal loss.",
    auth: "JWT stored in react-native-keychain (OS keystore/keychain) rather than AsyncStorage, behind a dedicated token storage service with silent logout on expiry.",
    db: "MongoDB-backed REST API consumed through 31 single-responsibility service modules with typed contracts per domain.",
    extra:
      "Geolocation-verified attendance, route/shop visits, POSM & PMM execution, competitor tracking, stock entries, orders, deliveries, gift handover and leave requests. react-native-vision-camera for evidence photos with client-side compression, QR shop check-in, backend-driven branding + OS dark mode, react-native-config env management, GitHub Actions CI.",
    role: "Worked across the mobile app's in-store execution flows. Reworked the camera-based evidence capture and fixed capture failures on older Android devices, built the caching and draft layer that keeps field data alive across navigation and restarts, delivered the POSM/PMM module (conditional item selection, quantity refresh, available-stock handling), redesigned the My Activities screen, resolved the competitor tracking page, and did a broad UI/UX pass.",
  },
  {
    id: "nupath",
    name: "NuPath — NFL",
    tag: "Mobile App for the NFL Alumni",
    blurb:
      "An AI health-coaching app for the NFL Alumni Association and its members.",
    highlights: [
      "AI chat plus realtime voice coaching interactions",
      "Wearable sleep data feeding personalised health & mood insights",
      "Morning, midday and evening check-in flows",
    ],
    unique:
      "One Expo codebase builds NuPath, NFL and Healthful, switched by APP_BRAND + APP_ENV flags via EAS profiles.",
    stack:
      "Expo SDK 54 + expo-router 6, React Native 0.81, React 19, TypeScript. Node + Express 4 + TypeScript backend.",
    visualStack: [
      "expo",
      "react-native",
      "typescript",
      "node",
      "redux",
      "mongodb",
    ],
    state: "Redux Toolkit + RTK Query with 26 injected API slices.",
    auth: "Firebase Authentication (ID token → Bearer), plus Google & Apple Sign-In. Tenancy/roles via AuthContext. Backend verifies Firebase ID tokens with Firebase Admin.",
    db: "MongoDB (native driver) + Google BigQuery + Google Analytics Data API.",
    extra:
      "AI/voice stack: OpenAI, ElevenLabs voice agent, LiveKit + WebRTC realtime, Groq, a self-hosted FastAPI voice agent, and an Ollama coach with Tavily/YouTube search tools. Wearables via Apple HealthKit, Android Health Connect, Spike SDK. NativeWind, Reanimated 4, Skia, three.js, Cloudinary uploads.",
    role: "Contributed to the NFL AI Coach app by building AI chat, voice interactions, wearable sleep data integration, personalized health & mood insights, nutrition recommendations, and morning/midday/evening check-in flows.",
  },
  {
    id: "omd-app",
    name: "OptimalMD — OMD App",
    tag: "Telehealth Mobile",
    blurb:
      "The member app for a US healthcare membership & telehealth platform.",
    highlights: [
      "API-driven care-service cards the business edits from the portal",
      "Server-driven spotlight onboarding tour, no release needed to change it",
      "Runtime white-label theming — logo, palette and gradients from the API",
    ],
    unique:
      "White-label by design — branding, care-service cards and onboarding steps all come from the API at runtime, so one binary serves multiple partner brands.",
    stack:
      "React Native 0.80 bare CLI, React 19, TypeScript, shipped to both the App Store and Play Store.",
    visualStack: ["react-native", "typescript", "redux", "firebase"],
    state:
      "Redux Toolkit + redux-persist with 17 slices (auth, otp, coupon, plans, physician, pharmacy, aiAssistant, payments, glp…), plus a visitor RTK Query API.",
    auth: "JWT (Bearer access + refresh, persisted) via POST /auth/app-login with role-based user models (User / Dependent / etc.), automatic session-expiry handling, and a token handoff into the AI assistant WebView.",
    db: "Talks to the shared OptimalMD MongoDB backend (staging/prod toggle via IS_PRODUCTION flag).",
    extra:
      "Hand-written API layer of ~29 endpoint modules with a custom resolveAuthToken resolver. Dual push stack — OneSignal for campaigns + Firebase Messaging for transactional — with deep links (optimalmd:// plus verified Android App Links) routing notifications to the right screen. Guided spotlight onboarding tour built with SVG masks + Reanimated. Force-update gate on launch, AI health assistant WebView, Firebase Analytics, React Navigation 7, render-html, video, youtube-iframe, device-info, version-check.",
    role: "Built the app's dynamic care-service cards, Training Center and guided onboarding tour. Turned the hardcoded home screen into an API-driven catalog (pharmacy, labs, imaging, behavioral health, GLP-1 and more) the business can edit from the portal, built the Training Center with its video carousel, and rebuilt the tour for the new cards — including tracking down a nondeterministic bug where a duplicate sidebar host made the spotlight target the wrong element after re-login. Also implemented runtime brand/logo/colour theming, session-expiry handling, load-performance work on the AI assistant and profile screens, and fixes for Android Gradle/AGP builds and safe-area/navigation overlap.",
  },
  {
    id: "textmed",
    name: "TextMed Health",
    tag: "White-Label Telehealth",
    blurb:
      "A white-label OptimalMD build, open only to organisation members.",
    highlights: [
      "Closed access — organisation members only, no public member login",
      "Plan-gated home cards and navigation tabs from one codebase",
      "Own brand, bundle id and care catalog on the shared backend",
    ],
    unique:
      "A white-label of the OptimalMD app restricted to the OptimalMD organisation — regular members can't sign in, only users belonging to the organisation. Same codebase and backend, different bundle id, brand and care catalog, with the UI gated by the member's plan.",
    stack:
      "React Native 0.80 bare CLI, React 19, TypeScript — a rebranded build of the OptimalMD mobile codebase.",
    visualStack: ["react-native", "typescript", "redux", "firebase"],
    state:
      "Shares the OptimalMD Redux Toolkit + redux-persist architecture, with plan-aware selectors driving which surfaces render.",
    auth: "Organisation-scoped login on top of the shared OptimalMD JWT auth — the account has to belong to the OptimalMD organisation, so ordinary members can't log in here. Role-based user models carry over from OptimalMD.",
    db: "Runs against the shared OptimalMD MongoDB backend under its own brand and organisation configuration.",
    extra:
      "Distinct bundle identifier and brand assets, and a different care-service catalog — in-person visit scheduling, local urgent care and imaging scheduling in place of the OptimalMD-only programs. Because access is organisation-only, the app skips public signup entirely and members arrive already provisioned.",
    role: "Implemented plan-gated rendering of home-screen cards and navigation tabs. That gating is what lets a single codebase serve different brands and subscription tiers; also built the organisation login flow that restricts the app to organisation members, plus the contact and follow-up surfaces.",
  },
  {
    id: "omd-portal",
    name: "OptimalMD — Portal",
    tag: "Telehealth Web Admin",
    blurb:
      "The multi-role admin, clinic and partner portal behind the platform.",
    highlights: [
      "Dynamic commission calculation inside plan management",
      "Organisation onboarding pipeline with its review flow",
      "orgAccessGuard RBAC blocking cross-organisation data access",
    ],
    unique:
      "One portal, many audiences — separate dashboards for admins, org admins, clinics, sales partners and affiliates, on a security-first stack of WebAuthn passkeys, device fingerprinting and QR-based 2FA over classic JWT.",
    stack:
      "React 18 + Vite + Tailwind frontend, Node + Express 4 backend running as a Windows service over HTTPS.",
    visualStack: ["react", "vite", "node", "express", "redux", "mongodb"],
    state:
      "Redux Toolkit + RTK Query, heavily sliced (training, lab, rxMedication, pricing, visitor, AI, partners…).",
    auth: "JWT in localStorage → Bearer, plus WebAuthn/passkeys (@simplewebauthn) and device trust. Auth middleware resolves across many user models (User, Dependent, AffiliatePartner, SalesPartner, OrgAdmin, SupportAgent, TeamAdmin, Vendor…).",
    db: "MongoDB via Mongoose 8 (+ mongoose-sequence) — 80+ schemas across 70+ route modules, with a custom migration and seeder framework.",
    extra:
      "Subscription and commission engine (phased billing, coupons, plan groups, affiliate and sub-affiliate accrual), Authorize.Net and Stripe payments, x12 EDI healthcare claims, Lyric integration, visual automation/flow builder (@xyflow/react), Recharts financial dashboards, i18next multi-language, Nodemailer templating engine, node-cron scheduled billing and follow-up jobs, react-pdf/html2pdf and ExcelJS exports, Swagger docs.",
    role: "Built dynamic commission calculation and the organisation onboarding pipeline. Delivered the onboarding review section, fixed email-flow defects including duplicate sends, and secured backend API endpoints with role-based access control and an orgAccessGuard middleware that prevents cross-organisation data access — plus filters, the plan-upgrade flow and navigation work on the frontend.",
  },
];
