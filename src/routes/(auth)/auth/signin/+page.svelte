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
    import { Github, Loader, Mail } from "@lucide/svelte";

    import { superForm } from "sveltekit-superforms";
    import type { PageProps } from "./$types";
    import { PasswordInput } from "$lib/components/ui/password-input";
    import { toast } from "svelte-sonner";

    let { data }: PageProps = $props();

    const { form, enhance, message, submitting } = superForm(data.form, {
        resetForm: false,
    });

    import { page } from "$app/state";

    let errorCode = page.url.searchParams.get("error");
    let redirectionNoticeShown = $state<boolean>(false);

    message.subscribe((message) => {
        if (!message) return;
        if (message.type === "error")
            toast.error("Sign In Failed", {
                description: message.text,
            });
    });

    $effect(() => {
        if (errorCode != null && !redirectionNoticeShown) {
            toast.info("You have been redirected", {
                description:
                    "Please sign in to view the page you tried to access",
            });
            redirectionNoticeShown = true;
        }
    });
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
                        >Enter your credentials to access your account</CardDescription
                    >
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <Button variant="outline" disabled>
                            <Github class="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                        <Button variant="outline" disabled>
                            <Mail class="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div>

                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <Separator class="w-full" />
                        </div>
                        <div
                            class="relative flex justify-center text-xs uppercase"
                        >
                            <span class="px-2 text-muted-foreground"
                                >Or continue with</span
                            >
                        </div>
                    </div>

                    <form method="post" use:enhance class="space-y-4">
                        <div class="space-y-2">
                            <Label for="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="username"
                                placeholder="Enter your Username"
                                bind:value={$form.username}
                                required
                                disabled={$submitting}
                            />
                        </div>

                        <PasswordInput
                            bind:value={$form.password}
                            id="password"
                            name="password"
                            placeholder="Enter your Password"
                            required
                            autocomplete="new-password"
                            class="mb-4"
                            disabled={$submitting}
                        />

                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <Checkbox
                                    id="remember_me"
                                    name="remember_me"
                                    bind:checked={$form.remember_me}
                                />
                                <Label
                                    for="remember_me"
                                    class="text-sm font-normal cursor-pointer"
                                >
                                    Remember me
                                </Label>
                            </div>
                            <Button
                                variant="link"
                                class="px-0 font-normal text-sm"
                            >
                                Forgot password?
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            class="w-full"
                            disabled={$submitting}
                            >Sign in {#if $submitting}<Loader
                                    class="animate-spin"
                                />{/if}</Button
                        >
                    </form>
                </CardContent>

                <CardFooter>
                    <p class="text-center text-sm text-muted-foreground w-full">
                        {"Don't have an account? "}
                        <Button
                            variant="link"
                            class="px-0 font-normal"
                            href="/auth/signup">Sign up</Button
                        >
                    </p>
                </CardFooter>
                <span
                    class="m-0 p-0 flex justify-center text-sm text-muted-foreground"
                >
                    Username: admin Password: admin
                </span>
            </Card>
        </div>
    </div>
</div>
