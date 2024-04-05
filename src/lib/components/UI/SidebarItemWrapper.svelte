<script lang="ts">
	import { SidebarGroup, SidebarItem } from 'flowbite-svelte';

	export let group: SideBarItemGroup;
	export let closeDrawer = () => {};
</script>

<SidebarGroup class="pb-6">
	{group.name}
	{#each group.items as item}
		<SidebarItem on:click={() => closeDrawer()} label={item.label} href={item.href} />
	{/each}
</SidebarGroup>
