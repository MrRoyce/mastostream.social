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
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils/formatDate';
	import { searchStyles } from '$lib/assets/styles/search';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Tags'
		});
	}

	export let data: PageData;
	const tags = data.tags;

	let searchTerm = '';

	const tableData = {
		tableHead: ['Name', 'Count', 'Last Toot (UTC)']
	};
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Breadcrums for tags page">
		<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
		<BreadcrumbItem>Tags</BreadcrumbItem>
	</Breadcrumb>
</div>
<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5" hoverable={true}>
	<TableSearch
		bind:inputValue={searchTerm}
		classInput={searchStyles.classInput}
		divClass={searchStyles.divClass}
		hoverable={true}
		innerDivClass={searchStyles.innerDivClass}
		placeholder={`Search by tag`}
		searchClass={searchStyles.searchClass}
	>
		<div
			slot="header"
			class="w-full md:w-auto md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-left md:space-x-3 flex-shrink-0"
		>
			<Button class="!p-2.5" on:click={() => goto(`/tags/${searchTerm}`)}>
				<SearchOutline class="w-5 h-5" />
			</Button>
		</div>
		<TableHead>
			{#each tableData.tableHead as tableHead}
				<TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
					>{tableHead}</TableHeadCell
				>
			{/each}
		</TableHead>
		<TableBody>
			{#each tags as item}
				<TableBodyRow on:click={() => goto(`/tags/${item.name}`)}>
					<TableBodyCell>
						{item.name}
					</TableBodyCell>
					<TableBodyCell>
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
	</TableSearch>
</Table>
