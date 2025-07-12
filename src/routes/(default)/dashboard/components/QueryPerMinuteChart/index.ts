import Root from "./QueryPerMinuteChart.svelte";

export { Root, Root as QueryPerMinuteChart };

export type ChartDataType = {
  time: string;
  requests: number;
  errors: number;
  percentage: number;
}[];
