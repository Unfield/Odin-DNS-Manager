import { redirect, type RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fetchApi } from "$lib/utils/api";
import { ODIN_SESSION_ID, ODIN_SESSION_TOKEN } from "$lib/types";

interface SignOutResponse {
  success: boolean;
}

interface SignOutAPIError {
  error: boolean;
  error_message: string;
}

export const load: PageServerLoad = async ({ params, cookies }) => {
  const sessionId = cookies.get(ODIN_SESSION_ID);
  const sessionToken = cookies.get(ODIN_SESSION_TOKEN);
  if (!sessionId || !sessionToken) {
    console.error("No session ID or TOKEN found in cookies.");
    throw redirect(302, "/auth/signin");
  }

  const [data, err] = await fetchApi<SignOutResponse, SignOutAPIError>(
    "/api/v1/logout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
      returnType: "text",
    },
  );

  cookies.delete(ODIN_SESSION_ID, { path: "/" });
  cookies.delete(ODIN_SESSION_TOKEN, { path: "/" });

  throw redirect(302, "/auth/signin");
};
