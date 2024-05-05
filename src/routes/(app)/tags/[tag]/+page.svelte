<script lang="ts">
	import { goto } from '$app/navigation';
	import { Breadcrumb, BreadcrumbItem, Heading } from 'flowbite-svelte';
	import type { PageData } from '../$types';
	import { MobileTootViewWrapper, TootsRadio, TootTable } from '$lib/components';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { Page404, TableWrap } from '$lib/components';
	import { t } from '$lib/translations';

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Tags_[tag]'
		});
	}

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;
	const id = data.id;
	const tootTypePassed = data.tootTypePassed;

	const tableData = {
		tableHead: ['Pic', 'Safe', 'Type', 'Pics', 'Video', 'Audio', 'Language', 'Link']
	};

	$: tootType = tootTypePassed || 'both';

	function getTootType() {
		if (browser) {
			goto(`/tags/${entity.name}?type=${tootType}`);
		}
	}
</script>

{#if entity && entity.name}
	<TableWrap>
		<!-- Breadcrumb -->
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Links to Dashboard and Tags">
				<BreadcrumbItem href="/">{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem href="/tags">{$t('pagelinks.tags')}</BreadcrumbItem>
				<BreadcrumbItem>{id}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class="mx-auto mb-5 p-4">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<!-- Left Side -->
					<div class="md:col-span-2 md:col-start-1 order-first">
						<!-- Profile Card -->
						<Heading tag="h3" class="text-xl md:text-2xl lg:text-3xl dark:text-gray-200"
							>{$t('general.latestTootsInTerm')}</Heading
						>
						<Heading class="text-xl md:text-2xl lg:text-3xl  dark:text-gray-200"
							>#{entity.name}</Heading
						>
					</div>

					<!-- Right Side -->
					<div class="md:col-span-2 md:col-start-3 order-last">
						<TootsRadio bind:tootType {getTootType} />
					</div>
				</div>

				<!-- Toots section -->
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
{:else if browser}
	<Page404 route="tags" />
{/if}
