<script lang="ts">
    import { RequestChart } from "./components/RequestChart";
    import { chartPreferences } from "$lib/stores/chartPreferences";
    import { RCodeDistributionChart } from "./components/RCodeDistributionChart";
    import { QueryPerMinuteChart } from "./components/QueryPerMinuteChart";
    import { TopDomains } from "./components/TopDomains";
</script>

<head>
    <title>Odin DNS - Home</title>
</head>

<div class="bg-muted/50 flex-1 rounded-xl">
    <QueryPerMinuteChart />
</div>
<div class="grid auto-rows-min gap-4 2xl:grid-cols-3">
    <div class="bg-muted/50 rounded-xl">
        <RequestChart chartType={$chartPreferences.requestErrorChart.type} />
    </div>
    <div class="bg-muted/50 rounded-xl">
        <RCodeDistributionChart />
    </div>
    <div class="bg-muted/50 rounded-xl">
        <TopDomains />
    </div>
</div>
