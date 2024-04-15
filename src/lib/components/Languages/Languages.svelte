<script>
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDown, Globe } from '$lib/components/icons';
	import { getLanguageList } from '$lib/utils/getLanguage';
	import { browser } from '$app/environment';
	const languages = getLanguageList();

	let dropdownOpen = false;
	function closeDropdown() {
		if (browser && document) {
			document.getElementById('flags-dropdown').style.display = 'none';
		}
		dropdownOpen = false;
	}
</script>

<div class="flex">
	<Button
		id="flags-button"
		class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100  hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700  "
		type="button"
	>
		<Globe />
		<span class="pl-4"><ChevronDown /></span>
	</Button>
	<Dropdown id="flags-dropdown" triggeredBy="#flags-button" bind:open={dropdownOpen}>
		{#each languages as language}
			<DropdownItem class="flex items-center" on:click={closeDropdown}>
				<Globe />
				<span class="text-white pl-4">{language.text}</span>
			</DropdownItem>
		{/each}
	</Dropdown>
</div>
