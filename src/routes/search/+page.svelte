<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		TableSearch,
		Dropdown,
		DropdownItem
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';
	import {} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { searchStyles } from '$lib/assets/styles/search';

	export let data: PageData;

	let searchTerm = '';
	$: activeUrl = $page.url?.pathname;
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Link to Dashboard">
		<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
		<BreadcrumbItem>Search</BreadcrumbItem>
	</Breadcrumb>
</div>
<TableSearch
	placeholder={`Your search`}
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
		<Button>Search full text by ...<ChevronDownSolid class="w-3 h-3 ms-2 text-white " /></Button>
		<Dropdown {activeUrl}>
			<DropdownItem href={`/search/account/${searchTerm}`}>Account Name</DropdownItem>
			<DropdownItem href={`/search/website/${searchTerm}`}>Website name</DropdownItem>
			<DropdownItem href={`/search/toot/${searchTerm}`}>Toot content</DropdownItem>
		</Dropdown>
	</div>
</TableSearch>
