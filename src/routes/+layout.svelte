<script lang="ts">
	import '@fontsource/dosis';
	import { t } from '$lib/translations';
	import '../app.pcss';
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { afterNavigate } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { locale } from '$lib/translations';
	import Footer from '$lib/components/Footers/Footer.svelte';
	import Loading from './../lib/components/Loading/Loading.svelte';
	import showSensitiveStore from '$lib/stores/SensitiveStore';
	import { loading } from '$lib/stores/Loading';
	import {
		A,
		Button,
		CloseButton,
		Drawer,
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
		GridSolid,
		MailBoxSolid,
		UsersSolid
	} from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';
	import Languages from '$lib/components/Languages/Languages.svelte';
	let hidden2 = true;
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
		const languages = [
			{ value: 'de', text: 'Deutsch' },
			{ value: 'en', text: 'English' },
			{ value: 'es', text: 'Español' },
			{ value: 'fr', text: 'Français' },
			{ value: 'hi', text: 'हिंदी' },
			{ value: 'ja', text: '日本語' },
			{ value: 'pt', text: 'Português' },
			{ value: 'sv', text: 'Svenska' },
			{ value: 'tl', text: 'Filipino' },
			{ value: 'zu', text: 'Zulu' }
		];

		const result = languages.filter((language) => language.text === languageText);

		return result[0]?.value || 'en';
	}

	function handleLocaleChange(event: Event) {
		event.preventDefault();
		value = getTargetLanguage(event?.target?.innerHTML || 'English');
		$locale = value;
	}

	$: $loading = !!$navigating;
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={hidden2} id="sidebar2">
	<div class="flex items-center dark:text-white">
		<h5
			id="drawer-navigation-label-3"
			class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
		>
			Menu
		</h5>
		<CloseButton on:click={() => (hidden2 = true)} class="mb-4" />
	</div>
	<Sidebar class="dark:text-white">
		<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
			<SidebarGroup>
				<SidebarItem on:click={() => (hidden2 = true)} label="Dashboard" href="/">
					<svelte:fragment slot="icon">
						<ChartSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem on:click={() => (hidden2 = true)} label="Full Text Search" href="/search">
					<svelte:fragment slot="icon">
						<ChartSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					on:click={() => (hidden2 = true)}
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
				<SidebarItem on:click={() => (hidden2 = true)} label="Toots" href="/toots" {spanClass}>
					<svelte:fragment slot="icon">
						<MailBoxSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem on:click={() => (hidden2 = true)} label="Web Sites" href="/websites">
					<svelte:fragment slot="icon">
						<UsersSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem on:click={() => (hidden2 = true)} label="Tags" href="/tags">
					<svelte:fragment slot="icon">
						<BugSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem on:click={() => (hidden2 = true)} label="Languages" href="/languages">
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
					<Button class="mr-4 lg:hidden" on:click={() => (hidden2 = false)}>
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
						checked={false}
						value="false"
						on:click={() => {
							{
								hideSensitive();
							}
						}}>Show Sensitive</Toggle
					>
				</div>
				<div class="hidden-on-mobile">
					<span class="">
						<a class="btn btn-sm" href="/">{$t('pagelinks.dashboard')}</a>
						<a class="btn btn-sm" href="/accounts">{$t('pagelinks.accounts')}</a>
						<a class="btn btn-sm" href="/toots">Toots</a>
						<a class="btn btn-sm" href="/websites">Web Sites</a>
						<a class="btn btn-sm" href="/tags">Tags</a>
						<a class="btn btn-sm" href="/languages">Languages</a>
						<a class="btn btn-sm" href="/search">Search</a>
					</span>
				</div>
				<button on:click={handleLocaleChange}><Languages /></button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Router Slot -->

	<main class="container mx-auto">
		{#if $loading}
			<Loading />
		{:else}
			<slot />
		{/if}
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
