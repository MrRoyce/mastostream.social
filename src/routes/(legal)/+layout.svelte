<script lang="ts">
	import '../../app.pcss';
	import { t } from '$lib/translations';
	import { LegalSidebar } from '$lib/components';
	import { getSidebarItems } from '$lib/utils';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { sineIn } from 'svelte/easing';
	import {
		A,
		Button,
		CloseButton,
		Drawer,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import { handleLogout } from '$lib/firebase/handleLogout';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/client';
	import { authUser } from '$lib/stores';
	import { Footer, Languages, UserIcon } from '$lib/components';
	import { locale } from '$lib/translations';
	import { getLanguageList } from '$lib/utils/getLanguage';
	import { goto } from '$app/navigation';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
	const userImage = data.user?.picture ? data.user?.picture : UserIcon;

	let hideDrawer = true;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let defaultLanguage: string = 'en';
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

	function getTargetLanguage(languageText: string) {
		const languages = getLanguageList();
		const result = languages.filter((language) => language.text === languageText);
		return result[0]?.value || 'en';
	}

	function handleLocaleChange(event: Event) {
		event.preventDefault();
		defaultLanguage = getTargetLanguage(event?.target?.innerHTML || 'English');
		$locale = defaultLanguage;
	}

	let pathname = data.pathname.slice(1);

	const pageSidebarItems = getSidebarItems({ group: 'legal', page: pathname });

	$: user = data.user;
	$: pathname;
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={hideDrawer} id="sidebar2">
	<div class="flex items-center dark:text-white">
		<h5
			id="drawer-navigation-label-3"
			class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
		>
			{$t('pagelinks.menu')}
		</h5>
		<CloseButton on:click={() => (hideDrawer = true)} class="mb-4" />
	</div>
	<Sidebar class="dark:text-white">
		<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
			{#if pageSidebarItems}
				{#each pageSidebarItems.groups as group}
					<!-- content here -->
					<SidebarGroup class="pb-6">
						{group.name}
						{#each group.items as item}
							<SidebarItem
								on:click={() => (hideDrawer = true)}
								label={item.label}
								href={item.href}
							/>
						{/each}
					</SidebarGroup>
				{/each}
			{/if}
		</SidebarWrapper>
	</Sidebar>
</Drawer>

<AppShell>
	<!-- (header) -->
	<svelte:fragment slot="sidebarLeft">
		<div class="hidden-on-mobile">
			<LegalSidebar {pathname} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<!-- lead left of appbar-->
			<svelte:fragment slot="lead">
				<div class="flex show-on-mobile dark:text-white">
					<Button class="mr-4 lg:hidden" on:click={() => (hideDrawer = false)}>
						<span>
							<svg viewBox="0 0 100 80" class=" w-4 h-4 fill-current text-white">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</Button>
				</div>

				<A href="/" aClass="hover:underline"
					><strong class="text-xl uppercase dark:text-green-400"> <h1>U Toots</h1></strong></A
				>
			</svelte:fragment>

			<!-- trail - right of appbar -->
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
	</svelte:fragment>
	<!-- <svelte:fragment slot="pageHeader">Page Header</svelte:fragment> -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
	<!-- (footer) -->
</AppShell>

<style>
	/* Other styles for your component */

	/* Show the slot content only on small screens */
	.show-on-mobile {
		@apply block lg:hidden;
	}

	/* Hide the slot fragment on small screens */
	.hidden-on-mobile {
		@apply hidden lg:block;
	}
</style>
