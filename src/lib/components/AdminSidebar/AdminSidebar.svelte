<script lang="ts">
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Tooltip } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';

	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	$: activeUrl = $page.url.pathname;

	export let image: String;
	export let email: String;
</script>

<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 m-4 h-fit">
	<Sidebar {activeUrl}>
		<SidebarWrapper>
			<SidebarGroup class="pb-6">
				<SidebarItem label="Administrator" href="/account">
					<svelte:fragment slot="icon">
						<img id="users-picture" height="48" src={image} alt="User" />
						<Tooltip triggeredBy="[id^='users-picture']">{email}</Tooltip>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
			<SidebarGroup>
				<SidebarItem
					label="Accounts"
					href="/admin/accounts"
					active={activeUrl === '/admin/accounts'}
				>
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
