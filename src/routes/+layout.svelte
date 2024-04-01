<script lang="ts">
	import '../app.pcss';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	import { Loading } from '$lib/components';
	import { loading } from '$lib/stores';
	import { navigating } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	initializeStores();

	$: $loading = !!$navigating;
</script>

<Toast />

{#if $loading}
	<Loading />
{:else}
	<slot />
{/if}
