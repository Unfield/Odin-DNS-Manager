import { ODIN_SESSION_ID, ODIN_SESSION_TOKEN } from "$lib/types";
import { fetchApi } from "$lib/utils/api";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname === "/") throw redirect(302, "/dashboard");

  const protectedRoutes = ["/dashboard", "/settings", "/profile"];
  const authRoutes = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    event.url.pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.includes(event.url.pathname);
  const sessionId = event.cookies.get(ODIN_SESSION_ID);
  const sessionToken = event.cookies.get(ODIN_SESSION_TOKEN);

  if (isProtectedRoute && (!sessionToken || !sessionId)) {
    throw redirect(
      302,
      `/auth/signin?error=no_session&redirected_from=${encodeURIComponent(event.url.pathname)}`,
    );
  }

  if (isAuthRoute && sessionId && sessionToken) {
    throw redirect(302, "/dashboard");
  }

  if (!sessionId || !sessionToken) {
    const response = await resolve(event);
    return response;
  }

  interface FetchUserResponse {
    id: string;
    username: string;
    email: string;
    avatar: string;
  }

  interface FetchUserError {
    error: boolean;
    error_message: string;
  }

  const [data, err] = await fetchApi<FetchUserResponse, FetchUserError>(
    `/api/v1/user/${sessionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      method: "GET",
    },
  );

  if (err || !data) {
    console.error("Error fetching user data:", err);
    throw redirect(
      302,
      `/auth/signin?error=fetch_user_failed&redirected_from=${encodeURIComponent(event.url.pathname)}`,
    );
  }

  data.avatar = `https://api.dicebear.com/9.x/thumbs/svg?seed=${data.username}`;

  event.locals.user = {
    id: data.id,
    username: data.username,
    email: data.email,
    avatar: data.avatar,
    token: sessionToken,
  };

  const response = await resolve(event);
  return response;
};
