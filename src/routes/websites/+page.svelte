<script lang="ts">
	import { A } from 'flowbite-svelte';
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

	import { searchStyles } from '$lib/assets/styles/search';

	let searchTerm = '';

	const tableData = {
		tableHead: ['Pic', 'Open', 'Name', 'Languages', '# Users', 'Description', 'Link']
	};

	const orderByField = 'timestamp';
	const direction = 'desc';
	const max = 200;

	const collectionRef = collection(db, 'domains');
	const q = query(collectionRef, orderBy(orderByField, direction), limit(max));
	const domains = collectionStore(db, q);
</script>

<Table name="advancedTable" classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<TableSearch
		placeholder={`Search by name`}
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
			<Button class="!p-2.5" on:click={() => goto(`/websites/${searchTerm}`)}>
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
			{#each $domains as item}
				<TableBodyRow on:click={() => goto(`/websites/${item.domain}`)}>
					<TableBodyCell
						><img
							class=" w-10 h-auto max-w-xs"
							src={item.instance.contact_account?.avatar_static}
							alt="User"
						/></TableBodyCell
					>
					<TableBodyCell>
						{item.instance?.registrations ? (item.instance.registrations ? '✅' : '❌') : '❓'}
					</TableBodyCell>
					<TableBodyCell>
						{item.instance?.uri ? item.instance.uri : '❓'}
					</TableBodyCell>
					<TableBodyCell>
						{item.instance?.languages ? item.instance.languages.join(', ') : '❓'}
					</TableBodyCell>
					<TableBodyCell class="text-right">
						{item.instance?.stats?.user_count
							? item.instance.stats.user_count.toLocaleString()
							: '❓'}
					</TableBodyCell>
					<TableBodyCell>
						{item.instance?.short_description
							? item.instance.short_description.substring(0, 50 - 3) + '...'
							: ''}
					</TableBodyCell>
					<TableBodyCell>
						<A
							rel="noopener nofollow"
							href="https://{item.domain}"
							target="_blank"
							class="font-medium hover:underline">⚡︎ ...</A
						></TableBodyCell
					>
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
</Table>
