import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  console.log ("Proxy is working here");
  return await updateSession(request)
  // if (request.nextUrl.pathname.startsWith('/profile')) {
  //   console.log ("doing profile");
  // }

  // if (request.nextUrl.pathname.startsWith('/api/backend2')) {
  //   // Logic for proxying requests to backend2
  // }

  // Default proxy logic or passthrough
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}