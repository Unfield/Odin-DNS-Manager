<script lang="ts">
    import NavMain from "$lib/components/nav-main.svelte";
    import NavUser from "$lib/components/nav-user.svelte";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import {
        GlobeIcon,
        HomeIcon,
        LogsIcon,
        SettingsIcon,
    } from "@lucide/svelte";
    import type { LayoutProps } from "./$types";
    import { page } from "$app/state";
    import { getBreadcrumbs } from "$lib/utils/breadcrumb";
    import {
        THEME,
        type theme,
        themeLables,
        themePreferences,
    } from "$lib/stores/themePreferences";
    import * as userStore from "$lib/stores/userStore.svelte";
    import { Toaster } from "$lib/components/ui/sonner";

    let breadcrumbs = $derived(getBreadcrumbs(page.url.pathname));

    const mainNav = [
        {
            title: "Dashboard",
            url: "/",
            icon: HomeIcon,
            isActive: false,
        },
        {
            title: "Zones",
            url: "/zones",
            icon: GlobeIcon,
            items: [{ title: "Manage Zones", url: "/zones/manage" }],
        },
        {
            title: "Logs",
            url: "/",
            icon: LogsIcon,
        },
        {
            title: "Settings",
            url: "/",
            icon: SettingsIcon,
            items: [
                { title: "Profile", url: "/" },
                { title: "Security", url: "/" },
            ],
        },
    ];

    const availableThemes = [
        { value: THEME.Base, label: themeLables.Base },
        { value: THEME.Corporate, label: themeLables.Corporate },
        { value: THEME.Default, label: themeLables.Default },
    ];

    const triggerContent = $derived(
        availableThemes.find((t) => t.value === $themePreferences.theme)
            ?.label || themeLables.Default,
    );

    let { data, children }: LayoutProps = $props();

    userStore.setUser(data.user);
</script>

<Toaster position="top-center" />

<Sidebar.Provider>
    <Sidebar.Root>
        <Sidebar.Header>
            <h1 class="font-bold text-2xl">
                <span class="text-primary">Odin DNS</span>
                Manager
            </h1>
        </Sidebar.Header>
        <Sidebar.Content>
            <NavMain items={mainNav} />
        </Sidebar.Content>
        <Sidebar.Footer>
            <NavUser user={data.user} />
        </Sidebar.Footer>
        <Sidebar.Rail />
    </Sidebar.Root>
    <Sidebar.Inset>
        <header
            class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
        >
            <div class="flex items-center gap-2 px-4">
                <Sidebar.Trigger class="-ml-1" />
                <Separator
                    orientation="vertical"
                    class="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item class="hidden md:block">
                            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        {#if breadcrumbs.length > 0}
                            <Breadcrumb.Separator class="hidden md:block" />
                        {/if}
                        {#each breadcrumbs as crumb, index}
                            {#if index >= 0}
                                <Breadcrumb.Item class="hidden md:block">
                                    <Breadcrumb.Link href={crumb.href}
                                        >{crumb.title}</Breadcrumb.Link
                                    >
                                </Breadcrumb.Item>
                                {#if index < breadcrumbs.length - 1}
                                    <Breadcrumb.Separator
                                        class="hidden md:block"
                                    />
                                {/if}
                            {/if}
                        {/each}
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </div>
        </header>
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
            {@render children()}
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>
