<script lang="ts">
	import { collection, limit, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/client';
	import { collectionStore } from 'sveltefire';
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
	import { getLanguage } from '$lib/utils/getLanguage';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Languages'
		});
	}

	let searchTerm = '';

	const tableData = {
		tableHead: ['Name', 'Language', 'Count', 'First seen']
	};

	const orderByField = 'language';
	const direction = 'asc';
	const max = 200;

	const collectionRef = collection(db, 'languages');
	const q = query(collectionRef, orderBy(orderByField, direction), limit(max));
	const languages = collectionStore(db, q);
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Link to Dashboard">
		<BreadcrumbItem href="/" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>Languages</BreadcrumbItem>
	</Breadcrumb>
</div>
<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<TableSearch
		placeholder={`Search by language`}
		hoverable={true}
		bind:inputValue={searchTerm}
		divClass={searchStyles.divClass}
		innerDivClass={searchStyles.innerDivClass}
		searchClass={searchStyles.searchClass}
		classInput={searchStyles.classInput}
	>
		<div
			slot="header"
			class="w-full md:w-auto md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-left md:space-x-3 flex-shrink-0"
		>
			<Button class="!p-2.5" on:click={() => goto(`/languages/${searchTerm}`)}>
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
			{#each $languages as item}
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
						{item.timestamp
							? formatDate({
									seconds: item.timestamp.seconds,
									nanoseconds: item.timestamp.nanoseconds
								})
							: 'N/A'}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
</Table>
