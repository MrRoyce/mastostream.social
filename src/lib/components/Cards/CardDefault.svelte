<script lang="ts">
	import { A, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	export let description: string;
	export let providerName: string;
	export let title: string;
	export let url: string;
</script>

<Card href={url} target="_blank">
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">{title}</h5>
	<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
		{description}
	</p>
	<A href={url} target="_blank">
		{providerName}
		<ArrowRightOutline class="w-3 h-3 ms-2.5" />
	</A>
</Card>
