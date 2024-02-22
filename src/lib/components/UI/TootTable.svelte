<script lang="ts">
	import { onMount } from 'svelte';
	import {
		A,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { truncateHTML } from '$lib/utils/truncateHTML';

	export let entity: String | null = '';
	export let getData: () => {};
	export let showTableHead: Boolean = true;
	export let sourceData: Array<AccountRow>;
	export let tableData: TableData;

	const columns = tableData.tableHead.length;
	const itemsPerPage = 100;
	const showPage = 5;

	let currentPosition = 0;
	let endPage: number;
	let pagesToShow: any[] = [];
	let startPage: number;
	let totalItems = sourceData.length;
	let totalPages = 0;

	const updateDataAndPagination = () => {
		const currentPageItems = sourceData.slice(currentPosition, currentPosition + itemsPerPage);
		renderPagination(currentPageItems.length);
	};

	const loadNextPage = () => {
		if (currentPosition + itemsPerPage < sourceData.length) {
			currentPosition += itemsPerPage;
			updateDataAndPagination();
		}
	};

	const loadPreviousPage = () => {
		if (currentPosition - itemsPerPage >= 0) {
			currentPosition -= itemsPerPage;
			updateDataAndPagination();
		}
	};

	const renderPagination = (totalItems) => {
		totalPages = Math.ceil(sourceData.length / itemsPerPage);
		const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

		startPage = currentPage - Math.floor(showPage / 2);
		startPage = Math.max(1, startPage);
		endPage = Math.min(startPage + showPage - 1, totalPages);

		pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
	};

	const goToPage = (pageNumber: number) => {
		currentPosition = (pageNumber - 1) * itemsPerPage;
		updateDataAndPagination();
	};

	$: startRange = currentPosition + 1;
	$: endRange = Math.min(currentPosition + itemsPerPage, totalItems);

	onMount(() => {
		// Call renderPagination when the component initially mounts
		renderPagination(sourceData.length);
	});

	$: sourceData;
	$: totalItems = sourceData.length;

	$: currentPageItems = sourceData.slice(currentPosition, currentPosition + itemsPerPage);
</script>

<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	{#if showTableHead}
		<TableHead>
			{#each tableData.tableHead as tableHead, index}
				<TableHeadCell
					class={index === 0 ? 'text-center w-48' : 'text-center'}
					padding="px-4 py-3"
					scope="col">{tableHead}</TableHeadCell
				>
			{/each}
		</TableHead>
	{/if}
	<TableBody>
		{#each currentPageItems as item}
			<TableBodyRow on:dblclick={() => goto(`/toots/${item.accountId}_${item.tootId}`)}>
				<TableBodyCell
					><img class=" w-10 h-auto max-w-xs" src={item.avatar} alt="User" /></TableBodyCell
				>
				<TableBodyCell>
					{item.sensitive ? '✅' : '❌'}
				</TableBodyCell>
				<TableBodyCell>
					{item.bot ? '🤖' : '👤'}
				</TableBodyCell>
				<TableBodyCell>
					{item.createdAt}
				</TableBodyCell>
				<TableBodyCell>
					{item.acct}
				</TableBodyCell>
				<TableBodyCell>
					{item.language}
				</TableBodyCell>
				<TableBodyCell>
					{@html truncateHTML(item.content, 50)}
				</TableBodyCell>
				<TableBodyCell>
					<A
						rel="noopener nofollow"
						href={item.uri}
						target="_blank"
						class="font-medium hover:underline">⚡︎ ...</A
					></TableBodyCell
				>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
