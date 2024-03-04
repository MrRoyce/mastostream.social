<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { collection, limit, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/client';
	import { collectionStore } from 'sveltefire';
	import {
		Breadcrumb,
		BreadcrumbItem,
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
	import showSensitiveStore from '$lib/stores/SensitiveStore';

	const tableData = {
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};

	const orderByField = 'timestamp';
	const direction = 'desc';
	const max = 200;

	const collectionRef = collection(db, 'toots');
	const q = query(collectionRef, orderBy(orderByField, direction), limit(max));
	const toots = collectionStore(db, q);

	let showSensitive: boolean;

	showSensitiveStore.subscribe((data) => {
		console.log('showSensitive', data);
		showSensitive = data;
	});

	showSensitive = $showSensitiveStore;
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Link to Dashboard">
		<BreadcrumbItem href="/" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>Toots</BreadcrumbItem>
	</Breadcrumb>
</div>
<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<TableHead>
		{#each tableData.tableHead as tableHead}
			<TableHeadCell class="text-center" padding="px-4 py-3" scope="col">{tableHead}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each $toots as item}
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
					{`${item.createdAt.split('T')[1].split('.')[0]}`}
				</TableBodyCell>
				<TableBodyCell>
					{item.acct}
				</TableBodyCell>
				<TableBodyCell>
					{item.language}
				</TableBodyCell>
				<TableBodyCell>
					{#if item.sensitive && !showSensitive}
						{item.spoiler_text || 'Sensitive content'}
					{:else}
						{@html truncateHTML(item.content, 50)}
					{/if}
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
