<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import Activity from "lucide-svelte/icons/activity";
    import CreditCard from "lucide-svelte/icons/credit-card";
    import DollarSign from "lucide-svelte/icons/dollar-sign";
    import Users from "lucide-svelte/icons/users";
    import Networking from "../shared/Networking.svelte";

</script>

<div class="hidden flex-col md:flex">
    <div class="flex-1 space-y-4 p-8 pt-6">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card.Root>
                <Card.Header
                        class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
                    <DollarSign class="text-muted-foreground h-4 w-4" />
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">$45,231.89</div>
                    <p class="text-muted-foreground text-xs">+20.1% from last month</p>
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Header
                        class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm font-medium">Subscriptions</Card.Title>
                    <Users class="text-muted-foreground h-4 w-4" />
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">+2350</div>
                    <p class="text-muted-foreground text-xs">+180.1% from last month</p>
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Header
                        class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm font-medium">Sales</Card.Title>
                    <CreditCard class="text-muted-foreground h-4 w-4" />
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">+12,234</div>
                    <p class="text-muted-foreground text-xs">+19% from last month</p>
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Header
                        class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <Card.Title class="text-sm font-medium">Active Now</Card.Title>
                    <Activity class="text-muted-foreground h-4 w-4" />
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">+573</div>
                    <p class="text-muted-foreground text-xs">+201 since last hour</p>
                </Card.Content>
            </Card.Root>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card.Root class="col-span-4">
                <Card.Header>
                    <Card.Title>Overview</Card.Title>
                </Card.Header>
                <Card.Content>
<!--                    <Overview />-->
                </Card.Content>
            </Card.Root>
            <Card.Root class="col-span-3">

                    <Networking />
            </Card.Root>
        </div>
    </div>
</div>

