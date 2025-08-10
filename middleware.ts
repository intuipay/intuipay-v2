import type { auth } from "@/lib/auth";
import { User } from "better-auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  // 本地开发启用，上线要注释掉
  const mockUser = {
    id: 'jXqDtVMvNv1vf81izMoLabAkoOlQX5P1',
    email: process.env.MOCK_USER_EMAIL || 'dev@example.com',
    name: process.env.MOCK_USER_NAME || 'Dev User',
    image: process.env.MOCK_USER_IMAGE || '',
  };

  const mockRequestHeaders = new Headers(request.headers);
  mockRequestHeaders.set('x-user-id', mockUser.id);
  mockRequestHeaders.set('x-user-email', mockUser.email);
  mockRequestHeaders.set('x-user-name', mockUser.name);
  mockRequestHeaders.set('x-user-image', mockUser.image);

  const mockModifiedRequest = new NextRequest(request.url, {
    headers: mockRequestHeaders,
    method: request.method,
    body: request.body
  });

  return NextResponse.next({
    request: mockModifiedRequest
  });

  const response = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const json = (await response.json()) as { session: Session, user: User };

  if (!json?.session) {
    return NextResponse.redirect(new URL(
      `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/login`,
      request.url,
    ));
  }

  // Add user info to the request headers
  // This lets other parts of the app access the user data
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', json.user.id);
  requestHeaders.set('x-user-email', json.user.email);
  requestHeaders.set('x-user-name', json.user.name || '');
  requestHeaders.set('x-user-image', json.user.image || '');

  // Create a new request with the updated headers
  const modifiedRequest = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
    body: request.body
  });

  // Use the modified request when calling next()
  return NextResponse.next({
    request: modifiedRequest
  });
}

export const config = {
  matcher: [
    "/api/profile",
    "/profile",
  ],
};
