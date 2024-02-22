<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import TootTable from '$lib/components/UI/TootTable.svelte';

	export let data: PageData;
	const toots = data.toots;
	const term = data.term;

	console.log('toots in search', toots);
	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};
</script>

<div class="dark:bg-gray-800">
	<div class="container mx-auto my-5 p-5">
		<div class="md:flex no-wrap md:-mx-2">
			<!-- Left Side -->
			<div class="w-full md:w-3/12 md:mx-2">
				<!-- Profile Card -->
				<h1>Search for {term}</h1>
			</div>
			<!-- Right Side -->
		</div>
		<div class="my-4 text-white">
			<h2 class="text-gray-200 font-bold text-xl leading-8 my-1">
				Latest toots having {term}:
			</h2>

			<TootTable {tableData} sourceData={toots} getData={() => {}} entity={`Toots from ${term}`} />
		</div>
	</div>
</div>

<!-- component -->
<style>
	:root {
		--main-color: #4a76a8;
	}

	.bg-main-color {
		background-color: var(--main-color);
	}

	.text-main-color {
		color: var(--main-color);
	}

	.border-main-color {
		border-color: var(--main-color);
	}
</style>
