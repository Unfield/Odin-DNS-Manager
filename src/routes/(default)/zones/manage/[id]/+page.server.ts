import type { GenericErrorResponse, ZoneRecord } from "$lib/types";
import { fetchApi } from "$lib/utils/api";
import type { PageServerLoad } from "./$types";

interface APIZoneRecord {
  id: string;
  name: string;
  type: string;
  class: string;
  ttl: number;
  priority: number | null;
  value: string;
}

interface APIData {
  count: number;
  records: APIZoneRecord[];
}

interface APIZoneData {
  name: string;
}

export const load: PageServerLoad = async ({ locals, params }) => {
  const [data, error] = await fetchApi<APIData, GenericErrorResponse>(
    `/api/v1/zone/${params.id}/entries`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${locals.user.token}`,
        "Content-Type": "application/json",
      },
      returnType: "json",
    },
  );

  const [zoneData, zoneError] = await fetchApi<
    APIZoneData,
    GenericErrorResponse
  >(`/api/v1/zone/${params.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${locals.user.token}`,
      "Content-Type": "application/json",
    },
    returnType: "json",
  });

  const zoneEntries: ZoneRecord[] = [];

  if (error || !data || !data.records || data.count < 1)
    return {
      zoneEntries,
      zoneData: null,
    };

  return {
    zoneEntries: makeNewZoneEntryArray(
      data.records,
      params.id,
      zoneData?.name || "",
      locals.user,
    ),
    zoneName: zoneData?.name || "N/A",
  };
};

function makeNewZoneEntryArray(
  data: APIZoneRecord[],
  zoneId: string,
  zoneName: string,
  user: App.Locals["user"],
): ZoneRecord[] {
  return data.map((entry) => {
    return {
      id: entry.id,
      zone_id: zoneId,
      name: entry.name.replace(zoneName, ""),
      type: entry.type,
      class: entry.class,
      priority: entry.priority,
      ttl: entry.ttl,
      value: entry.value,
    };
  });
}
