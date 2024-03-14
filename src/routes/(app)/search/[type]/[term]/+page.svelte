<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import type { PageData } from '../$types';
	import TootTable from '$lib/components/UI/TootTable.svelte';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';

	if (browser && isSupported()) {
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
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Breadcrumbs for search term page">
		<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
		<BreadcrumbItem href="/search">Search</BreadcrumbItem>
		<BreadcrumbItem>{term}</BreadcrumbItem>
	</Breadcrumb>
</div>
<div class="dark:bg-gray-800">
	<div class="container mx-auto my-5 p-5">
		<div class="md:flex no-wrap md:-mx-2">
			<!-- Left Side -->
			<div class="w-full md:w-3/12 md:mx-2">
				<!-- Profile Card -->
				<h1>Search for {term}</h1>
			</div>
			<!-- Right Side -->
		</div>
		<div class="my-4 text-white">
			<h2 class="text-gray-200 font-bold text-xl leading-8 my-1">
				Latest toots having {term}:
			</h2>

			<TootTable {tableData} sourceData={toots} getData={() => {}} entity={`Toots from ${term}`} />
		</div>
	</div>
</div>
