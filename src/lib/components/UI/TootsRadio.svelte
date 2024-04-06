<script lang="ts">
	import { Radio } from 'flowbite-svelte';

	export let tootType = 'both';
	export let getTootType = () => {};
</script>

<div class="grid grid-cols-2">
	<div class="grid col-span-1 grid-rows-1 grid-flow-col gap-4">
		<Radio name="hor-list" class="p-2" on:change={getTootType} value={'human'} bind:group={tootType}
			>Human</Radio
		>

		<Radio name="hor-list" class="p-2" on:change={getTootType} value={'bot'} bind:group={tootType}
			>Bot</Radio
		>

		<Radio name="hor-list" class="p-2" on:change={getTootType} value={'both'} bind:group={tootType}
			>Both</Radio
		>
	</div>
</div>
