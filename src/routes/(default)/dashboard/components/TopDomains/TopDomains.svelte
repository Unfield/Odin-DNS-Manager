<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        ODIN_SESSION_TOKEN,
        type GenericErrorResponse,
        type TopDomainsData,
    } from "$lib/types";
    import { fetchApiWithLoading } from "$lib/utils/apiWithStatemachine";
    import { onMount } from "svelte";
    import * as userStore from "$lib/stores/userStore.svelte";
    import { Button } from "$lib/components/ui/button";
    import { RotateCcwIcon } from "@lucide/svelte";

    let {
        data: topDomains,
        loading,
        error,
        fetch: loadTopDomains,
    } = fetchApiWithLoading<TopDomainsData[], GenericErrorResponse>(
        "/api/v1/metrics/top-domains?limit=5",
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
        loadTopDomains();
    });
</script>

<Card.Root class="h-full w-full">
    <Card.Header class="flex justify-between">
        <span>
            <Card.Title>Top Domains</Card.Title>
            <Card.Description>
                Top 5 queried domains sorted by query count.
            </Card.Description>
        </span>
        <Button
            variant="secondary"
            size="icon"
            class="size-8"
            onclick={() => loadTopDomains()}
        >
            <RotateCcwIcon />
        </Button>
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
        {:else if $topDomains && $topDomains.length > 0}
            <ul class="space-y-4">
                {#each $topDomains as domain, index (domain.name)}
                    <li class="flex justify-between">
                        <span>
                            <span class="text-muted-foreground">
                                {index + 1}.
                            </span>
                            <span class="font-semibold">{domain.name}</span>
                        </span>
                        <span class="text-gray-500">{domain.count}</span>
                    </li>
                {/each}
            </ul>
        {:else}
            <div class="flex items-center justify-center h-full">
                <span class="text-muted-foreground">No data available</span>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
