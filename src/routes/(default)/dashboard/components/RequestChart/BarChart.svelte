<script lang="ts" module>
    import { CHART_TYPE } from "$lib/chart-types";
    import { type WithElementRef } from "$lib/utils.js";
    import type {
        HTMLAnchorAttributes,
        HTMLButtonAttributes,
    } from "svelte/elements";

    export type ChartProps = WithElementRef<HTMLButtonAttributes> &
        WithElementRef<HTMLAnchorAttributes> & {
            chartData?: TimeSeriesData[];
        };
</script>

<script lang="ts">
    import { scaleBand } from "d3-scale";
    import { BarChart, type ChartContextValue } from "layerchart";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { cubicInOut } from "svelte/easing";
    import type { TimeSeriesData } from "$lib/types";

    let { chartData }: ChartProps = $props();

    const chartConfig = {
        requests: { label: "Requests", color: "var(--chart-2)" },
        errors: { label: "Errors", color: "var(--chart-1)" },
    } satisfies Chart.ChartConfig;
    let context = $state<ChartContextValue>();
</script>

<Chart.Container config={chartConfig}>
    <BarChart
        bind:context
        data={chartData}
        xScale={scaleBand().padding(0.25)}
        x="time"
        axis="x"
        series={[
            {
                key: "requests",
                label: "Resolved",
                color: chartConfig.requests.color,
            },
            {
                key: "errors",
                label: "Errors",
                color: chartConfig.errors.color,
            },
        ]}
        x1Scale={scaleBand().paddingInner(0.2)}
        seriesLayout="group"
        rule={false}
        props={{
            bars: {
                stroke: "none",
                strokeWidth: 0,
                rounded: "all",
                // use the height of the chart to animate the bars
                initialY: context?.height,
                initialHeight: 0,
                motion: {
                    y: { type: "tween", duration: 500, easing: cubicInOut },
                    height: {
                        type: "tween",
                        duration: 500,
                        easing: cubicInOut,
                    },
                },
            },
            highlight: { area: { fill: "none" } },
            xAxis: {
                format: (d) => {
                    const date = new Date(d);
                    const day = date.getDate();

                    if (!chartData) return "";

                    if (chartData.length <= 10) {
                        return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        });
                    }

                    if (chartData.length >= 20) {
                        const showEvery = Math.ceil(chartData.length / 8);
                        if (
                            chartData.length % showEvery === 0 ||
                            day === 1 ||
                            day === 15
                        ) {
                            return day.toString();
                        }
                        return "";
                    }

                    return day.toString();
                },
            },
        }}
    >
        {#snippet tooltip()}
            <Chart.Tooltip indicator="dashed" />
        {/snippet}
    </BarChart>
</Chart.Container>
