// =========================================================================
// ICON REGISTRY — shared with remoteControl (identical copy there).
// The database stores the key (e.g. "SiReact"); both apps resolve it here.
// To add an icon: import it in BOTH copies and add it to the right group.
// Anything not in this list can be uploaded as an image in remoteControl.
// =========================================================================
import type { IconType } from "react-icons";
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiExpo, SiTailwindcss, SiHtml5, SiCss,
  SiNodedotjs, SiNestjs, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiRedux, SiDocker, SiGit,
  SiGithub, SiCplusplus, SiVite, SiFirebase, SiPython, SiDjango, SiFlask, SiFastapi, SiGo, SiRust,
  SiKotlin, SiSwift, SiFlutter, SiDart, SiPhp, SiLaravel, SiVuedotjs, SiAngular, SiSvelte,
  SiGraphql, SiPrisma, SiSupabase, SiRedis, SiKubernetes, SiGooglecloud, SiVercel, SiNetlify,
  SiFigma, SiPostman, SiJest, SiSass, SiBootstrap, SiMui, SiShadcnui, SiClerk, SiStripe,
  SiSocketdotio, SiLinux, SiNginx, SiClaude, SiGooglegemini, SiAnthropic, SiLangchain, SiSqlite,
  SiJquery, SiWebpack, SiNpm, SiYarn, SiPnpm, SiGithubactions, SiJsonwebtokens, SiAxios,
  SiReactquery, SiReacthookform, SiZod, SiFramer, SiThreedotjs, SiAndroid, SiApple, SiIos, SiC,
  SiDotnet, SiSpring, SiSpringboot, SiMariadb, SiElectron, SiTauri, SiCloudflare, SiRender,
  SiRailway, SiTrpc, SiStorybook, SiCypress, SiPuppeteer, SiSelenium, SiJira, SiNotion, SiDiscord,
  SiTrello, SiBlender, SiUnity, SiUnrealengine, SiArduino, SiRaspberrypi, SiTensorflow, SiPytorch,
  SiPandas, SiNumpy, SiJupyter, SiHuggingface, SiOllama, SiCrunchyroll, SiNetflix, SiSpotify,
  SiYoutube,
} from "react-icons/si";
import {
  LuPlaneTakeoff, LuCodeXml, LuBrainCircuit, LuGamepad2, LuClapperboard, LuTv, LuMusic, LuCamera,
  LuBookOpen, LuDumbbell, LuBike, LuCoffee, LuMountain, LuPalette, LuUtensils, LuTrophy, LuHeart,
  LuGlobe, LuCode, LuSparkles, LuBriefcase, LuMapPin, LuGraduationCap, LuAward, LuStar, LuRocket,
  LuCpu, LuDatabase, LuServer, LuSmartphone, LuMonitor, LuCloud, LuShield, LuLock, LuWrench,
  LuLayers, LuPenTool, LuPencil, LuMic, LuHeadphones, LuPlane, LuCar, LuWaves, LuTrees, LuSun,
  LuMoon, LuFlame, LuZap, LuLanguages, LuUsers, LuMessageCircle, LuMail, LuPhone, LuLink,
  LuTerminal, LuBot, LuBrain, LuChefHat, LuShoppingBag, LuDog, LuCat, LuFootprints, LuSwords,
  LuBookMarked, LuFilm, LuPopcorn, LuGuitar, LuPiano, LuTent, LuShip, LuTrainFront, LuVolleyball,
  LuSprout,
} from "react-icons/lu";
import { FaJava, FaFutbol, FaBasketball, FaChess, FaAws, FaMicrosoft, FaWindows } from "react-icons/fa6";
import { TbBrandCSharp, TbBrandReactNative, TbApi, TbBrandVscode } from "react-icons/tb";

export const TECH_ICONS: Record<string, IconType> = {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiExpo, SiTailwindcss, SiHtml5, SiCss,
  SiNodedotjs, SiNestjs, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiRedux, SiDocker, SiGit,
  SiGithub, SiCplusplus, SiVite, SiFirebase, SiPython, SiDjango, SiFlask, SiFastapi, SiGo, SiRust,
  SiKotlin, SiSwift, SiFlutter, SiDart, SiPhp, SiLaravel, SiVuedotjs, SiAngular, SiSvelte,
  SiGraphql, SiPrisma, SiSupabase, SiRedis, SiKubernetes, SiGooglecloud, SiVercel, SiNetlify,
  SiFigma, SiPostman, SiJest, SiSass, SiBootstrap, SiMui, SiShadcnui, SiClerk, SiStripe,
  SiSocketdotio, SiLinux, SiNginx, SiClaude, SiGooglegemini, SiAnthropic, SiLangchain, SiSqlite,
  SiJquery, SiWebpack, SiNpm, SiYarn, SiPnpm, SiGithubactions, SiJsonwebtokens, SiAxios,
  SiReactquery, SiReacthookform, SiZod, SiFramer, SiThreedotjs, SiAndroid, SiApple, SiIos, SiC,
  SiDotnet, SiSpring, SiSpringboot, SiMariadb, SiElectron, SiTauri, SiCloudflare, SiRender,
  SiRailway, SiTrpc, SiStorybook, SiCypress, SiPuppeteer, SiSelenium, SiJira, SiNotion, SiDiscord,
  SiTrello, SiBlender, SiUnity, SiUnrealengine, SiArduino, SiRaspberrypi, SiTensorflow, SiPytorch,
  SiPandas, SiNumpy, SiJupyter, SiHuggingface, SiOllama,
  FaJava, FaAws, FaMicrosoft, FaWindows,
  TbBrandCSharp, TbBrandReactNative, TbApi, TbBrandVscode,
};

export const GENERAL_ICONS: Record<string, IconType> = {
  LuPlaneTakeoff, LuCodeXml, LuBrainCircuit, LuGamepad2, LuClapperboard, LuTv, LuMusic, LuCamera,
  LuBookOpen, LuDumbbell, LuBike, LuCoffee, LuMountain, LuPalette, LuUtensils, LuTrophy, LuHeart,
  LuGlobe, LuCode, LuSparkles, LuBriefcase, LuMapPin, LuGraduationCap, LuAward, LuStar, LuRocket,
  LuCpu, LuDatabase, LuServer, LuSmartphone, LuMonitor, LuCloud, LuShield, LuLock, LuWrench,
  LuLayers, LuPenTool, LuPencil, LuMic, LuHeadphones, LuPlane, LuCar, LuWaves, LuTrees, LuSun,
  LuMoon, LuFlame, LuZap, LuLanguages, LuUsers, LuMessageCircle, LuMail, LuPhone, LuLink,
  LuTerminal, LuBot, LuBrain, LuChefHat, LuShoppingBag, LuDog, LuCat, LuFootprints, LuSwords,
  LuBookMarked, LuFilm, LuPopcorn, LuGuitar, LuPiano, LuTent, LuShip, LuTrainFront, LuVolleyball,
  LuSprout,
  FaFutbol, FaBasketball, FaChess,
  SiCrunchyroll, SiNetflix, SiSpotify, SiYoutube,
};

export const ALL_ICONS: Record<string, IconType> = { ...TECH_ICONS, ...GENERAL_ICONS };

export function resolveIcon(key: string | undefined | null): IconType | null {
  if (!key) return null;
  return ALL_ICONS[key] ?? null;
}
