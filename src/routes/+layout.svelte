<script lang="ts">
	import { Section } from 'flowbite-svelte-blocks';
	import '../app.pcss';
	import {
		initializeStores,
		AppBar,
		AppShell,
		Drawer,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { afterNavigate } from '$app/navigation';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';

	initializeStores();

	const drawerStore = getDrawerStore();

	afterNavigate((params: AfterNavigate) => {
		const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<Drawer><Navigation /></Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-56">
	<svelte:fragment slot="header"
		><AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<strong class="text-xl uppercase dark:text-white">Mastostream.Social</strong>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm" href="/">Home</a>
				<a class="btn btn-sm" href="/about">About</a>
			</svelte:fragment>
		</AppBar></svelte:fragment
	>
	<svelte:fragment slot="sidebarLeft">
		<!-- Hidden below Tailwind's large breakpoint -->
		<div id="sidebar-left" class="hidden lg:block">
			<span class="dark:text-white"><Navigation /></span>
		</div>
	</svelte:fragment>
	<!-- Router Slot -->

	<main class=" w-full mx-auto">
		<Section class="bg-white dark:bg-gray-900">
			<slot />
		</Section>
	</main>

	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>
