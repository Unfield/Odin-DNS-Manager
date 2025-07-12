import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { z } from "zod/v4";
import { message } from "sveltekit-superforms";
import { fail } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const schema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
  password_check: z.string().nonempty(),
});

export const load: PageServerLoad = async ({ params }) => {
  const form = await superValidate(zod4(schema));

  return { form };
};

export const actions = {
  default: async ({ request }: RequestEvent) => {
    const form = await superValidate(request, zod4(schema));
    console.log(form);

    if (!form.valid) {
      return fail(400, { form });
    }
  },
};
