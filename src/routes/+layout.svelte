<script lang="ts">
	import '../app.pcss';
	import '@fontsource/dosis';
	import { AppShell, initializeStores, Toast } from '@skeletonlabs/skeleton';
	import { Loading } from '$lib/components';
	import { loading } from '$lib/stores';
	import { navigating } from '$app/stores';

	initializeStores();

	$: $loading = !!$navigating;
</script>

<Toast />

{#if $loading}
	<Loading />
{:else}
	<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-56" class="dark:text-white">
		<svelte:fragment slot="header"></svelte:fragment>
		<slot />
		<!-- ---- / ---- -->
		<svelte:fragment slot="pageFooter"></svelte:fragment>
		<!-- <svelte:fragment slot="footer"></svelte:fragment> -->
	</AppShell>
{/if}
