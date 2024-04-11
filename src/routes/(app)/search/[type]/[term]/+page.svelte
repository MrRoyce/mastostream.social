<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Heading } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { MobileTootViewWrapper, TableWrap, TootTable } from '$lib/components';
	import { t } from '$lib/translations';

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Search_[type]_[term]'
		});
	}

	export let data: PageData;
	const toots = data.toots;
	const term = data.term;

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Pics', 'Video', 'Audio', 'Language', 'Link']
	};
</script>

<div class="pt-0.5">
	<TableWrap>
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Breadcrumbs for search term page">
				<BreadcrumbItem href="/">{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem href="/search">{$t('pagelinks.search')}</BreadcrumbItem>
				<BreadcrumbItem>{term}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div
			class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
		>
			<div class=" mx-auto mb-5 p5">
				<div class="col-span-2 mb-6">
					<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200">
						{$t('general.latestTootsInTerm')}
						"{term}"
					</Heading>
				</div>
				<div class="hidden-on-mobile">
					<div class="my-4 text-grey-200">
						<TootTable {tableData} sourceData={toots} />
					</div>
				</div>
				<!-- Mobile view -->
				<div class="show-on-mobile">
					{#each toots as toot}
						<TableWrap spacing="px-2">
							<MobileTootViewWrapper {toot} />
						</TableWrap>
					{/each}
				</div>
			</div>
		</div></TableWrap
	>
</div>
