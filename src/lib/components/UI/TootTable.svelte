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
	import { goto } from '$app/navigation';
	import { truncateHTML } from '$lib/utils/truncateHTML';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	export let showTableHead: Boolean = true;
	export let sourceData: Array<AccountRow>;
	export let tableData: TableData;

	const itemsPerPage = 100;

	let currentPosition = 0;
	let totalItems = sourceData.length;

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
			<TableBodyRow on:click={() => goto(`/toots/${item.accountId}_${item.tootId}`)}>
				<TableBodyCell
					><img class=" w-10 h-auto max-w-xs" src={item.avatar} alt="User" /></TableBodyCell
				>
				<TableBodyCell>
					{item.sensitive ? '❌' : '✅'}
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
						class="font-medium hover:underline"
						><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" /></A
					></TableBodyCell
				>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
