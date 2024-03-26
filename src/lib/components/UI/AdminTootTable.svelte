<script lang="ts">
	import {
		A,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { truncateHTML } from '$lib/utils/truncateHTML';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { showSensitiveStore } from '$lib/stores';
	import { formatCreatedAt } from '$lib/utils';

	export let showTableHead: Boolean = true;
	export let sourceData: Array<AccountRow>;
	export let tableData: TableData;
	export let delData: (item: any) => {};

	const itemsPerPage = 100;

	let currentPosition = 0;
	let totalItems = sourceData.length;
	let showSensitive: boolean;
	showSensitiveStore.subscribe((data) => {
		showSensitive = data;
	});

	showSensitive = $showSensitiveStore;

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
			<TableBodyRow>
				<TableBodyCell class="text-center">
					{item.sensitive ? '❌' : '✅'}
				</TableBodyCell>
				<TableBodyCell class="text-center">
					{item.createdAt?.includes('T') ? formatCreatedAt(item.createdAt) : item.createdAt}
				</TableBodyCell>
				<TableBodyCell class="whitespace-normal break-words py-2">
					{#if item.sensitive && !showSensitive}
						{item.spoiler_text || item.spoilerText || 'Sensitive content'}
					{:else}
						{@html truncateHTML(item.content, 300)}
					{/if}
				</TableBodyCell>
				<TableBodyCell class="text-center">
					<A
						rel="noopener nofollow"
						href={item.uri}
						target="_blank"
						class="font-medium hover:underline"
						><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" /></A
					></TableBodyCell
				>
				<TableBodyCell class="text-center">
					<button
						type="button"
						class="font-medium text-red-600 dark:text-red-500 hover:underline"
						on:click={() => delData(item)}>Del</button
					>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
