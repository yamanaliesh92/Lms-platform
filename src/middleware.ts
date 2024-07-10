import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import createIntlMiddleware from "next-intl/middleware";

const locales = ["en", "ar"];

// const isProtectedRoute = createRouteMatcher([
//   "/:locale/teacher",
//   // "/:locale/search",
// ]);
const isPublicRoute = createRouteMatcher([
  "/:locale/sign-in",
  "/:locale/sign-up",
  "/api/uploadthing",
]);
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
  if (request.nextUrl.pathname.includes("/api")) {
    return;
  }

  const response = intlMiddleware(request);
  return response;
});

// export default function middleware((auth,req: NextRequest) {
//   if (!isPublicRoute(req)) {
//     auth().protect({});
//   }

//   if (req.nextUrl.pathname.includes("/api")) {
//     return;
//   }

//   const response = intlMiddleware(req);

//   return response;
// }

export const config = {
  // matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
