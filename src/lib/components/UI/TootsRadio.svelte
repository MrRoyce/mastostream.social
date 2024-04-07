<script lang="ts">
	import { Radio } from 'flowbite-svelte';
	import { t } from '$lib/translations';

	export let tootType = 'both';
	export let getTootType = () => {};
</script>

<div class="grid grid-cols-2">
	<div class="grid col-span-1 grid-rows-1 grid-flow-col gap-4">
		<Radio name="hor-list" class="p-2" on:change={getTootType} value={'human'} bind:group={tootType}
			>{$t('general.human')}</Radio
		>

		<Radio name="hor-list" class="p-2" on:change={getTootType} value={'bot'} bind:group={tootType}
			>{$t('general.robot')}</Radio
		>

		<Radio name="hor-list" class="p-2" on:change={getTootType} value={'both'} bind:group={tootType}
			>{$t('general.both')}</Radio
		>
	</div>
</div>
