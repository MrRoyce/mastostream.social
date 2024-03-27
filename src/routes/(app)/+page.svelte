<script lang="ts">
	import { initialized } from '$lib/translations';
	import { t } from '$lib/translations';
	import type { PageData } from './$types';
	import { Marquee } from '@selemondev/svelte-marquee';
	import '@selemondev/svelte-marquee/dist/style.css';
	import { goto } from '$app/navigation';
	import { Button, Tabs, TabItem } from 'flowbite-svelte';
	import { calculateCharts, calculateStats, getRandomRange, truncateHTML } from '$lib/utils';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { CardLineChart, CardStats, FooterPage, WordCloud } from '$lib/components';
	import { Section } from 'flowbite-svelte-blocks';

	export let data: PageData;
	const counts = data.counts;
	const words = data.words;
	const latestCounts = data.latestCounts;
	const toots = data.toots;
	const activeTab = 0;

	const { start, end } = getRandomRange(toots?.length, 10);
	const tootsMarquee = toots?.slice(start, end);

	const stats = calculateStats({ ...latestCounts, counts });
	const charts = calculateCharts(counts);

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Dashboard'
		});
	}
</script>

{#if browser}
	<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 m-4 h-fit">
		<div>
			{#if $initialized}
				<!-- Marquee -->
				<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
					<Marquee
						pauseOnHover={true}
						fade={false}
						reverse={true}
						class="py-4 motion-reduce:overflow-auto"
					>
						{#each tootsMarquee as item}
							<Button
								color="dark"
								class="max-w-xs transition duration-300 ease-in-out hover:scale-110"
								on:click={() => {
									goto(`/toots/${item.accountId}_${item.tootId}`);
								}}
								><img
									class=" w-10 h-auto max-w-xs mr-4"
									src={item.avatar}
									alt={$t('general.user')}
								/>
								{@html truncateHTML(item.content, 50)}</Button
							>
						{/each}
					</Marquee>
				</div>
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
										statsCount={stat.statsCount}
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
					<div
						class="border-2 border-dashed border-gray-300 dark:border-gray-600 h-36 md:h-64 mb-4"
					>
						<Tabs
							class=" focus:ring-gray-400"
							style="full"
							defaultClass="flex space-x-4 divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700"
						>
							{#each charts as chart, index}
								<TabItem class="w-full " open={index === activeTab} title={chart.entity}>
									<CardLineChart
										entity={chart.entity}
										data={chart.data}
										categories={chart.categories}
										total={chart.total}
									/>
								</TabItem>
							{/each}
						</Tabs>
					</div>
				</div>

				<!-- Wordcloud -->

				<div class="hidden-on-mobile">
					<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 h-96 mb-4">
						<WordCloud hashtags={words} />
					</div>
				</div>

				<!-- Dashboard Cards -->
				<div class="overflow-hidden">
					<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 h- mb-4">
						<FooterPage />
					</div>
				</div>
			{:else}
				<div>{$t('general.localeInitializing')}</div>
			{/if}
		</div>
	</Section>
{/if}

<style>
	/* Other styles for your component */

	/* Show the slot content only on small screens */

	/* Hide the slot fragment on small screens */
	.hidden-on-mobile {
		@apply hidden sm:block;
	}
</style>
