<script lang="ts">
	import { Button, TableSearch, Dropdown, DropdownItem } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';
	import {} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';

	export let data: PageData;

	let divClass = 'bg-white dark:bg-gray-800 relative shadow-md overflow-hidden h-72';
	let innerDivClass =
		'flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 p-4';
	let searchClass = 'w-full md:w-1/4 relative';
	let classInput =
		'text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10';

	let searchTerm = '';
	$: activeUrl = $page.url?.pathname;
</script>

<TableSearch
	placeholder={`Your search`}
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
		<Button>Search full text by ...<ChevronDownSolid class="w-3 h-3 ms-2 text-white " /></Button>
		<Dropdown {activeUrl}>
			<DropdownItem href={`/search/account/${searchTerm}`}>Account Name</DropdownItem>
			<DropdownItem href={`/search/website/${searchTerm}`}>Website name</DropdownItem>
			<DropdownItem href={`/search/toot/${searchTerm}`}>Toot content</DropdownItem>
		</Dropdown>
	</div>
</TableSearch>
