<script lang="ts">
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import {
		A,
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

	let divClass = 'bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
	let innerDivClass =
		'flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass = 'w-full md:w-1/2 relative';
	let svgDivClass = 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
	let classInput =
		'text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10';

	export let entity: String | null = '';
	export let getData: () => {};
	export let showTableHead: Boolean = true;
	export let showTableSearch: Boolean = true;
	export let sourceData: Array<AccountRow>;
	export let tableData: TableData;

	const entityLower = entity?.toLowerCase();

	const columns = tableData.tableHead.length;
	const itemsPerPage = 10;
	const showPage = 5;

	let currentPosition = 0;
	let endPage: number;
	let pagesToShow: any[] = [];
	let searchTerm = '';
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
	<TableSearch
		placeholder={`Search by ${entity}`}
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
			<Button class="!p-2.5" on:click={() => goto(`/${entityLower}/${searchTerm}`)}>
				<SearchOutline class="w-5 h-5" />
			</Button>
		</div>
		{#if showTableHead}
			<TableHead>
				{#each tableData.tableHead as tableHead}
					<TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
						>{tableHead}</TableHeadCell
					>
				{/each}
			</TableHead>
		{/if}
		<TableBody>
			{#each currentPageItems as tableRow}
				<TableBodyRow on:click={() => goto(`/${entityLower}/${tableRow.acct}`)}>
					{#each Object.values(tableRow).slice(1, columns + 1) as value, index}
						<TableBodyCell
							class={value === true || value === false
								? 'text-center'
								: typeof value === 'number'
									? 'text-right'
									: 'text-left'}
							tdClass="px-4 py-3"
						>
							{#if tableRow.avatar && typeof value === 'string' && value.includes('https')}
								<img class=" w-10 h-auto max-w-xs" src={tableRow.avatar} alt="User" />
							{:else if tableRow.domainName && typeof value === 'string' && value?.includes('https')}
								<A
									href={value}
									rel="noopener nofollow"
									target="_blank"
									class="font-medium hover:underline">{value}</A
								>
							{:else}
								<span class={tableRow.deleted ? 'text-gray-500' : ''}
									>{@html value
										.replaceAll('</p><p>', '</p><br /><p>')
										.replaceAll(
											'class="invisible"',
											'class="class="font-medium hover:text-blue-300 hover:underline"'
										)}</span
								>
							{/if}
						</TableBodyCell>
					{/each}
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
</Table>
