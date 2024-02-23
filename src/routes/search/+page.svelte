<script lang="ts">
	import { Button, TableSearch } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { SearchOutline } from 'flowbite-svelte-icons';

	export let data: PageData;

	let divClass = 'bg-white dark:bg-gray-800 relative shadow-md overflow-hidden';
	let innerDivClass =
		'flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass = 'w-full md:w-1/4 relative';
	let classInput =
		'text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10';

	let searchTerm = '';
	// TODO make type a variable
</script>

<TableSearch
	placeholder={`Search by account`}
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
		<Button class="!p-2.5" on:click={() => goto(`/search/account/${searchTerm}`)}>
			<SearchOutline class="w-5 h-5" />
		</Button>
	</div>
</TableSearch>
