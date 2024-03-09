<script>
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDown, Globe } from '$lib/components/icons';
	import { getLanguageList } from '$lib/utils/getLanguage';
	const languages = getLanguageList();
</script>

<div class="flex">
	<button
		id="flags-button"
		class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
		type="button"
	>
		<Globe />
		<span class="pl-4"><ChevronDown /></span>
	</button>
	<Dropdown triggeredBy="#flags-button">
		{#each languages as language}
			<DropdownItem class="flex items-center">
				<Globe />
				<span class="text-white pl-4">{language.text}</span>
			</DropdownItem>
		{/each}
	</Dropdown>
</div>
