import type { ChartType } from "$lib/chart-types";
import { createLocalStorageStore } from "$lib/hooks/localStorage";

export interface ChartPreferences {
  requestErrorChart: {
    type: ChartType;
  };
}

export const chartPreferences = createLocalStorageStore<ChartPreferences>(
  "chartPreferences",
  {
    requestErrorChart: {
      type: "Area",
    },
  },
);
