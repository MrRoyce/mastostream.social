<script lang="ts">
	import { browser } from '$app/environment';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import { Section } from 'flowbite-svelte-blocks';
	import TootTable from '$lib/components/UI/TootTable.svelte';
	import { A, Li, List } from 'flowbite-svelte';
	import { formatText } from '$lib/utils/formatText';

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;

	let domain: string;

	try {
		domain = entity.domain;
	} catch (error) {
		if (browser) {
			goto('/websites/notfound');
		}
	}

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Safe', 'Created At', 'Account', 'Content', 'Link']
	};
</script>

<Section class="bg-white dark:bg-gray-700">
	<div class="dark:bg-gray-800">
		<div class="container mx-auto my-5 p-5">
			<div class="md:flex no-wrap md:-mx-2">
				<!-- Left Side -->
				<div class="w-full md:w-3/12 md:mx-2">
					<!-- Profile Card -->
					<div class="bg-grey-900 p-3 border-t-4 border-green-400">
						<div class="image overflow-hidden">
							<img class="h-auto w-full mx-auto" src={entity.instance?.thumbnail} alt="" />
						</div>
						<span class="ml-auto"
							><span
								class="{entity.locked
									? 'bg-red-500'
									: 'bg-green-500'} py-1 px-2 rounded text-white text-sm"
								>{entity.approval_required ? 'Needs Approval' : 'Open'}</span
							></span
						>
						<span class=" ml-3 text-gray-200 font-bold text-xl leading-8 my-1">{entity.domain}</span
						>
						<h3 class="text-white font-lg text-semibold leading-6 pt-5">
							<a target="_blank" href={entity.url} class="inline-flex items-center hover:underline">
								<A href={`https://${domain}`} target="_blank" class="font-medium hover:underline"
									>{domain}</A
								>
								<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
							</a>
						</h3>
						<List list="none">
							<Li class="ml-auto text-gray-300 my-1"
								># Toots: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.instance?.stats?.status_count}</span
								></Li
							>
							<Li class="ml-auto text-gray-300 my-1"
								># Users: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.instance?.stats?.user_count}</span
								></Li
							>
						</List>
					</div>
				</div>
				<!-- Right Side -->
				<div class="w-full md:w-9/12 mx-2">
					<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
						<h3 class="mt-5">
							<span class="pt-10 ml-auto text-gray-200 my-1">Email: {entity.instance?.email}</span>
						</h3>
						<div class="mt-7 text-gray-200">
							<p>
								{@html formatText(entity.instance?.short_description, 'underline text-green-200')}
							</p>
						</div>
						{#if entity.instance?.rules.length > 0}
							<h2 class="mt-7 text-white">Rules:</h2>
						{/if}
						<List list="none">
							{#each entity.instance?.rules as rule}
								<Li class=" pl-4 mb-4">
									<span class="text-gray-200 mr-3"
										>{@html formatText(
											rule.text.replaceAll('class="invisible"', ''),
											'underline text-green-200'
										)}</span
									></Li
								>
							{/each}
						</List>
					</div>
				</div>
			</div>
			<div class="my-4 text-white">
				<h2 class="text-gray-200 font-bold text-xl leading-8 my-1">
					Recent toots from {entity.domain}
				</h2>

				<TootTable
					{tableData}
					sourceData={toots}
					getData={() => {}}
					entity={`Toots from ${entity.domain}`}
				/>
			</div>
		</div>
	</div>
</Section>

<!-- component -->
<style>
	:root {
		--main-color: #4a76a8;
	}

	.bg-main-color {
		background-color: var(--main-color);
	}

	.text-main-color {
		color: var(--main-color);
	}

	.border-main-color {
		border-color: var(--main-color);
	}
</style>