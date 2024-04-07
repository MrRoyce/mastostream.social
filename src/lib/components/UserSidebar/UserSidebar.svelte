<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/translations';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Tooltip } from 'flowbite-svelte';
	import { SideWrap } from '$lib/components';
	import { getSidebarItems } from '$lib/utils';
	$: activeUrl = $page.url.pathname;

	let activeClass =
		'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-gray-900  dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
	let nonActiveClass =
		'flex items-center p-2 text-base font-normal text-green-900  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700';

	export let image: String;
	export let email: String;

	const pageSidebarItems = getSidebarItems({ group: 'app', page: 'home' });

	const mb = 'mb-4';

	$: image;
	$: email;
</script>

<SideWrap {mb}>
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<Sidebar {activeUrl} {activeClass} {nonActiveClass} asideClass="w-80 ">
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
				{#if pageSidebarItems}
					{#each pageSidebarItems.groups as group}
						<SidebarGroup class="pb-6">
							{$t(group.name)}
							{#each group.items as item}
								<SidebarItem label={$t(item.label)} href={item.href}>
									<svelte:fragment slot="icon">
										<i class={item.icon} />
									</svelte:fragment>
								</SidebarItem>
							{/each}
						</SidebarGroup>
					{/each}
				{/if}
			</SidebarWrapper>
		</Sidebar>
	</div>
</SideWrap>
