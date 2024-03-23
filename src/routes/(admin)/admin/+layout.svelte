<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutData } from '../$types';
	import { auth } from '$lib/firebase/client';
	import { authUser } from '$lib/stores';
	import { handleLogout } from '$lib/firebase/handleLogout';
	import { goto } from '$app/navigation';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { A } from 'flowbite-svelte';
	import { handleLocaleChange } from '$lib/utils/handleLocaleChange';
	import { AdminSidebar, Footer, Languages } from '$lib/components';
	import { UserIcon } from '$lib/components/icons';

	export let data: LayoutData;
	const userImage = data.user?.picture ? data.user?.picture : UserIcon;

	$: user = data.user;

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			if (!user) {
				unsubscribe();
			}
			let dataToSetToStore = {
				email: user ? user.email : null,
				displayName: user ? user.displayName : null,
				uid: user ? user.uid : null
			};

			authUser.update((curr: any) => {
				return { ...curr, ...dataToSetToStore };
			});
		});
	});
</script>

<slot name="header">
	<AppShell>
		<svelte:fragment slot="sidebarLeft">
			<AdminSidebar image={userImage} email={data.user?.email || ''} />
		</svelte:fragment>
		<AppBar>
			<svelte:fragment slot="lead">
				<A href="/"
					><strong class="text-xl uppercase dark:text-green-400"> <h1>U Toots</h1></strong></A
				>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				{#if user}
					<button on:click={handleLogout} type="button" class="btn variant-filled">Sign Out</button>
				{:else}
					<button on:click={() => goto('/login')} type="button" class="btn variant-filled"
						>Sign In</button
					>
				{/if}
				<button on:click={handleLocaleChange}><Languages /></button>
			</svelte:fragment>
		</AppBar>
		<!-- Router Slot -->
		<main class="container mx-auto">
			<div class="flex-initial">
				<slot />
			</div>
		</main>

		<slot name="pageFooter">
			<Footer />
		</slot>
	</AppShell>
</slot>
