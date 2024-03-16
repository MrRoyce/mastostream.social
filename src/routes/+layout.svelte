<script lang="ts">
	import '../app.pcss';
	import '@fontsource/dosis';
	import { AppBar, AppShell, initializeStores, Toast } from '@skeletonlabs/skeleton';
	import { Footer } from '$lib/components';
	import { authUser } from '$lib/stores';
	import { auth } from '$lib/firebase/client';
	import { onMount } from 'svelte';

	initializeStores();

	onMount(() => {
		auth.onAuthStateChanged(async (user) => {
			// if (!user) {
			// 	unsubscribe();
			// }
			let dataToSetToStore = {
				email: user?.email || null,
				displayName: user?.displayName || null,
				uid: user?.uid || null
			};

			authUser.update((curr: any) => {
				return { ...curr, ...dataToSetToStore };
			});
		});
	});
</script>

<Toast />

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-56" class="dark:text-white">
	<svelte:fragment slot="header"></svelte:fragment>
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
	<svelte:fragment slot="footer"></svelte:fragment>
</AppShell>
