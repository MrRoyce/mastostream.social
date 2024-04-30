<script lang="ts">
	import { TableWrap } from '$lib/components';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import type { PageData } from './$types';
	import { t } from '$lib/translations';
	import { goto } from '$app/navigation';
	import { browser, dev } from '$app/environment';

	export let data: PageData;
	const { entity, groups } = data;

	if (browser && dev) console.log('groups in allgroups', groups);

	let searchTerm = '';

	const tableData = {
		tableHead: ['Group Name', 'NSFW', 'Description']
	};

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'AllGroups'
		});
	}

	function searchText() {
		if (searchTerm) {
			goto(`/allgroups/${searchTerm}`);
		}
	}
</script>

<TableWrap divContainerPadding="px-4">
	<!-- Breadcrumb -->
	<div class="pl-0 pt-0 pb-4">
		<Breadcrumb aria-label="Link to Dashboard">
			<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
			<BreadcrumbItem>{$t('pagelinks.search')}</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<!-- Search wrapper -->
	<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<div class=" mx-auto pt-4 px-4">
			<div class="col-span-2 mb-4">
				<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200"
					>Search Group Description</Heading
				>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- search form -->
				<div class="md:col-span-2 md:col-start-1 order-first md:mb-4">
					<form class="flex items-left">
						<label for="entity-search" class="sr-only">Search</label>
						<div class="relative w-full">
							<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
								<i class="fa-solid fa-magnifying-glass" />
							</div>
							<input
								type="text"
								id="entity-search"
								maxlength="50"
								name="entity-search"
								bind:value={searchTerm}
								class="bg-gray-50 border border-gray-300 dark:text-gray-200 text-sm focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500 dark:focus:border-green-500"
								placeholder={$t('search.anyTerm')}
								required
							/>
						</div>
						<Button
							color="green"
							on:click={searchText}
							class="rounded-none py-2.5 px-3.5  ms-2 text-sm font-medium dark:text-gray-200"
						>
							<svg
								class="w-4 h-4"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 20"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
								/>
							</svg>
							<span class="sr-only">Search</span>
						</Button>
					</form>
				</div>
			</div>
			<div class="hidden-on-mobile">
				<Table
					name="advancedTable"
					classSection="bg-gray-50 dark:bg-gray-900 sm:p-5"
					hoverable={true}
				>
					<TableHead>
						{#each tableData.tableHead as tableHead}
							<TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
								>{tableHead}</TableHeadCell
							>
						{/each}
					</TableHead>
					<TableBody>
						{#each groups as group}
							<TableBodyRow
								class="border-none cursor-pointer"
								on:click={() => goto(`/allgroups/${group.name}`)}
							>
								<TableBodyCell>
									{group.name}
								</TableBodyCell>
								<TableBodyCell>
									{group.mature}
								</TableBodyCell>
								<TableBodyCell>
									{group.description}
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
			<div class="show-on-mobile">
				{#each groups as item}{/each}
			</div>
		</div>
	</div>
</TableWrap>
