<script lang="ts">
    import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import type { ZoneRecord } from "$lib/types";

    let {
        entry,
        onEdit,
        onDelete,
    }: {
        onEdit?: (entry: ZoneRecord) => void;
        onDelete?: (entry: ZoneRecord) => void;
        entry: ZoneRecord;
    } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button
                {...props}
                variant="ghost"
                size="icon"
                class="relative size-8 p-0"
            >
                <span class="sr-only">Open menu</span>
                <EllipsisIcon />
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Item
            class="cursor-pointer"
            onclick={() => onEdit?.(entry)}>Edit</DropdownMenu.Item
        >
        <DropdownMenu.Item
            class="cursor-pointer"
            disabled
            onclick={() => onDelete?.(entry)}>Delete</DropdownMenu.Item
        >
    </DropdownMenu.Content>
</DropdownMenu.Root>
