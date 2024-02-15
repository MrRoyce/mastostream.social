<script lang="ts">
	import type { PageData } from './$types';
	import { ListPlaceholder } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import Table from '$lib/components/UI/Table.svelte';

	export let data: PageData;

	let entities: DocumentData[] = data.entities;

	let tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: [
			'Account',
			'Human',
			'Created At',
			'Name',
			'Followers',
			'Following',
			'Last Toot',
			'Total Toot'
		]
	};

	let loadSpinner = false;
</script>

{#if loadSpinner}
	<ListPlaceholder size="xxl" class="mt-8" />
{:else}
	<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 m-4 h-fit">
		<Table {tableData} sourceData={entities} getData={() => {}} entity="Accounts" />
	</Section>
{/if}
