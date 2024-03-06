<script lang="ts">
	import { A, P, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	export let cardImage: string;
	export let description: string;
	export let imageDescription: string;
	export let providerName: string;
	export let title: string;
	export let url: string;
</script>

<div class="flex">
	<Card img={cardImage} horizontal size="lg" class="w-full">
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{title}
		</h5>
		<P class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			{imageDescription || description}
		</P>
		<A href={url} target="_blank">
			{providerName}
			<ArrowRightOutline class="w-3 h-3 ms-2.5" />
		</A>
	</Card>
</div>
