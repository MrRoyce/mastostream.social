<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/translations';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Tooltip } from 'flowbite-svelte';
	import { SideWrap } from '$lib/components';
	import { getSidebarItems } from '$lib/utils';
	$: activeUrl = $page.url.pathname;

	export let image: String;
	export let email: String;

	const pageSidebarItems = getSidebarItems({ group: 'app', page: 'home' });

	const mb = 'mb-4';

	$: image;
	$: email;
</script>

<SideWrap {mb}>
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<Sidebar {activeUrl} asideClass="w-80 ">
			<SidebarWrapper>
				<SidebarGroup class="pb-6">
					<div class="flex items-center justify-center">
						<SidebarItem>
							<svelte:fragment slot="icon">
								{#if image && typeof image === 'string'}
									<img id="users-picture" height="48" src={image} alt="User" />
								{:else if email}
									<i class={'fas fa-user-secret fa-5x'}></i>
								{/if}

								<Tooltip triggeredBy="[id^='users-picture']">{email}</Tooltip>
							</svelte:fragment>
						</SidebarItem>
					</div>
				</SidebarGroup>

				<SidebarGroup class="pb-6">
					{$t('pagelinks.dashboard')}
					<SidebarItem label={$t('pagelinks.toots')} href="/toots">
						<svelte:fragment slot="icon">
							<i class="fa-solid fa-bullhorn" />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label={$t('pagelinks.accounts')} href="/accounts">
						<svelte:fragment slot="icon">
							<i class="fa-sharp fa-solid fa-users" />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label={$t('pagelinks.websites')} href="/websites">
						<svelte:fragment slot="icon">
							<i class="fa-solid fa-network-wired" />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label={$t('pagelinks.tags')} href="/tags">
						<svelte:fragment slot="icon">
							<i class="fa-solid fa-hashtag" />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label={$t('pagelinks.languages')} href="/languages">
						<svelte:fragment slot="icon">
							<i class="fa-solid fa-globe" />
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label={$t('pagelinks.search')} href="/search">
						<svelte:fragment slot="icon">
							<i class="fa-solid fa-magnifying-glass" />
						</svelte:fragment>
					</SidebarItem>
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</div>
</SideWrap>
