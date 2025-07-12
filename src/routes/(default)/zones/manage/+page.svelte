<script lang="ts">
    import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import { MediaQuery } from "svelte/reactivity";
    import * as Pagination from "$lib/components/ui/pagination";
    import DataTable from "./data-table.svelte";
    import { columns } from "./columns";
    import { Input } from "$lib/components/ui/input";

    let { data } = $props();

    const isDesktop = new MediaQuery("(min-width: 768px)");

    const perPage = $derived(isDesktop.current ? 10 : 5);
    const siblingCount = $derived(isDesktop.current ? 1 : 0);
    let currentPage = $state(1);

    let zoneFilter = $state("");
    let filteredZones = $derived(
        data.zones.filter((zone) => zone.name.includes(zoneFilter)),
    );

    const count = $derived(filteredZones.length);

    let paginatedZones = $derived(
        filteredZones.slice((currentPage - 1) * perPage, currentPage * perPage),
    );
</script>

<svelte:head>
    <title>Odin DNS - Zone Management</title>
</svelte:head>

<div class="flex-1 rounded-xl p-4">
    <div class="flex items-center py-4">
        <Input
            placeholder="Filter zones..."
            bind:value={zoneFilter}
            class="max-w-sm"
        />
    </div>
    <DataTable data={paginatedZones} {columns} />
</div>

<Pagination.Root
    {count}
    {perPage}
    {siblingCount}
    onPageChange={(n) => {
        currentPage = n;
    }}
>
    {#snippet children({ pages, currentPage })}
        <Pagination.Content>
            <Pagination.Item>
                <Pagination.PrevButton>
                    <ChevronLeftIcon class="size-4" />
                    <span class="hidden sm:block">Previous</span>
                </Pagination.PrevButton>
            </Pagination.Item>
            {#each pages as page (page.key)}
                {#if page.type === "ellipsis"}
                    <Pagination.Item>
                        <Pagination.Ellipsis />
                    </Pagination.Item>
                {:else}
                    <Pagination.Item>
                        <Pagination.Link
                            {page}
                            isActive={currentPage === page.value}
                        >
                            {page.value}
                        </Pagination.Link>
                    </Pagination.Item>
                {/if}
            {/each}
            <Pagination.Item>
                <Pagination.NextButton>
                    <span class="hidden sm:block">Next</span>
                    <ChevronRightIcon class="size-4" />
                </Pagination.NextButton>
            </Pagination.Item>
        </Pagination.Content>
    {/snippet}
</Pagination.Root>
