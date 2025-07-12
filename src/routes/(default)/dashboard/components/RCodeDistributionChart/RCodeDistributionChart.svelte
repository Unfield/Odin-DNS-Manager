<script lang="ts" module>
    import {
        CHART_TYPE,
        chartTypeLabels,
        type ChartType,
    } from "$lib/chart-types";
    import { cn, type WithElementRef } from "$lib/utils.js";
    import type {
        HTMLAnchorAttributes,
        HTMLButtonAttributes,
    } from "svelte/elements";

    export type ChartProps = WithElementRef<HTMLButtonAttributes> &
        WithElementRef<HTMLAnchorAttributes> & {
            chartType?: ChartType;
        };
</script>

<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { PieChart } from "layerchart";
    import * as Chart from "$lib/components/ui/chart/index.js";
    import { cubicInOut } from "svelte/easing";
    import { Button } from "$lib/components/ui/button";
    import { RotateCcwIcon } from "@lucide/svelte";
    import { fetchApiWithLoading } from "$lib/utils/apiWithStatemachine";
    import type {
        GenericErrorResponse,
        RCodeDistributionData,
    } from "$lib/types";
    import * as userStore from "$lib/stores/userStore.svelte";
    import { onMount } from "svelte";

    let {
        data: rcodeData,
        loading,
        error,
        fetch: loadRcodeData,
    } = fetchApiWithLoading<RCodeDistributionData[], GenericErrorResponse>(
        "/api/v1/metrics/rcode-distribution",
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
        loadRcodeData();
    });

    const chartColors = [
        "var(--chart-2)",
        "var(--chart-1)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
    ];

    const enhancedChartData = $derived(
        $rcodeData?.map((item, index) => ({
            ...item,
            color: chartColors[index % chartColors.length],
        })),
    );

    const chartConfig = $derived({
        count: { label: "Count" },
        ...Object.fromEntries(
            $rcodeData?.map((item, index) => [
                item.rcodeName,
                {
                    label: item.rcodeName,
                    color: chartColors[index % chartColors.length],
                },
            ]) ?? [],
        ),
    } satisfies Chart.ChartConfig);
</script>

<Card.Root class="h-full w-full">
    <Card.Header class="flex justify-between">
        <span class="">
            <Card.Title>RCode Distribution</Card.Title>
            <Card.Description
                >Distribution of rcodes across all responses</Card.Description
            >
        </span>
        <Button
            variant="secondary"
            size="icon"
            class="size-8"
            onclick={() => loadRcodeData()}
        >
            <RotateCcwIcon />
        </Button>
    </Card.Header>
    <Card.Content>
        <Chart.Container
            config={chartConfig}
            class="mx-auto aspect-square  max-h-[250px]"
        >
            <PieChart
                data={enhancedChartData}
                key="rcodeName"
                value="count"
                label={(d) => d.rcodeName}
                cRange={enhancedChartData?.map((d) => d.color)}
                props={{
                    pie: {
                        motion: {
                            type: "tween",
                            duration: 500,
                            easing: cubicInOut,
                        },
                    },
                }}
                legend
            >
                {#snippet tooltip()}
                    <Chart.Tooltip hideLabel />
                {/snippet}
            </PieChart>
        </Chart.Container>
    </Card.Content>
    <Card.Footer></Card.Footer>
</Card.Root>
