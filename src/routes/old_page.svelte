<script lang="ts">
	import { collectionStore } from 'sveltefire';
	import { db } from '$lib/firebase/client';
	import { collection, limit, orderBy, query } from 'firebase/firestore';
	import { Section, Cta } from 'flowbite-svelte-blocks';
	import { ArrowRightSolid } from 'flowbite-svelte-icons';
	interface Toot {
		uri?: string;
		content?: string;
		imageUrl?: string;
	}

	let elemCarousel: HTMLDivElement;

	function carouselLeft() {
		const x =
			elemCarousel.scrollLeft === 0
				? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
				: elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
		elemCarousel.scroll(x, 0);
	}

	function carouselRight() {
		const x =
			elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
				? 0 // loop
				: elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
		elemCarousel.scroll(x, 0);
	}

	function carouselThumbnail(index: number) {
		elemCarousel.scroll(elemCarousel.clientWidth * index, 0);
	}

	const tootsRef = collection(db, 'toots');
	const q = query(tootsRef, orderBy('createdAt', 'desc'), limit(5));

	const toots = collectionStore<Toot[]>(db, q);
</script>

<div class="card grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4">
	<!-- Button: Left -->
	<button type="button" class="variant-filled btn-icon" on:click={carouselLeft}>
		<i class="fa-solid fa-arrow-left" />
	</button>>
	<!-- Full Images -->
	<div bind:this={elemCarousel} class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
		{#each $toots as toot}
			<Cta ctatype="image">
				<svelte:fragment slot="img">
					<img
						class="h-96 w-full object-cover"
						src={toot.imageUrl ||
							'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg'}
						alt="dashboard"
					/>
				</svelte:fragment>

				<span class="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg"
					>{@html toot.content}</span
				>
				<a
					target="_blank"
					href={toot.uri}
					class="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
				>
					Get started
					<ArrowRightSolid size="md" class="-mr-1 ml-2" />
				</a>
			</Cta>
		{/each}
	</div>
	<!-- Button: Right -->
	<button type="button" class="variant-filled btn-icon" on:click={carouselRight}>
		<i class="fa-solid fa-arrow-right" />
	</button>
</div>
<div class="card grid grid-cols-6 gap-4 p-4">
	{#each $toots as toot, i}
		<button type="button" on:click={() => carouselThumbnail(i)}>
			<img
				class="h-25 w-full object-cover rounded-container-token"
				src={toot.imageUrl ||
					'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg'}
				alt={toot}
				loading="lazy"
			/>
		</button>
	{/each}
</div>
