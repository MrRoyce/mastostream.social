<script lang="ts">
	import { goto } from '$app/navigation';
	import { Breadcrumb, BreadcrumbItem, Heading } from 'flowbite-svelte';
	import type { PageData } from '../$types';
	import TootTable from '$lib/components/UI/TootTable.svelte';
	import TootsRadio from '$lib/components/UI/TootsRadio.svelte';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { Section } from 'flowbite-svelte-blocks';

	if (browser && isSupported()) {
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

	if (!entity.name && browser) {
		goto('/tags/notfound');
	}

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Link']
	};

	$: tootType = tootTypePassed || 'both';

	function getTootType() {
		if (browser) {
			goto(`/tags/${entity.name}?type=${tootType}`);
		}
	}
</script>

<div class="pt-0.5">
	<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 m-4 h-fit">
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Links to Dashboard and Tags">
				<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
				<BreadcrumbItem href="/tags">Tags</BreadcrumbItem>
				<BreadcrumbItem>{id}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class="container mx-auto my-5 p-5">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<!-- Left Side -->
					<div class="md:col-span-2 md:col-start-1 order-first">
						<!-- Profile Card -->
						<Heading>Latest toots tagged #{entity.name}:</Heading>
					</div>
					<!-- Right Side -->
					<div class="md:col-span-2 md:col-start-3 order-last">
						<TootsRadio bind:tootType entityName={entity.name} {getTootType} />
					</div>
				</div>
				<div class="my-4 text-grey-200">
					<TootTable {tableData} sourceData={toots} />
				</div>
			</div>
		</div></Section
	>
</div>
