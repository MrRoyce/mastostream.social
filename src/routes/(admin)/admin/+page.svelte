<script lang="ts">
	import { browser } from '$app/environment';
	import { Section } from 'flowbite-svelte-blocks';
	import type { PageData } from './$types';
	import { Admin } from '$lib/components';
	import { goto } from '$app/navigation';

	export let data: PageData;
	// if (browser) console.log('data', JSON.stringify(data, null, 2));

	let redis = { ...data.adminData.redis };
	let database = { ...data.adminData.database };

	console.log('redis', JSON.stringify(redis, null, 2));
	console.log('database', JSON.stringify(database, null, 2));

	const user = data.adminUser;
	let admin = false;
	admin = user?.admin || false;

	$: admin;
</script>

<div>
	{#if browser}
		{#if admin}
			<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 m-4 h-fit">
				<Admin accounts={database.latestCounts.accounts} />
			</Section>
		{:else}
			{goto('/')}
		{/if}
	{/if}
</div>
