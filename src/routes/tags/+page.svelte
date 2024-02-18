<script lang="ts">
	import { ListPlaceholder } from 'flowbite-svelte';
	import { collection, limit, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/client';
	import { collectionStore } from 'sveltefire';
	import {
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

	let divClass = 'bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
	let innerDivClass =
		'flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass = 'w-full md:w-1/4 relative';
	let classInput =
		'text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10';

	let searchTerm = '';

	const tableData = {
		tableHead: ['Name', 'First seen']
	};

	let loadSpinner = false;
	const orderByField = 'timestamp';
	const direction = 'desc';
	const max = 20;

	const collectionRef = collection(db, 'tags');
	const q = query(collectionRef, orderBy(orderByField, direction), limit(max));
	const tags = collectionStore(db, q);
</script>

{#if loadSpinner}
	<ListPlaceholder size="xxl" class="mt-8" />
{:else}
	<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
		<TableSearch
			placeholder={`Search by tag`}
			hoverable={true}
			bind:inputValue={searchTerm}
			{divClass}
			{innerDivClass}
			{searchClass}
			{classInput}
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
				{#each $tags as item}
					<TableBodyRow on:dblclick={() => goto(`/tags/${item.name}`)}>
						<TableBodyCell>
							{item.name}
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
{/if}
