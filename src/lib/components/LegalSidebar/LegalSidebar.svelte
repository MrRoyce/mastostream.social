<script lang="ts">
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { SideWrap } from '$lib/components';
	import { getSidebarItems } from '$lib/utils';

	export let pathname;

	const pageSidebarItems = getSidebarItems({ group: 'legal', page: pathname });

	const mb = 'mb-4';

	$: activeUrl = $page.url.pathname;
</script>

<SideWrap {mb}>
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<Sidebar {activeUrl} asideClass="w-80">
			<SidebarWrapper>
				{#if pageSidebarItems}
					{#each pageSidebarItems.groups as group}
						<!-- content here -->
						<SidebarGroup class="pb-6">
							{group.name}
							{#each group.items as item}
								<SidebarItem label={item.label} href={item.href} active={activeUrl === item.url}
								></SidebarItem>
							{/each}
						</SidebarGroup>
					{/each}
				{/if}
			</SidebarWrapper>
		</Sidebar>
	</div>
</SideWrap>
