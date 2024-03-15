<script lang="ts">
	import '@fontsource/dosis';
	import { t } from '$lib/translations';
	import { page } from '$app/stores';
	import { AppBar, AppShell, initializeStores } from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { afterNavigate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { locale } from '$lib/translations';
	import { Footer, Loading } from '$lib/components';
	import { loading, showSensitiveStore } from '$lib/stores';
	import { getLanguageList } from '$lib/utils/getLanguage';
	import {
		A,
		Button,
		CloseButton,
		Drawer,
		Dropdown,
		DropdownItem,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Toggle
	} from 'flowbite-svelte';
	import {
		ArrowRightToBracketSolid,
		BugSolid,
		ChartSolid,
		ChevronDownSolid,
		GridSolid,
		MailBoxSolid,
		UsersSolid
	} from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';
	import Languages from '$lib/components/Languages/Languages.svelte';

	initializeStores();

	let hideDrawer = true;
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let showSensitive: boolean = false;

	const hideSensitive = () => {
		showSensitiveStore.update(() => {
			showSensitive = !showSensitive;
			return showSensitive;
		});
	};

	afterNavigate((params: AfterNavigate) => {
		const isNewPage = params.from?.url?.pathname !== params.to?.url?.pathname;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	let value: string = 'en';

	function getTargetLanguage(languageText: string) {
		const languages = getLanguageList();
		const result = languages.filter((language) => language.text === languageText);
		return result[0]?.value || 'en';
	}

	function handleLocaleChange(event: Event) {
		event.preventDefault();
		value = getTargetLanguage(event?.target?.innerHTML || 'English');
		$locale = value;
	}

	const siteDropdown = {
		'/': 'Dashboard',
		'/accounts': 'Accounts',
		'/toots': 'Toots',
		'/websites': 'Web Sites',
		'/tags': 'Tags',
		'/languages': 'Languages',
		'/search': 'Full Text Search'
	};

	const stringsToCheck = ['toots', 'accounts', 'websites', 'tags', 'languages', 'search'];

	$: getDropdownLabel = (activeUrl) => {
		let response = siteDropdown[activeUrl];
		if (!response) {
			response = stringsToCheck.filter((str) => activeUrl.includes(str));
			response = response ? siteDropdown[`/${response}`] : 'Dashboard';
		}
		return response;
	};

	$: activeUrl = $page.url.pathname;

	$: $loading = !!$navigating;
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
				<SidebarItem on:click={() => (hideDrawer = true)} label={$t('pagelinks.tags')} href="/tags">
					<svelte:fragment slot="icon">
						<BugSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
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
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Drawer>

<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-56" class="dark:text-white">
	<svelte:fragment slot="header">
		<AppBar>
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

			<svelte:fragment slot="trail">
				<div>
					<Toggle
						color="red"
						checked={false}
						value="false"
						on:click={() => {
							{
								hideSensitive();
							}
						}}>{$t('pagelinks.showSensitive')}</Toggle
					>
				</div>
				<div class="hidden-on-mobile">
					{@debug activeUrl}
					<Button outline color="green"
						>{getDropdownLabel(activeUrl)}...
						<ChevronDownSolid class="w-3 h-3 ms-2 text-white dark:text-white" />
					</Button>
					<Dropdown {activeUrl}>
						<DropdownItem href="/">{$t('pagelinks.dashboard')}</DropdownItem>
						<DropdownItem href="/accounts">{$t('pagelinks.accounts')}</DropdownItem>
						<DropdownItem href="/toots">{$t('pagelinks.toots')}</DropdownItem>
						<DropdownItem href="/websites">{$t('pagelinks.websites')}</DropdownItem>
						<DropdownItem href="/tags">{$t('pagelinks.tags')}</DropdownItem>
						<DropdownItem href="/languages">{$t('pagelinks.languages')}</DropdownItem>
						<DropdownItem href="/search">{$t('pagelinks.search')}</DropdownItem>
					</Dropdown>
				</div>
				<button on:click={handleLocaleChange}><Languages /></button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Router Slot -->

	<main class="container mx-auto">
		<div class="flex-initial">
			{#if $loading}
				<Loading />
			{:else}
				<slot />
			{/if}
		</div>
	</main>

	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
	<svelte:fragment slot="footer"></svelte:fragment>
</AppShell>

<style>
	/* Other styles for your component */

	/* Show the slot content only on small screens */
	.show-on-mobile {
		@apply block sm:hidden;
	}

	/* Hide the slot fragment on small screens */
	.hidden-on-mobile {
		@apply hidden sm:block;
	}
</style>
