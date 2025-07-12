import Root from "./RequestChart.svelte";

export { Root, Root as RequestChart };

export type ChartDataType = {
  time: string;
  requests: number;
  errors: number;
}[];
