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
    import * as Select from "$lib/components/ui/select";
    import * as Card from "$lib/components/ui/card/index.js";
    import AreaChart from "./AreaChart.svelte";
    import BarChart from "./BarChart.svelte";
    import { chartPreferences } from "$lib/stores/chartPreferences";
    import { fetchApiWithLoading } from "$lib/utils/apiWithStatemachine";
    import type { GenericErrorResponse, TimeSeriesData } from "$lib/types";
    import * as userStore from "$lib/stores/userStore.svelte";
    import { onMount } from "svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { RotateCcwIcon } from "@lucide/svelte";

    let {
        chartType = $bindable(
            $chartPreferences.requestErrorChart.type || CHART_TYPE.Bar,
        ),
        ...restProps
    }: ChartProps = $props();

    const availableChartTypes = [
        { value: CHART_TYPE.Area, label: chartTypeLabels.Area },
        { value: CHART_TYPE.Bar, label: chartTypeLabels.Bar },
    ];

    const triggerContent = $derived(
        availableChartTypes.find((type) => type.value === chartType)?.label ||
            chartTypeLabels.Bar,
    );

    const today = new Date();
    const currentMonth = $derived(
        today.toLocaleDateString("en-US", { month: "long" }),
    );
    const currentYear = $derived(today.getFullYear());

    let {
        data: requestData,
        loading,
        error,
        fetch: loadData,
    } = fetchApiWithLoading<TimeSeriesData[], GenericErrorResponse>(
        "/api/v1/metrics/requests/errors/daily",
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
        loadData();
    });
</script>

<Card.Root class="h-full w-full">
    <Card.Header class="flex justify-between">
        <span class="">
            <Card.Title>Requests Resolved / Errors</Card.Title>
            <Card.Description>
                {currentMonth} - {currentYear}
            </Card.Description>
        </span>
        <span class="flex gap-x-2">
            <Select.Root
                type="single"
                name="chartType"
                bind:value={chartType}
                onValueChange={(value) => {
                    chartType = value as ChartType;
                    chartPreferences.set({
                        requestErrorChart: {
                            type: chartType,
                        },
                    });
                }}
            >
                <Select.Trigger class="w-[180px] hidden xl:flex">
                    {triggerContent}
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Chart Type</Select.Label>
                        {#each availableChartTypes as type (type.value)}
                            <Select.Item value={type.value} label={type.label}>
                                {type.label}
                            </Select.Item>
                        {/each}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <Button
                variant="secondary"
                size="icon"
                class="size-8"
                onclick={() => loadData()}
            >
                <RotateCcwIcon />
            </Button>
        </span>
    </Card.Header>
    <Card.Content>
        {#if $loading}
            <div class="flex items-center justify-center h-full">
                <span class="text-gray-500">Loading...</span>
            </div>
        {:else if $error}
            <div class="flex items-center justify-center h-full">
                <span class="text-red-500">Error: {$error.message}</span>
            </div>
        {:else if $requestData && $requestData.length > 0}
            {#if chartType === CHART_TYPE.Area}
                <AreaChart
                    chartData={$requestData || []}
                    class={cn("h-full w-full", restProps.class)}
                />
            {:else if chartType === CHART_TYPE.Bar}
                <BarChart
                    chartData={$requestData || []}
                    class={cn("h-full w-full", restProps.class)}
                />
            {/if}
        {:else}
            <div class="flex items-center justify-center h-full">
                <span class="text-muted-foreground">No data available</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
