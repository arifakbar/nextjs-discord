import { authMiddleware } from "@clerk/nextjs";

//const { authMiddleware } = require("@clerk/nextjs");

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/api/uploadthing"],
  ignoredRoutes: ["/((?!api|trpc))(_next|.+..+)(.*)", "/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
