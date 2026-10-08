import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the environment variables are not set, skip the Supabase proxy check.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // Create a new Supabase server client for every request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh/validate the Supabase session.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  /*
   * Public routes:
   *
   * /
   * /login
   * /auth/*
   * /r/*
   * /api/*
   *
   * Everything else requires authentication.
   */
  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/r/") ||
    request.nextUrl.pathname.startsWith("/api/");

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";

    return NextResponse.redirect(url);
  }

  /*
   * IMPORTANT:
   * Return the existing Supabase response so authentication
   * cookies are preserved correctly.
   */
  return supabaseResponse;
}