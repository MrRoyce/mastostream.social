<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils/formatDate';
	import { searchStyles } from '$lib/assets/styles/search';
	import { getLanguage } from '$lib/utils/getLanguage';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Languages'
		});
	}

	export let data: PageData;
	const languages = data.languages;

	let searchTerm = '';

	const tableData = {
		tableHead: ['Name', 'Language', 'Count', 'Last Toot']
	};
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Link to Dashboard">
		<BreadcrumbItem href="/" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>Languages</BreadcrumbItem>
	</Breadcrumb>
</div>
<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5" hoverable={true}>
	<TableHead>
		{#each tableData.tableHead as tableHead}
			<TableHeadCell class="text-center" padding="px-4 py-3" scope="col">{tableHead}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each languages as item}
			{@const translations = getLanguage(item.language)}
			<TableBodyRow on:click={() => goto(`/languages/${item.language}`)}>
				<TableBodyCell>
					{item.language}
				</TableBodyCell>
				<TableBodyCell>
					{translations.englishValue}
				</TableBodyCell>
				<TableBodyCell class="text-right">
					{item.count.toLocaleString()}
				</TableBodyCell>

				<TableBodyCell>
					{item.lastSeen
						? formatDate({
								seconds: item.lastSeen.seconds,
								nanoseconds: item.lastSeen.nanoseconds
							})
						: 'N/A'}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
