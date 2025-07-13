import type { GenericErrorResponse, Zone } from "$lib/types";
import { fetchApi } from "$lib/utils/api";
import type { PageServerLoad } from "./$types";

interface APIZone {
  id: string;
  name: string;
  created_at: string;
  deleted_at: string | null;
}

interface APIData {
  count: number;
  zones: APIZone[];
}

export const load: PageServerLoad = async ({ locals }) => {
  const [data, error] = await fetchApi<APIData, GenericErrorResponse>(
    "/api/v1/zones",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${locals.user.token}`,
        "Content-Type": "application/json",
      },
      returnType: "json",
    },
  );

  const zones: Zone[] = [];

  if (error || !data || !data.zones || data.count < 1)
    return {
      zones,
    };

  return {
    zones: makeNewZoneArray(data.zones, locals.user),
  };
};

function makeNewZoneArray(data: APIZone[], user: App.Locals["user"]): Zone[] {
  return data.map((entry) => {
    return {
      id: entry.id,
      owner: user.id,
      name: entry.name,
      created_at: entry.created_at,
      expires_at: entry.deleted_at || "N/A",
      status: "OK",
      registrant: user.username,
    };
  });
}
