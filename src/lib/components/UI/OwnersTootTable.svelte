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
	import { showSensitiveStore } from '$lib/stores';
	import { formatCreatedAt } from '$lib/utils';
	import { TableWrap } from '$lib/components';

	export let showAcct: Boolean = false;
	export let showTableHead: Boolean = true;
	export let sourceData: Array<AccountRow>;
	export let tableData: TableData;

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
	const mb = 'mb-4';
</script>

<TableWrap spacing="" {mb}>
	<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 sm:p-5">
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
				<TableBodyRow
					class="border-none cursor-pointer"
					on:click={() => goto(`/toots/${item.accountId}_${item.tootId}`)}
				>
					<TableBodyCell class="text-center">
						{item.sensitive ? '❌' : '✅'}
					</TableBodyCell>
					<TableBodyCell class="text-center">
						{item.createdAt?.includes('T') ? formatCreatedAt(item.createdAt) : item.createdAt}
					</TableBodyCell>
					<TableBodyCell class="text-right"
						>{item.mediaAttachementCounts?.totalPictures || 0}</TableBodyCell
					>
					<TableBodyCell class="text-right"
						>{item.mediaAttachementCounts?.totalVideos || 0}</TableBodyCell
					>
					<TableBodyCell class="text-right"
						>{item.mediaAttachementCounts?.totalAudio || 0}</TableBodyCell
					>

					<TableBodyCell class="text-center">
						<A
							rel="noopener nofollow"
							href={item.uri}
							target="_blank"
							class="font-medium hover:underline"
							><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" /></A
						></TableBodyCell
					>
				</TableBodyRow>
				<TableBodyRow
					class=" cursor-pointer"
					on:click={() => goto(`/toots/${item.accountId}_${item.tootId}`)}
				>
					<TableBodyCell colspan="6" class="whitespace-normal break-words py-2">
						{#if item.sensitive && !showSensitive}
							{item.spoiler_text || item.spoilerText || 'Sensitive content'}
						{:else}
							<span class="text-base text-gray-200">{@html truncateHTML(item.content, 300)}</span>
						{/if}
						{#if showAcct}
							<span class="text-gray-400">
								{@html '<br /><br />'}
								{item.acct}
								{@html '<br />'}

								{item.createdAt?.includes('T') ? formatCreatedAt(item.createdAt) : item.createdAt}
							</span>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</TableWrap>
