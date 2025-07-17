<script lang="ts">
    import * as Chart from "$lib/components/ui/chart/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { BarChart, type ChartContextValue, Highlight } from "layerchart";
    import { cubicInOut } from "svelte/easing";
    import { fetchApiWithLoading } from "$lib/utils/apiWithStatemachine";
    import { onMount } from "svelte";
    import * as userStore from "$lib/stores/userStore.svelte";
    import { RotateCcwIcon } from "@lucide/svelte";
    import type { GenericErrorResponse, QPMData } from "$lib/types";

    const chartConfig = {
        requests: { label: "Requests", color: "var(--chart-2)" },
        errors: { label: "Errors", color: "var(--chart-1)" },
        percentage: { label: "Success Rate", color: "var(--chart-3)" },
    } satisfies Chart.ChartConfig;

    let context = $state<ChartContextValue>();
    let activeChart = $state<keyof typeof chartConfig>("requests");

    let {
        data: qpmData,
        loading,
        error,
        fetch: loadQpmData,
    } = fetchApiWithLoading<QPMData[], GenericErrorResponse>(
        "/api/v1/metrics/qpm",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${userStore.getUser()?.token}`,
                "Content-Type": "application/json",
            },
            returnType: "json",
        },
    );

    onMount(() => {
        loadQpmData();
    });

    const parsedChartData = $derived(
        $qpmData?.map((item) => ({
            ...item,
            time: new Date(item.time),
            percentage:
                item.percentage ??
                ((item.requests - item.errors) / item.requests) * 100,
        })),
    );

    const total = $derived({
        requests: $qpmData?.reduce(
            (acc, curr) => acc + (curr.requests || 0),
            0,
        ),
        errors: $qpmData?.reduce((acc, curr) => acc + (curr.errors || 0), 0),
        percentage: (() => {
            const totalRequests =
                $qpmData?.reduce(
                    (acc, curr) => acc + (curr.requests || 0),
                    0,
                ) || 0;
            const totalErrors =
                $qpmData?.reduce((acc, curr) => acc + (curr.errors || 0), 0) ||
                0;

            return totalRequests > 0
                ? ((totalRequests - totalErrors) / totalRequests) * 100
                : 0;
        })(),
    });

    const activeSeries = $derived([
        {
            key: activeChart,
            label: chartConfig[activeChart].label,
            color: chartConfig[activeChart].color,
        },
    ]);

    function calcTicks(length: number): number {
        if (length < 20) return 1;
        if (length < 30) return 3;
        if (length < 40) return 4;
        if (length < 50) return 5;
        if (length < 60) return 6;
        return 6;
    }
</script>

<Card.Root class="h-full w-full">
    <Card.Header
        class="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row"
    >
        <div
            class="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6"
        >
            <Card.Title>DNS Metrics</Card.Title>
            <Card.Description>
                Showing DNS requests, errors, and success rates
            </Card.Description>
        </div>
        <div class="flex">
            {#each Object.keys(chartConfig) as key (key)}
                {@const chart = key as keyof typeof chartConfig}
                <button
                    data-active={activeChart === chart}
                    class="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onclick={() => (activeChart = chart)}
                >
                    <span class="text-muted-foreground text-xs">
                        {chartConfig[chart].label}
                    </span>
                    <span class="text-lg font-bold leading-none sm:text-3xl">
                        {#if chart === "percentage"}
                            {total[chart].toFixed(1)}%
                        {:else}
                            {total[chart]?.toLocaleString()}
                        {/if}
                    </span>
                </button>
            {/each}
            <button
                class="hover:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onclick={() => loadQpmData()}
            >
                <RotateCcwIcon />
            </button>
        </div>
    </Card.Header>
    <Card.Content class="px-2 sm:p-6">
        <Chart.Container
            config={chartConfig}
            class="aspect-auto h-[250px] w-full"
        >
            <BarChart
                bind:context
                data={parsedChartData}
                x="time"
                y={activeChart}
                series={activeSeries}
                props={{
                    bars: {
                        stroke: "none",
                        rounded: "none",
                        initialY: context?.height,
                        initialHeight: 0,
                        motion: {
                            y: {
                                type: "tween",
                                duration: 500,
                                easing: cubicInOut,
                            },
                            height: {
                                type: "tween",
                                duration: 500,
                                easing: cubicInOut,
                            },
                        },
                    },
                    highlight: { area: { fill: "none" } },
                    xAxis: {
                        format: (d: Date) => {
                            return d.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                        },
                        ticks: calcTicks($qpmData?.length || 0),
                    },
                    yAxis: {
                        format:
                            activeChart === "percentage"
                                ? (d: number) => `${d}%`
                                : undefined,
                    },
                }}
            >
                {#snippet belowMarks()}
                    <Highlight area={{ class: "fill-muted" }} />
                {/snippet}
                {#snippet tooltip()}
                    <Chart.Tooltip
                        nameKey={activeChart}
                        labelFormatter={(v: Date) => {
                            return v.toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                        }}
                    />
                {/snippet}
            </BarChart>
        </Chart.Container>
    </Card.Content>
    <Card.Footer></Card.Footer>
</Card.Root>
