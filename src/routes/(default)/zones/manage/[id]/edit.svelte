<script lang="ts">
    import {
        ZoneEntryType,
        type TZoneEntryType,
        type ZoneRecord,
    } from "$lib/types";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Select from "$lib/components/ui/select";

    let {
        entry = $bindable(),
        submitting,
    }: {
        entry: ZoneRecord;
        submitting: boolean;
    } = $props();

    let zoneEntryTypesForSelect = Object.entries(ZoneEntryType).map(
        ([key, value]) => ({
            value: key as TZoneEntryType,
            label: value,
        }),
    );
</script>

<div class="space-y-4">
    <div class="space-y-2">
        <Label for="name">Name</Label>
        <Input
            id="name"
            name="name"
            type="text"
            placeholder="Entry name"
            bind:value={entry.name}
            required
            disabled={submitting}
        />
    </div>
    <div class="space-y-2">
        <Label for="type">Type</Label>
        <Select.Root
            type="single"
            name="type"
            bind:value={entry.type}
            disabled={submitting}
        >
            <Select.Trigger class="w-full">
                {entry.type}
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    <Select.Label>Type</Select.Label>
                    {#each zoneEntryTypesForSelect as type (type.value)}
                        <Select.Item value={type.value} label={type.label}>
                            {type.label}
                        </Select.Item>
                    {/each}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    </div>
    <div class="space-y-2">
        <Label for="class">Class</Label>
        <Input
            id="class"
            name="class"
            type="text"
            placeholder="Class"
            bind:value={entry.class}
            disabled
            required
        />
    </div>
    <div class="space-y-2">
        <Label for="ttl">TTL</Label>
        <Input
            id="ttl"
            name="ttl"
            type="number"
            placeholder="TTL"
            bind:value={entry.ttl}
            required
            disabled={submitting}
        />
    </div>
    {#if entry.type === "MX"}
        <div class="space-y-2">
            <Label for="priority">Priority</Label>
            <Input
                id="priority"
                name="priority"
                type="number"
                placeholder="10"
                bind:value={entry.priority}
                required
                disabled={submitting}
            />
        </div>
    {/if}
    <div class="space-y-2">
        <Label for="value">Value</Label>
        <Input
            id="value"
            name="value"
            type="text"
            placeholder="Value"
            bind:value={entry.value}
            required
            disabled={submitting}
        />
    </div>
</div>
