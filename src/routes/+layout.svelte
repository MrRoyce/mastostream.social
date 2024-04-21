<script lang="ts">
	import '../app.pcss';
	import { onMount } from 'svelte';
	import { session } from '$lib/stores/authStore';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	import { Loading } from '$lib/components';
	import { loading } from '$lib/stores';
	import { navigating } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let authLoading: boolean = true;
	let loggedIn: boolean = false;

	session.subscribe((cur: any) => {
		authLoading = cur?.loading;
		loggedIn = cur?.loggedIn;
	});

	initializeStores();

	onMount(async () => {
		const user: any = await data.getAuthUser();

		const loggedIn = !!user && user?.uid;
		session.update((cur: any) => {
			authLoading = false;
			return {
				...cur,
				user,
				loggedIn,
				loading: false
			};
		});
	});

	$: $loading = !!$navigating;
</script>

<Toast />

{#if $loading}
	<Loading />
{:else}
	<slot />
{/if}
