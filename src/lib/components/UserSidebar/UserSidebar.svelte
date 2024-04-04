<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/translations';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Tooltip } from 'flowbite-svelte';
	import { SideWrap } from '$lib/components';
	import { getSidebarItems } from '$lib/utils';
	import { ArrowRightOutline, ChartSolid } from 'flowbite-svelte-icons';
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
				{#if pageSidebarItems}
					{#each pageSidebarItems.groups as group}
						<SidebarGroup class="pb-6">
							{group.name}
							{#each group.items as item}
								<SidebarItem label={item.label} href={item.href}>
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
