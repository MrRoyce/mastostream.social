<script lang="ts">
	import '../../app.pcss';
	import { t } from '$lib/translations';
	import { getLanguageList, getLanguageString, getSidebarItems } from '$lib/utils';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { afterNavigate, goto } from '$app/navigation';
	import { navigating } from '$app/stores';

	import {
		Footer,
		Languages,
		Loading,
		SidebarItemWrapper,
		UserIcon,
		UserSidebar
	} from '$lib/components';
	import { authUser, loading } from '$lib/stores';
	import { A, Button, CloseButton, Drawer, Sidebar, SidebarWrapper } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import type { LayoutData } from './$types';
	import { handleLogout } from '$lib/firebase/handleLogout';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/client';
	import { locale } from '$lib/translations';

	export let data: LayoutData;
	const userImage = data.user?.picture ? data.user?.picture : UserIcon;

	const languages = getLanguageList();
	const languageStrings = getLanguageString();

	const pageSidebarItems = getSidebarItems({ group: 'app', page: 'home' });
	const pageSettingsItems = getSidebarItems({ group: 'app', page: 'settings' });

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

	afterNavigate((params: AfterNavigate) => {
		if (browser) {
			const isNewPage = params.from?.url?.pathname !== params.to?.url?.pathname;

			const elemPage = document.querySelector('#page');
			if (isNewPage && elemPage !== null) {
				elemPage.scrollTop = 0;
			}
		}
	});

	let hideDrawer = true;

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let defaultLanguage: string = 'en';

	function getTargetLanguage(languageText: string) {
		const result = languages.filter((language) => language.text === languageText);
		return result[0]?.value || 'en';
	}

	function handleLocaleChange(event: Event) {
		event.preventDefault();
		const target = event?.target?.innerHTML;
		if (languageStrings.includes(target)) {
			const language = getTargetLanguage(event?.target?.innerHTML);
			defaultLanguage = language;
			$locale = defaultLanguage;
		}
	}

	function closeDrawer() {
		hideDrawer = true;
	}

	$: $loading = !!$navigating;
	$: user = data.user;
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={hideDrawer} id="sidebar2">
	<div class="flex items-center">
		<h5
			id="drawer-navigation-label-3"
			class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
		>
			{$t('pagelinks.menu')}
		</h5>
		<CloseButton on:click={() => (hideDrawer = true)} class="mb-4" />
	</div>
	<Sidebar class="">
		<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
			{#if pageSidebarItems}
				{#each pageSidebarItems.groups as group}
					<SidebarItemWrapper {group} {closeDrawer} />
				{/each}
			{/if}
			{#if user && user.email}
				{#if pageSettingsItems}
					{#each pageSettingsItems.groups as group}
						<SidebarItemWrapper {group} {closeDrawer} />
					{/each}
				{/if}
			{/if}
		</SidebarWrapper>
	</Sidebar>
</Drawer>

{#if $loading}
	<Loading />
{:else}
	<AppShell>
		<svelte:fragment slot="sidebarLeft">
			<div class="hidden-on-mobile">
				<UserSidebar image={userImage} user={data.user || ''} />
			</div>
		</svelte:fragment>

		<svelte:fragment slot="header">
			<AppBar
				gridColumns="grid-cols-3"
				slotDefault="place-self-center"
				slotTrail="place-content-end"
			>
				<!-- lead left of appbar-->
				<svelte:fragment slot="lead">
					<!-- Mobile Only -->
					<div class="flex items-center show-on-mobile">
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

					<A href="/"
						><strong class="text-xl uppercase dark:text-green-400"> <h1>U Toots</h1></strong></A
					>
				</svelte:fragment>

				<!-- trail - right of appbar -->
				<svelte:fragment slot="trail">
					{#if user && user.email}
						<Button
							color="alternative"
							on:click={handleLogout}
							type="button"
							class="btn variant-filled border-none"
							><span class="text-gray-200">Sign Out</span></Button
						>
					{:else}
						<Button
							color="alternative"
							on:click={() => goto('/login')}
							type="button"
							class="btn variant-filled border-none"
							><span class="text-gray-200">Sign In</span></Button
						>
					{/if}
					<Button
						id="flags-button"
						class="border-none"
						color="alternative"
						on:click={handleLocaleChange}><Languages {handleLocaleChange} /></Button
					>
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>

		<!-- +page.svelte Slot -->
		<slot />

		<svelte:fragment slot="pageFooter">
			<Footer />
		</svelte:fragment>
	</AppShell>
{/if}

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
