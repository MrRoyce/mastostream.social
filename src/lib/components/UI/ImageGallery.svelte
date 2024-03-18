<script lang="ts">
	import { Gallery } from 'flowbite-svelte';
	import BlurHash from '$lib/components/BlurHash/BlurHash.svelte';
	import CardWithLink from '$lib/components/Cards/Card.svelte';

	export let pictures: Array;
	export let sensitive: Boolean;
	export let showSensitive: Boolean;
</script>

{#each pictures as picture}
	<span class="pb-4">
		{#if sensitive && !showSensitive}
			<BlurHash
				hash={picture.blurhash}
				height={picture.meta?.small?.height || 256}
				width={picture.meta?.small?.width || 256}
			/>
		{:else}
			<CardWithLink
				cardImage={picture.remote_url || picture.remoteUrl || picture.preview_url || picture.src}
				description={picture.description || ''}
				imageDescription={picture.description || ''}
				providerName="View image"
				title={picture.description || ''}
				url={picture.remote_url || picture.remoteUrl || picture.preview_url || picture.src}
			/>
		{/if}
	</span>
{/each}
