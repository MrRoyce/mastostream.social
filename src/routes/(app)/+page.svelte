<script lang="ts">
	import { initialized } from '$lib/translations';
	import { t } from '$lib/translations';
	import type { PageData } from './$types';
	import '@selemondev/svelte-marquee/dist/style.css';
	import { goto } from '$app/navigation';
	import { Button, Tabs, TabItem } from 'flowbite-svelte';
	import { calculateCharts, calculateStats, getRandomRange, truncateHTML } from '$lib/utils';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { CardLineChart, CardStats, FooterPage, TableWrap, WordCloud } from '$lib/components';
	import Marqueeck from '@arisbh/marqueeck';
	import 'vanilla-cookieconsent/dist/cookieconsent.css';
	import * as CookieConsent from 'vanilla-cookieconsent';

	export let data: PageData;
	const counts = data?.counts;
	const words = data?.words;
	const latestCounts = data?.latestCounts;
	const toots = data?.toots;
	const activeTab = 0;

	const { start, end } = getRandomRange(toots?.length, 10);
	const tootsMarquee = toots?.slice(start, end);

	const searchStats = {
		href: '/search',
		statEntity: 'Search',
		statValue: 0,
		statArrow: 'up',
		statPercent: 0,
		statsCount: 0,
		statPercentColor: 'text-emerald-500',
		statDescription: 'In the last hour',
		statIconName: 'fa-solid fa-magnifying-glass',
		statIconColor: 'bg-red-500'
	};

	if (browser) {
		CookieConsent.run({
			categories: {
				necessary: {
					enabled: true, // this category is enabled by default
					readOnly: true // this category cannot be disabled
				},
				analytics: {}
			},

			// Cookie Consent text
			language: {
				default: 'en',
				translations: {
					en: {
						consentModal: {
							title: 'We use cookies',
							description: 'Cookie modal description',
							acceptAllBtn: 'Accept all',
							acceptNecessaryBtn: 'Reject all',
							showPreferencesBtn: 'Manage Individual preferences'
						},
						preferencesModal: {
							title: 'Manage cookie preferences',
							acceptAllBtn: 'Accept all',
							acceptNecessaryBtn: 'Reject all',
							savePreferencesBtn: 'Accept current selection',
							closeIconLabel: 'Close modal',
							sections: [
								{
									title: 'Somebody said ... cookies?',
									description: 'I want one!'
								},
								{
									title: 'Strictly Necessary cookies',
									description:
										'These cookies are essential for the proper functioning of the website and cannot be disabled.',

									//this field will generate a toggle linked to the 'necessary' category
									linkedCategory: 'necessary'
								},
								{
									title: 'Performance and Analytics',
									description:
										'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
									linkedCategory: 'analytics'
								},
								{
									title: 'More information',
									description:
										'For any queries in relation to my policy on cookies and your choices, please <a href="/contact">contact us</a>'
								}
							]
						}
					}
				}
			}
		});
	}

	const statsParams = { ...latestCounts, counts };
	const stats = calculateStats(statsParams);
	const charts = calculateCharts(counts);

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Dashboard'
		});
	}
</script>

{#if browser}
	<TableWrap>
		{#if $initialized}
			<div
				class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
			>
				<!-- Marquee -->
				<div class="overflow-hidden">
					<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
						<Marqueeck options={{ direction: 'left', onHover: 'stop' }}>
							{#each tootsMarquee as item}
								<Button
									color="dark"
									class="max-w-xs transition duration-300 ease-in-out hover:scale-110 dark:bg-gray-900"
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
						</Marqueeck>
					</div>
				</div>
				<!-- Latest stats -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
					{#each stats as stat}
						<div
							class="border-2 border-dashed border-gray-300 dark:border-gray-600 dark:bg-gray-900"
						>
							<div class=" transform transition duration-500 hover:scale-110">
								<a href={stat.href}>
									<CardStats
										statEntity={$t(stat.statEntity)}
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
					<div class="show-on-mobile">
						<div
							class="border-2 border-dashed border-gray-300 dark:border-gray-600 dark:bg-gray-900"
						>
							<div class=" transform transition duration-500 hover:scale-110">
								<a href={searchStats.href}>
									<CardStats
										statEntity={$t(searchStats.statEntity)}
										statValue={searchStats.statValue}
										statArrow={searchStats.statArrow}
										statPercent={searchStats.statPercent}
										statsCount={searchStats.statsCount}
										statPercentColor={searchStats.statPercentColor}
										statDescription={searchStats.statDescription}
										statIconName={searchStats.statIconName}
										statIconColor={searchStats.statIconColor}
									/></a
								>
							</div>
						</div>
					</div>
				</div>

				<!-- Charts -->
				<div class="hidden-on-mobile">
					<div
						class="border-2 border-dashed border-gray-300 dark:border-gray-600 h-36 md:h-64 mb-4"
					>
						<Tabs
							class=" focus:ring-gray-400 "
							style="full"
							defaultClass="flex space-x-4 divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700 "
						>
							{#each charts as chart, index}
								<TabItem
									class="w-full dark:bg-gray-900"
									open={index === activeTab}
									title={$t(chart.entity)}
								>
									<CardLineChart
										entity={$t(chart.entity)}
										data={chart.data}
										categories={chart.categories}
									/>
								</TabItem>
							{/each}
						</Tabs>
					</div>
				</div>

				<!-- Wordcloud -->

				<div class="hidden-on-mobile">
					<div
						class="border-2 border-dashed border-gray-300 dark:border-gray-600 h-96 mb-4 dark:bg-gray-900"
					>
						<WordCloud hashtags={words} />
					</div>
				</div>

				<!-- Dashboard Marquee Cards -->
				<div class="overflow-hidden">
					<div class="border-2 border-dashed border-gray-300 dark:border-gray-600">
						<FooterPage />
					</div>
				</div>
			</div>
		{:else}
			<div>{$t('general.localeInitializing')}</div>
		{/if}
	</TableWrap>
{/if}
