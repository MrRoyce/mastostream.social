<script lang="ts">
	/**
	 * @type {any}
	 */
	export let toots: any[] = [];
	let elemCarousel: HTMLDivElement;

	function carouselThumbnail(index: number) {
		elemCarousel.scroll(elemCarousel.clientWidth * index, 0);
	}
</script>

<div class="card grid grid-cols-6 gap-4 p-4">
	{#each $toots as toot, i}
		<button type="button" on:click={() => carouselThumbnail(i)}>
			<img
				class="h-5 w-full object-cover rounded-container-token"
				src={toot.imageUrl ||
					'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg'}
				alt={toot}
				loading="lazy"
			/>
		</button>
	{/each}
</div>
