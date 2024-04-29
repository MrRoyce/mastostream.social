<script lang="ts">
	import { A } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	export let cardImage: string;
	export let description: string;
	export let imageDescription: string;
	export let providerName: string;
	export let url: string;
</script>

<div class=" bg-white shadow-2xl dark:bg-gray-800">
	<a
		href={url}
		target="_blank"
		class="flex mx-auto flex-col items-center bg-white border border-gray-200 shadow md:flex-row md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
	>
		<img
			class="object-cover w-full md:h-auto"
			src={cardImage}
			alt={imageDescription || description}
		/></a
	>
	<div class="p-5">
		<a
			href={url}
			target="_blank"
			class="flex mx-auto flex-col items-center bg-white border border-gray-200 shadow md:flex-row md:max-w-2xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
		>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-300">
				{imageDescription || description}
			</p>
		</a>
		<A href={url} target="_blank">
			{providerName}
			<ArrowRightOutline class="w-3 h-3 ms-2.5" />
		</A>
	</div>
</div>
