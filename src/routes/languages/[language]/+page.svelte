<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import TootTable from '$lib/components/UI/TootTable.svelte';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { getLanguage } from '$lib/utils/getLanguage';
	import CardWithLink from '$lib/components/Cards/Card.svelte';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Language'
		});
	}

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;
	const id = data.id;
	const wikiData = data.wikiData;
	const wikiTitle = `${wikiData.title}: ${wikiData.description}`;
	// console.log('wikiData', wikiData);

	if (!entity.language && browser) {
		goto('/languages/notfound');
	}

	const language = getLanguage(entity.language);

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Links to Dashboard and Languages">
		<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
		<BreadcrumbItem href="/languages">Languages</BreadcrumbItem>
		<BreadcrumbItem>{id}</BreadcrumbItem>
	</Breadcrumb>
</div>
<div class="dark:bg-gray-800">
	<div class="container mx-auto my-5 p-5">
		<div class="md:flex no-wrap md:-mx-2">
			<!-- Left Side -->
			<div class="w-full md:w-3/12 md:mx-2">
				<!-- Profile Card -->
			</div>
			<!-- Right Side -->
			<div class="w-full md:w-9/12 mx-2">
				<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
					<h3 class="mt-5">
						{#if wikiData.extract}
							<CardWithLink
								cardImage={wikiData.originalimage.source}
								description={wikiData.extract}
								providerName="en.wikipedia.org"
								title={wikiTitle}
								url={wikiData.content_urls.desktop.page}
							/>
						{/if}
					</h3>
				</div>
			</div>
		</div>
		<div class="my-4 text-white">
			<h2 class="text-gray-200 font-bold text-xl leading-8 my-1">
				Latest <span class="bg-green-500">{entity.language}</span>
				({language.englishValue}) toots:
			</h2>

			<TootTable {tableData} sourceData={toots} getData={() => {}} />
		</div>
	</div>
</div>
