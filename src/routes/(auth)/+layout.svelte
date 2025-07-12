<script lang="ts">
    let { children } = $props();
    import { Toaster } from "$lib/components/ui/sonner";
</script>

<Toaster position="top-center" />
{@render children()}
