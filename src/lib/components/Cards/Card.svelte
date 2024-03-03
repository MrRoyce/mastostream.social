<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	export let cardImage: string;
	export let description: string;
	export let imageDescription: string;
	export let title: string;
	export let url: string;
</script>

<Card img={cardImage}>
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
		{title}
	</h5>
	<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
		{imageDescription || description}
	</p>
	<a href={url} class="inline-flex items-center text-primary-600 hover:underline">
		{title}
		<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
	</a>
</Card>
