<script lang="ts">
	import '../../app.pcss';
	import { t } from '$lib/translations';

	import type { AfterNavigate } from '@sveltejs/kit';
	import { afterNavigate, goto } from '$app/navigation';
	import { navigating } from '$app/stores';

	import { Footer, Loading, UserSidebar } from '$lib/components';
	import { loading } from '$lib/stores';
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
	import {
		ArrowRightToBracketSolid,
		BugSolid,
		ChartSolid,
		GridSolid,
		MailBoxSolid,
		UsersSolid
	} from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';
	import type { LayoutData } from './$types';
	import { handleLogout } from '$lib/firebase/handleLogout';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/client';
	import { authUser } from '$lib/stores';
	import { Languages, UserIcon } from '$lib/components';
	import { locale } from '$lib/translations';
	import { getLanguageList } from '$lib/utils/getLanguage';
	import logo from '$lib/assets/logo.svg';

	export let data: LayoutData;
	const userImage = data.user?.picture ? data.user?.picture : UserIcon;

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

	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let defaultLanguage: string = 'en';

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

	$: $loading = !!$navigating;
	$: user = data.user;
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
			<SidebarGroup>
				<!-- Dashboard -->
				<SidebarItem
					on:click={() => (hideDrawer = true)}
					label={$t('pagelinks.dashboard')}
					href="/"
				>
					<svelte:fragment slot="icon">
						<ChartSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>

				<!-- Toots -->
				<SidebarItem
					on:click={() => (hideDrawer = true)}
					label={$t('pagelinks.toots')}
					href="/toots"
					{spanClass}
				>
					<svelte:fragment slot="icon">
						<MailBoxSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>

				<!-- Accounts -->
				<SidebarItem
					on:click={() => (hideDrawer = true)}
					label={$t('pagelinks.accounts')}
					href="/accounts"
					{spanClass}
				>
					<svelte:fragment slot="icon">
						<GridSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"
						>
							Nice!
						</span>
					</svelte:fragment>
				</SidebarItem>

				<!-- Web Sites -->
				<SidebarItem
					on:click={() => (hideDrawer = true)}
					label={$t('pagelinks.websites')}
					href="/websites"
				>
					<svelte:fragment slot="icon">
						<UsersSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>

				<!-- Tags -->
				<SidebarItem on:click={() => (hideDrawer = true)} label={$t('pagelinks.tags')} href="/tags">
					<svelte:fragment slot="icon">
						<BugSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>

				<!-- Languages -->
				<SidebarItem
					on:click={() => (hideDrawer = true)}
					label={$t('pagelinks.languages')}
					href="/languages"
				>
					<svelte:fragment slot="icon">
						<ArrowRightToBracketSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>

				<!-- Full Text Searcb -->
				<SidebarItem
					on:click={() => (hideDrawer = true)}
					label={$t('pagelinks.fullTextSearch')}
					href="/search"
				>
					<svelte:fragment slot="icon">
						<ChartSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>

{#if $loading}
	<Loading />
{:else}
	<AppShell>
		<svelte:fragment slot="sidebarLeft">
			<div class="hidden-on-mobile">
				<UserSidebar image={userImage} email={data.user?.email || ''} />
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
					<div class="flex items-center show-on-mobile dark:text-white">
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
					{#if user}
						<button on:click={handleLogout} type="button" class="btn variant-filled"
							>Sign Out</button
						>
					{:else}
						<button on:click={() => goto('/login')} type="button" class="btn variant-filled"
							>Sign In</button
						>
					{/if}
					<button on:click={handleLocaleChange}><Languages /></button>
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
