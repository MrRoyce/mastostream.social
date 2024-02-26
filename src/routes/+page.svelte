<script lang="ts">
	import { initialized } from '$lib/translations';
	import CardLineChart from '$lib/components/Cards/CardLineChart.svelte';
	import CardStats from '$lib/components/Cards/CardStats.svelte';
	import type { PageData } from './$types';
	import { Marquee } from '@selemondev/svelte-marquee';
	import '@selemondev/svelte-marquee/dist/style.css';
	import { collection, limit, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/client';
	import { collectionStore } from 'sveltefire';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { truncateHTML } from '$lib/utils/truncateHTML';
	import { calculateStats } from '$lib/utils/calculateStats';
	import { calculateCharts } from '$lib/utils/calculateCharts';

	export let data: PageData;
	const counts = data.counts;

	const orderByField = 'timestamp';
	const direction = 'desc';
	const max = 15;

	const collectionRef = collection(db, 'toots');
	const q = query(collectionRef, orderBy(orderByField, direction), limit(max));
	const tootsMarquee = collectionStore(db, q);

	const stats = calculateStats(data);
	const charts = calculateCharts(data.counts);
</script>

<!-- Marquee -->
<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
	<Marquee pauseOnHover={true} fade={false} reverse={true} class="py-4 motion-reduce:overflow-auto">
		{#each $tootsMarquee as item}
			<Button
				color="dark"
				class=""
				on:click={() => {
					goto(`/toots/${item.accountId}_${item.tootId}`);
				}}
				><img class=" w-10 h-auto max-w-xs mr-4" src={item.avatar} alt="User" />
				{@html truncateHTML(item.content, 50)}</Button
			>
		{/each}
	</Marquee>
</div>

<div>
	{#if $initialized}
		<!-- Latest stats -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
			{#each stats as stat}
				<div class="border-2 border-dashed border-gray-300 dark:border-gray-600">
					<div class=" transform transition duration-500 hover:scale-110">
						<a href={stat.href}>
							<CardStats
								statEntity={stat.statEntity}
								statValue={stat.statValue}
								statArrow={stat.statArrow}
								statPercent={stat.statPercent}
								statPercentColor={stat.statPercentColor}
								statDescription={stat.statDescription}
								statIconName={stat.statIconName}
								statIconColor={stat.statIconColor}
							/>
						</a>
					</div>
				</div>
			{/each}
		</div>

		<!-- Charts -->
		<div class="hidden-on-mobile">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
				{#each charts as chart}
					<!-- content here -->

					<div class="border-2 border-dashed border-gray-300 dark:border-gray-600">
						<CardLineChart
							entity={chart.entity}
							data={chart.data}
							categories={chart.categories}
							total={chart.total}
						/>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div>Locale initializing...</div>
	{/if}
</div>

<style>
	/* Other styles for your component */

	/* Show the slot content only on small screens */
	.show-on-mobile {
		@apply block sm:hidden;
	}

	/* Hide the slot fragment on small screens */
	.hidden-on-mobile {
		@apply hidden sm:block;
	}
</style>
