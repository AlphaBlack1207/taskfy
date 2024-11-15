import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])

export default clerkMiddleware(async (auth, request) => {
  const { userId, orgId, redirectToSignIn } = await auth()

  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  if (userId && isPublicRoute(request)) {
    let path = '/select-org'
    if (orgId) {
      path = `/organization/${orgId}`
    }
    const orgSelection = new URL(path, request.url)
    return NextResponse.redirect(orgSelection)
  }

  if (!userId && !isPublicRoute) {
    return redirectToSignIn({ returnBackUrl: request.url })
  }

  if (userId && !orgId && request.nextUrl.pathname !== '/select-org') {
    const orgSelection = new URL('/select-org', request.url)
    return NextResponse.redirect(orgSelection)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
