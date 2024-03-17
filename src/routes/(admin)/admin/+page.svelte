<script lang="ts">
	import { browser } from '$app/environment';
	import { isUserAdmin } from '$lib/firebase/isUserAdmin';
	import { Section } from 'flowbite-svelte-blocks';
	import type { PageData } from '../$types';
	import { Heading } from 'flowbite-svelte';

	export let data: PageData;

	const user = data.user;
	let admin = false;

	const email = user?.email || 'notfound@none.com';

	admin = isUserAdmin(email);

	$: admin;
</script>

<div>
	{#if browser}
		{#if admin}
			<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 m-4 h-fit">
				<Heading>Admin Page</Heading>
			</Section>
		{/if}
	{/if}
</div>
