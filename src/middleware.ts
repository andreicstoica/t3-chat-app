import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "~/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if this is a protected route (chat routes)
    const isProtectedRoute = pathname.startsWith('/chat');

    // Check if this is an auth route (signin/signup)
    const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');

    if (isProtectedRoute || isAuthRoute) {
        try {
            // Get session from the request
            const session = await auth.api.getSession({
                headers: request.headers
            });

            const isAuthenticated = !!session?.user;

            // Redirect unauthenticated users away from protected routes
            if (isProtectedRoute && !isAuthenticated) {
                return NextResponse.redirect(new URL('/', request.url));
            }

            // Redirect authenticated users away from auth routes
            if (isAuthRoute && isAuthenticated) {
                return NextResponse.redirect(new URL('/chat', request.url));
            }
        } catch (error) {
            // If there's an error checking auth, redirect to home for protected routes
            if (isProtectedRoute) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: []  // Temporarily disable middleware
};