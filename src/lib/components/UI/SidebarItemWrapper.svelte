<script lang="ts">
	import { SidebarGroup, SidebarItem } from 'flowbite-svelte';
	import { t } from '$lib/translations';

	export let group: SideBarItemGroup;
	export let closeDrawer = () => {};
</script>

<SidebarGroup class="pb-6">
	{$t(group.name)}
	{#each group.items as item}
		<SidebarItem on:click={() => closeDrawer()} label={$t(item.label)} href={item.href}>
			<svelte:fragment slot="icon">
				<i class={item.icon} />
			</svelte:fragment>
		</SidebarItem>
	{/each}
</SidebarGroup>
