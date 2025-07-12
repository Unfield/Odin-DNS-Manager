export interface User {
  id: string;
  username: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
}

export interface Zone {
  id: string;
  owner: string;
  name: string;
  created_at: string;
  expires_at: string;
  status: string;
  registrant: string;
}

export interface ZoneRecord {
  id: string;
  zone_id: string;
  name: string;
  type: string;
  class: string;
  ttl: number;
  priority: number | null;
  value: string;
}

export const ZoneEntryType = {
  A: "A",
  AAAA: "AAAA",
  MX: "MX",
};

export type TZoneEntryType = keyof typeof ZoneEntryType;

export interface GenericErrorResponse {
  error: boolean;
  error_message: string;
}

export interface TimeSeriesData {
  errors: number;
  requests: number;
  time: string;
}

export interface RCodeDistributionData {
  rcode: string;
  count: number;
  rcodeName: string;
}

export interface QPMData {
  time: string;
  requests: number;
  errors: number;
  percentage: number;
}

export interface TopDomainsData {
  name: string;
  count: number;
}

export const ODIN_SESSION_ID = "odin_session_id";
export const ODIN_SESSION_TOKEN = "odin_session_token";
