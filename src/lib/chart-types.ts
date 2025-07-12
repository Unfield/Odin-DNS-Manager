export const CHART_TYPE = {
  Area: "Area",
  Bar: "Bar",
};

export type ChartType = keyof typeof CHART_TYPE;

export const chartTypeLabels: Record<ChartType, string> = {
  Area: "Area Chart",
  Bar: "Bar Chart",
};
