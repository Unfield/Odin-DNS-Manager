<script lang="ts">
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

    let {
        items,
    }: {
        items: {
            title: string;
            url: string;
            // this should be `Component` after @lucide/svelte updates types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            icon?: any;
            isActive?: boolean;
            items?: {
                title: string;
                url: string;
            }[];
        }[];
    } = $props();
</script>

<Sidebar.Group>
    <Sidebar.Menu>
        {#each items as item (item.title)}
            {#if item.items && item.items.length > 0}
                <Collapsible.Root
                    open={item.isActive}
                    class="group/collapsible"
                >
                    {#snippet child({ props })}
                        <Sidebar.MenuItem {...props}>
                            <Collapsible.Trigger class="cursor-pointer">
                                {#snippet child({ props })}
                                    <Sidebar.MenuButton
                                        {...props}
                                        tooltipContent={item.title}
                                    >
                                        {#if item.icon}
                                            <item.icon />
                                        {/if}
                                        <span>{item.title}</span>
                                        <ChevronRightIcon
                                            class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                        />
                                    </Sidebar.MenuButton>
                                {/snippet}
                            </Collapsible.Trigger>
                            <Collapsible.Content>
                                <Sidebar.MenuSub>
                                    {#each item.items ?? [] as subItem (subItem.title)}
                                        <Sidebar.MenuSubItem>
                                            <Sidebar.MenuSubButton>
                                                {#snippet child({ props })}
                                                    <a
                                                        href={subItem.url}
                                                        {...props}
                                                    >
                                                        <span
                                                            >{subItem.title}</span
                                                        >
                                                    </a>
                                                {/snippet}
                                            </Sidebar.MenuSubButton>
                                        </Sidebar.MenuSubItem>
                                    {/each}
                                </Sidebar.MenuSub>
                            </Collapsible.Content>
                        </Sidebar.MenuItem>
                    {/snippet}
                </Collapsible.Root>
            {:else}
                <Sidebar.MenuItem>
                    <a href={item.url}>
                        <Sidebar.MenuButton
                            tooltipContent={item.title}
                            class="cursor-pointer"
                        >
                            {#if item.icon}
                                <item.icon />
                            {/if}

                            <span>{item.title}</span>
                        </Sidebar.MenuButton>
                    </a>
                </Sidebar.MenuItem>
            {/if}
        {/each}
    </Sidebar.Menu>
</Sidebar.Group>
