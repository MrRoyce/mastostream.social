<script lang="ts">
	import BlurHash from '$lib/components/BlurHash/BlurHash.svelte';
	import CardWithImage from '$lib/components/Cards/Card.svelte';

	export let pictures: Array;
	export let sensitive: Boolean;
	export let showSensitive: Boolean;
</script>

<div class="pt-4">
	{#each pictures as picture}
		<span class="pb-4">
			{#if sensitive && !showSensitive}
				<BlurHash hash={picture.blurhash} height={256} width={256} />
			{:else}
				<CardWithImage
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
</div>
