<script lang="ts">
	import type { PageData } from './$types';
	import { ListPlaceholder } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import Table from '$lib/components/UI/Table.svelte';

	export let data: PageData;
	const entities: DocumentData[] = data.entities;

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Name', 'Type', 'Account', 'Followers', 'Following', '# Toots', 'Since']
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
