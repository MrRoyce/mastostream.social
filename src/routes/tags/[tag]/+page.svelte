<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import type { PageData } from '../$types';
	import TootTable from '$lib/components/UI/TootTable.svelte';

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;
	const id = data.id;

	if (!entity.name && browser) {
		goto('/tags/notfound');
	}

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Links to Dashboard and Tags">
		<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
		<BreadcrumbItem href="/tags">Tags</BreadcrumbItem>
		<BreadcrumbItem>{id}</BreadcrumbItem>
	</Breadcrumb>
</div>
<div class="dark:bg-gray-800">
	<div class="container mx-auto my-5 p-5">
		<div class="md:flex no-wrap md:-mx-2">
			<!-- Left Side -->
			<div class="w-full md:w-3/12 md:mx-2">
				<!-- Profile Card -->
				<h1>{entity.name}</h1>
			</div>
			<!-- Right Side -->
			<div class="w-full md:w-9/12 mx-2">
				<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
					<div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8"></div>
					<h3 class="mt-5">
						<span class="pt-10 ml-auto text-gray-200 my-1">@{entity.name}</span>
					</h3>
				</div>
			</div>
		</div>
		<div class="my-4 text-white">
			<h2 class="text-gray-200 font-bold text-xl leading-8 my-1">
				Latest toots tagged #{entity.name}:
			</h2>

			<TootTable
				{tableData}
				sourceData={toots}
				getData={() => {}}
				entity={`Toots from ${entity.username}`}
			/>
		</div>
	</div>
</div>
