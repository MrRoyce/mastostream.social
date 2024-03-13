<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	export let cardImage: string;
	export let description: string;
	export let imageDescription: string;
	export let providerName: string;
	export let title: string;
	export let url: string;
</script>

<a
	href={url}
	target="_blank"
	class="flex flex-col items-center bg-white border border-gray-200 shadow md:flex-row md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
>
	<img
		class="object-cover w-full h-96 md:h-auto md:w-48"
		src={cardImage}
		alt={imageDescription || description}
	/>
	<div class="flex flex-col justify-between p-4 leading-normal">
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
			{imageDescription || description}
		</p>
		<A href={url} target="_blank">
			{providerName}
			<ArrowRightOutline class="w-3 h-3 ms-2.5" />
		</A>
	</div>
</a>
