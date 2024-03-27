<script lang="ts">
	import { Radio } from 'flowbite-svelte';

	export let tootType = 'both';
	export let getTootType = () => {};
</script>

<ul
	class=" items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
>
	<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
		<div class="flex items-center ps-3">
			<Radio
				name="hor-list"
				class="p-2"
				on:change={getTootType}
				value={'human'}
				bind:group={tootType}>Human</Radio
			>
		</div>
	</li>
	<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
		<div class="flex items-center ps-3">
			<Radio name="hor-list" class="p-2" on:change={getTootType} value={'bot'} bind:group={tootType}
				>Bot</Radio
			>
		</div>
	</li>
	<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
		<div class="flex items-center ps-3">
			<Radio
				name="hor-list"
				class="p-2"
				on:change={getTootType}
				value={'both'}
				bind:group={tootType}>Both</Radio
			>
		</div>
	</li>
</ul>
