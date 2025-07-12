<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { Separator } from "$lib/components/ui/separator";
    import { Eye, EyeOff, Github, Mail } from "@lucide/svelte";

    import SuperDebug, { superForm } from "sveltekit-superforms";
    import type { PageProps } from "./$types";
    import { PasswordInput } from "$lib/components/ui/password-input";

    let showPassword = $state(false);
    function togglePassword() {
        showPassword = !showPassword;
    }

    let showPasswordCheck = $state(false);
    function togglePasswordCheck() {
        showPasswordCheck = !showPasswordCheck;
    }

    let { data }: PageProps = $props();

    const { form } = superForm(data.form);
</script>

<head>
    <title>Odin DNS - Sign In</title>
</head>

<div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
>
    <div class="flex w-full max-w-sm flex-col gap-6">
        <a href="##" class="flex items-center gap-2 self-center font-medium">
            <h1 class="font-bold text-2xl">
                <span class="text-primary">Odin DNS</span>
                Manager
            </h1>
        </a>
        <div class="flex flex-col gap-6">
            <Card class="w-full max-w-md">
                <CardHeader class="space-y-1">
                    <CardTitle class="text-2xl font-bold text-center"
                        >Odin DNS Demo</CardTitle
                    >
                    <CardDescription class="text-center"
                        >Create a new Odin DNS Account</CardDescription
                    >
                </CardHeader>
                <CardContent class="space-y-4">
                    <form class="space-y-4">
                        <div class="space-y-2">
                            <Label for="username">Username</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder="Enter your Username"
                                bind:value={$form.username}
                                required
                            />
                        </div>

                        <PasswordInput
                            bind:value={$form.password}
                            id="password"
                            placeholder="Enter your Password"
                            required
                            autocomplete="new-password"
                            class="mb-4"
                        />

                        <PasswordInput
                            bind:value={$form.password_check}
                            id="password_check"
                            placeholder="Retype your Password"
                            required
                            autocomplete="new-password"
                            class="mb-4"
                        />

                        <Button type="submit" class="w-full" disabled
                            >Sign up</Button
                        >
                    </form>
                </CardContent>

                <CardFooter>
                    <p class="text-center text-sm text-muted-foreground w-full">
                        {"Already got an account? "}
                        <Button
                            variant="link"
                            class="px-0 font-normal"
                            href="/auth/signin">Sign in</Button
                        >
                    </p>
                </CardFooter>
                <span
                    class="m-0 p-0 flex justify-center text-sm text-red-500 cursor-default"
                >
                    Sign up is disabled for this Demo
                </span>
            </Card>
        </div>
    </div>
</div>
