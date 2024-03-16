<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from '../$types';
	import { auth } from '$lib/firebase/client';
	import { authUser } from '$lib/stores';

	export let data: LayoutData;

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

<slot />
