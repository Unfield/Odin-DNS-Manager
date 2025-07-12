<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Eye, EyeOff } from "@lucide/svelte";
    import { cn } from "$lib/utils.js";
    import type { HTMLInputAttributes } from "svelte/elements";
    import type { WithElementRef } from "$lib/utils.js";

    type BaseInputProps = Omit<HTMLInputAttributes, "type" | "files">;

    type PasswordInputProps = WithElementRef<BaseInputProps> & {
        value: string;
        id?: string;
        label?: string;
        placeholder?: string;
    };

    let showPassword = $state(false);

    let {
        ref = $bindable(null),
        value = $bindable(),
        id = "password",
        label = "Password",
        placeholder = "Enter your password",
        class: className,
        ...restProps
    }: PasswordInputProps = $props();

    function togglePassword() {
        showPassword = !showPassword;
    }
</script>

<div class={cn("space-y-2", className)}>
    {#if label}
        <Label for={id}>
            {label}
        </Label>
    {/if}
    <div class="relative">
        <Input
            {id}
            type={showPassword ? "text" : "password"}
            {placeholder}
            bind:value
            bind:ref
            required
            {...restProps}
        />
        <Button
            type="button"
            variant="ghost"
            size="sm"
            class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onclick={togglePassword}
        >
            {#if showPassword}
                <EyeOff class="h-4 w-4 text-gray-400" />
            {:else}
                <Eye class="h-4 w-4 text-gray-400" />
            {/if}
        </Button>
    </div>
</div>
