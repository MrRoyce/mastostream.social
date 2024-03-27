<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/translations';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Tooltip } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';

	import {
		ArrowRightOutline,
		UserSolid,
		ChartSolid,
		MailBoxSolid,
		GridSolid
	} from 'flowbite-svelte-icons';
	$: activeUrl = $page.url.pathname;

	export let image: String;
	export let email: String;
</script>

<Section
	name="tableheader"
	sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 ml-4 mt-4 mb-4 h-fit"
>
	<Sidebar {activeUrl} asideClass="w-80">
		<SidebarWrapper>
			<SidebarGroup class="pb-6">
				<SidebarItem>
					<svelte:fragment slot="icon">
						{#if image && typeof image === 'string'}
							<img id="users-picture" height="48" src={image} alt="User" />
						{:else}
							<i class={'fas fa-user-secret fa-5x'}></i>
						{/if}

						<Tooltip triggeredBy="[id^='users-picture']">{email}</Tooltip>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
			<SidebarGroup>
				<SidebarItem label={$t('pagelinks.dashboard')} href="/" active={activeUrl === '/'}>
					<svelte:fragment slot="icon">
						<ChartSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>

				<SidebarItem label={$t('pagelinks.toots')} href="/toots" active={activeUrl === '/toots'}>
					<svelte:fragment slot="icon">
						<i class="far fa-chart-bar" />
					</svelte:fragment>
				</SidebarItem>

				<SidebarItem
					label={$t('pagelinks.accounts')}
					href="/accounts"
					active={activeUrl === '/accounts'}
				>
					<svelte:fragment slot="icon">
						<i class="fa-sharp fa-solid fa-users" />
					</svelte:fragment>
				</SidebarItem>

				<SidebarItem
					label={$t('pagelinks.websites')}
					href="/websites"
					active={activeUrl === '/websites'}
				>
					<svelte:fragment slot="icon">
						<GridSolid
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>

				<SidebarItem label={$t('pagelinks.tags')} href="/tags" active={activeUrl === '/tags'}>
					<svelte:fragment slot="icon">
						<ArrowRightOutline
							name="computer-speaker-solid"
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>

				<SidebarItem
					label={$t('pagelinks.languages')}
					href="/languages"
					active={activeUrl === '/languages'}
				>
					<svelte:fragment slot="icon">
						<i class="fa-solid fa-globe" />
					</svelte:fragment>
				</SidebarItem>

				<SidebarItem label={$t('pagelinks.search')} href="/search" active={activeUrl === '/search'}>
					<svelte:fragment slot="icon">
						<ArrowRightOutline
							name="computer-speaker-solid"
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Section>
