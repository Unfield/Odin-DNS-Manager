<script lang="ts">
    import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import { MediaQuery } from "svelte/reactivity";
    import * as Pagination from "$lib/components/ui/pagination";
    import DataTable from "./data-table.svelte";
    import { getColumns } from "./columns";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { PlusIcon } from "@lucide/svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import {
        ZoneEntryType,
        type GenericErrorResponse,
        type ZoneRecord,
    } from "$lib/types";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { toast } from "svelte-sonner";
    import Edit from "./edit.svelte";
    import { fetchApiWithLoading } from "$lib/utils/apiWithStatemachine";
    import * as userStore from "$lib/stores/userStore.svelte";
    import { page } from "$app/state";

    let { data } = $props();

    const isDesktop = new MediaQuery("(min-width: 768px)");

    const perPage = $derived(isDesktop.current ? 10 : 5);
    const siblingCount = $derived(isDesktop.current ? 1 : 0);
    let currentPage = $state(1);

    let unfilteredEntries: ZoneRecord[] = $state(data.zoneEntries);
    let entryFilter = $state("");
    let filteredEntries = $derived(
        unfilteredEntries.filter((entry) => entry.name.includes(entryFilter)),
    );

    const count = $derived(filteredEntries.length);

    let selectedEntry: ZoneRecord | null = $state(null);
    let createModalOpen = $state(false);
    let editModalOpen = $state(false);
    let submittingEditOrCreate = $state(false);
    let deleteModalOpen = $state(false);
    let createZoneEntryData: ZoneRecord = $state({
        id: "0",
        zone_id: data.zoneEntries[0]?.zone_id || "",
        class: "IN",
        name: "",
        type: ZoneEntryType.A,
        ttl: 3600,
        priority: null,
        value: "",
    });

    let paginatedEntries = $derived(
        filteredEntries.slice(
            (currentPage - 1) * perPage,
            currentPage * perPage,
        ),
    );

    const columns = getColumns(
        (entry) => {
            selectedEntry = entry;
            editModalOpen = true;
        },
        (entry) => {
            selectedEntry = entry;
            deleteModalOpen = true;
        },
    );

    interface CreateZoneEntryResponse {
        id: string;
    }

    function handleCreateSubmit() {
        let {
            data: createZoneEntryResponseData,
            loading: submittingCreate,
            error: createZoneEntryError,
            fetch: createZoneEntryAPICall,
        } = fetchApiWithLoading<CreateZoneEntryResponse, GenericErrorResponse>(
            `/api/v1/zone/${page.params.id}/entries`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${userStore.getUser()?.token}`,
                    "Content-Type": "application/json",
                },
                returnType: "json",
                body: JSON.stringify(createZoneEntryData),
            },
        );

        createZoneEntryAPICall();
        submittingCreate.subscribe((state) => {
            submittingEditOrCreate = state;
        });

        createZoneEntryError.subscribe((e) => {
            if (!e) return;
            createZoneEntryData = {
                id: "0",
                zone_id: data.zoneEntries[0]?.zone_id || "",
                class: "IN",
                name: "",
                type: ZoneEntryType.A,
                ttl: 3600,
                priority: null,
                value: "",
            };
            toast.error("Failed to create entry: " + e?.data?.error_message);
        });

        createZoneEntryResponseData.subscribe((rdata) => {
            if (!rdata) return;
            unfilteredEntries.push({
                id: createZoneEntryData.id,
                zone_id: createZoneEntryData.zone_id,
                class: createZoneEntryData.class,
                name: createZoneEntryData.name,
                type: createZoneEntryData.type,
                ttl: createZoneEntryData.ttl,
                priority: createZoneEntryData.priority,
                value: createZoneEntryData.value,
            });
            createZoneEntryData = {
                id: "0",
                zone_id: data.zoneEntries[0]?.zone_id || "",
                class: "IN",
                name: "",
                type: ZoneEntryType.A,
                ttl: 3600,
                priority: null,
                value: "",
            };
            toast.info("Entry created successfully");
        });
        createModalOpen = false;
    }

    interface UpdateZoneEntryResponse {
        id: string;
    }

    function handleEditSubmit() {
        if (!selectedEntry) return;

        let {
            data: updateZoneEntryResponseData,
            loading: submittingCreate,
            error: updateZoneEntryError,
            fetch: updateZoneEntryAPICall,
        } = fetchApiWithLoading<UpdateZoneEntryResponse, GenericErrorResponse>(
            `/api/v1/zone/${page.params.id}/entry/${selectedEntry.id}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${userStore.getUser()?.token}`,
                    "Content-Type": "application/json",
                },
                returnType: "json",
                body: JSON.stringify(selectedEntry),
            },
        );

        updateZoneEntryAPICall();
        submittingCreate.subscribe((state) => {
            submittingEditOrCreate = state;
        });

        updateZoneEntryError.subscribe((e) => {
            if (!e) return;
            toast.error("Failed to update entry: " + e?.data?.error_message);
        });

        updateZoneEntryResponseData.subscribe((rdata) => {
            if (!rdata) return;
            //:TODO update the entry in the list
            toast.info("Entry updated successfully");
        });

        selectedEntry = null;
        editModalOpen = false;
    }

    function handleDeleteSubmit() {
        if (!selectedEntry) return;
        unfilteredEntries = unfilteredEntries.filter(
            (item) => item.id !== selectedEntry?.id,
        );

        let {
            data: updateZoneEntryResponseData,
            loading: submittingCreate,
            error: updateZoneEntryError,
            fetch: updateZoneEntryAPICall,
        } = fetchApiWithLoading<UpdateZoneEntryResponse, GenericErrorResponse>(
            `/api/v1/zone/${page.params.id}/entry/${selectedEntry.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${userStore.getUser()?.token}`,
                    "Content-Type": "application/json",
                },
                returnType: "json",
                body: JSON.stringify(selectedEntry),
            },
        );

        updateZoneEntryAPICall();
        submittingCreate.subscribe((state) => {
            submittingEditOrCreate = state;
        });

        updateZoneEntryError.subscribe((e) => {
            if (!e) return;
            toast.error("Failed to update entry: " + e?.data?.error_message);
        });

        updateZoneEntryResponseData.subscribe((rdata) => {
            if (!rdata) return;
            //:TODO update the entry in the list
            toast.info("Entry updated successfully");
        });

        selectedEntry = null;
        deleteModalOpen = false;
    }
</script>

<svelte:head>
    <title>Odin DNS - Zone Entry Management</title>
</svelte:head>

<div class="flex-1 rounded-xl p-4">
    <div class="flex items-center justify-between py-4">
        <Input
            placeholder="Filter entries..."
            bind:value={entryFilter}
            class="max-w-sm"
        />
        <Button variant="secondary" onclick={() => (createModalOpen = true)}
            ><PlusIcon /> Add DNS entry</Button
        >
    </div>
    <DataTable data={paginatedEntries} {columns} />
</div>

<AlertDialog.Root bind:open={createModalOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Add DNS Entry</AlertDialog.Title>
        </AlertDialog.Header>
        <Edit
            bind:entry={createZoneEntryData}
            submitting={submittingEditOrCreate}
        />
        <AlertDialog.Footer>
            <AlertDialog.Cancel disabled={submittingEditOrCreate}
                >Cancel</AlertDialog.Cancel
            >
            <AlertDialog.Action
                disabled={submittingEditOrCreate}
                onclick={() => handleCreateSubmit()}>Save</AlertDialog.Action
            >
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

{#if selectedEntry}
    <AlertDialog.Root bind:open={editModalOpen}>
        <AlertDialog.Content>
            <AlertDialog.Header>
                <AlertDialog.Title>Edit DNS Entry</AlertDialog.Title>
            </AlertDialog.Header>
            <Edit
                bind:entry={selectedEntry}
                submitting={submittingEditOrCreate}
            />
            <AlertDialog.Footer>
                <AlertDialog.Cancel disabled={submittingEditOrCreate}
                    >Cancel</AlertDialog.Cancel
                >
                <AlertDialog.Action
                    disabled={submittingEditOrCreate}
                    onclick={() => handleEditSubmit()}>Save</AlertDialog.Action
                >
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Root>
{/if}

<AlertDialog.Root bind:open={deleteModalOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
                Are you sure you want to delete the entry from the Zone?
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action onclick={() => handleDeleteSubmit()}
                >Delete</AlertDialog.Action
            >
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

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
