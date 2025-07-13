import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { z } from "zod/v4";
import { message } from "sveltekit-superforms";
import { redirect, type RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fetchApi } from "$lib/utils/api";
import { NODE_ENV } from "$env/static/private";
import { ODIN_SESSION_ID, ODIN_SESSION_TOKEN } from "$lib/types";

const schema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
  remember_me: z.boolean().default(false),
});

export const load: PageServerLoad = async ({ params, url }) => {
  const form = await superValidate(zod4(schema));

  return { form };
};

interface LoginResponse {
  session_id: string;
  token: string;
  username: string;
}

interface LoginAPIError {
  error: boolean;
  error_message: string;
}

export const actions = {
  default: async ({ request, cookies, url }: RequestEvent) => {
    console.log("I got called");
    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
      return message(form, { type: "error", text: "Form invalid!" });
    }

    const [data, err] = await fetchApi<LoginResponse, LoginAPIError>(
      "/api/v1/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.data.username,
          password: form.data.password,
        }),
      },
    );

    if (err || !data) {
      return message(form, {
        type: "error",
        text: err?.data?.error_message || "Unknown error occurred.",
      });
    }

    const cookieOptions = {
      path: "/",
      sameSite: false,
      secure: NODE_ENV === "production",
      httpOnly: true,
      maxAge: form.data.remember_me ? 60 * 60 * 24 * 30 : undefined,
    };
    cookies.set(ODIN_SESSION_ID, data.session_id, cookieOptions);
    cookies.set(ODIN_SESSION_TOKEN, data.token, cookieOptions);

    throw redirect(
      303,
      url.searchParams.get("redirected_from") || "/dashboard",
    );
  },
};
