<script lang="ts">
	import { A, ListPlaceholder } from 'flowbite-svelte';
	import { collection, limit, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/client';
	import { collectionStore } from 'sveltefire';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	const tableData = {
		tableHead: ['Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};

	let loadSpinner = false;
	const orderByField = 'timestamp';
	const direction = 'desc';
	const max = 20;

	const collectionRef = collection(db, 'toots');
	const q = query(collectionRef, orderBy(orderByField, direction), limit(max));
	const toots = collectionStore(db, q);

	function truncateHtml(htmlString, maxLength) {
		// Create a temporary div element
		const tempDiv = document.createElement('div');

		// Set the HTML content of the div with the input HTML string
		tempDiv.innerHTML = htmlString;

		// Get the text content of the div (strips HTML tags)
		let textContent = tempDiv.textContent || tempDiv.innerText;

		// Truncate the text content to the specified maxLength
		const truncatedText =
			textContent.length > maxLength
				? textContent.substring(0, maxLength - 3) + '...'
				: textContent;

		return truncatedText;
	}
</script>

{#if loadSpinner}
	<ListPlaceholder size="xxl" class="mt-8" />
{:else}
	<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
		<TableHead>
			{#each tableData.tableHead as tableHead}
				<TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
					>{tableHead}</TableHeadCell
				>
			{/each}
		</TableHead>
		<TableBody>
			{#each $toots as item}
				<TableBodyRow on:dblclick={() => goto(`/toots/${item.accountId}_${item.tootId}`)}>
					<TableBodyCell>
						{item.sensitive ? '❌' : '✅'}
					</TableBodyCell>
					<TableBodyCell>
						{item.bot ? '🤖' : '👤'}
					</TableBodyCell>
					<TableBodyCell>
						{`${item.createdAt.split('T')[1].split('.')[0]}`}
					</TableBodyCell>
					<TableBodyCell>
						{item.acct}
					</TableBodyCell>
					<TableBodyCell>
						{item.language}
					</TableBodyCell>
					<TableBodyCell>
						{@html truncateHtml(item.content, 50)}
					</TableBodyCell>
					<A href={item.uri} target="_blank" class="font-medium hover:underline">⚡︎ ...</A>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
