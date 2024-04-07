<script lang="ts">
	import { A, Heading, Li, List, P } from 'flowbite-svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { t } from '$lib/translations';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils/formatDate';
	import { TableWrap } from '$lib/components';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Websites'
		});
	}

	export let data: PageData;
	const domains = data.domains;

	let searchTerm = '';

	const tableData = {
		tableHead: ['Pic', 'Open', 'Name', 'Languages', 'Last Toot', '# Users', 'Link']
	};
</script>

<div class="pt-0.5">
	<TableWrap>
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Link to Dashboard">
				<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem>{$t('pagelinks.websites')}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class=" mx-auto mb-5 p-5">
				<div class="col-span-2 mb-6">
					<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200"
						>{$t('general.latestTootsFromAllSites')}</Heading
					>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<!-- Search Form -->
					<div class="md:col-span-2 md:col-start-1 order-first mb-6">
						<form class="flex items-left max-w-sm">
							<label for="entity-search" class="sr-only">Search</label>
							<div class="relative w-full">
								<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
									<svg
										class="w-4 h-4 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 18 20"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
										/>
									</svg>
								</div>
								<input
									type="text"
									id="entity-search"
									name="entity-search"
									bind:value={searchTerm}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder={$t('search.websiteName')}
									required
								/>
							</div>
							<button
								on:click={() => goto(`/websites/${searchTerm}`)}
								class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
							</button>
						</form>
					</div>
				</div>
				<div class="hidden-on-mobile">
					<Table
						name="advancedTable"
						classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
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
							{#each domains as item}
								<TableBodyRow
									class=" border-none cursor-pointer"
									on:click={() => goto(`/websites/${item.domain}`)}
								>
									<TableBodyCell
										><img
											class=" w-10 h-auto max-w-xs"
											src={item.instance.contact_account?.avatar_static}
											alt="User"
										/></TableBodyCell
									>
									<TableBodyCell>
										{item.instance?.registrations
											? item.instance.registrations
												? '✅'
												: '❌'
											: '❓'}
									</TableBodyCell>
									<TableBodyCell>
										{item.instance?.uri ? item.instance.uri : '❓'}
									</TableBodyCell>
									<TableBodyCell>
										{item.instance?.languages &&
										Array.isArray(item.instance.languages) &&
										item.instance.languages[0]
											? item.instance.languages[0].slice(0, 4)
											: '❓'}
									</TableBodyCell>
									<TableBodyCell>
										{item.lastSeen
											? formatDate({
													seconds: item.lastSeen.seconds,
													nanoseconds: item.lastSeen.nanoseconds
												})
											: 'N/A'}
									</TableBodyCell>
									<TableBodyCell class="text-right">
										{item.instance?.stats?.user_count
											? item.instance.stats.user_count.toLocaleString()
											: '❓'}
									</TableBodyCell>

									<TableBodyCell>
										<A
											rel="noopener nofollow"
											href="https://{item.domain}"
											target="_blank"
											class="font-medium hover:underline"
											><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" /></A
										></TableBodyCell
									>
								</TableBodyRow>
								<TableBodyRow
									class=" cursor-pointer"
									on:click={() => goto(`/websites/${item.domain}`)}
								>
									<TableBodyCell></TableBodyCell>
									<TableBodyCell colspan="6">
										{item.instance?.short_description
											? item.instance.short_description.substring(0, 115 - 3) + '...'
											: ''}
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
				</div>

				<!-- Mobile view -->
				<div class="show-on-mobile">
					{#each domains as item}
						{@const url = `/websites/${item.domain}`}
						<a href={url}>
							<TableWrap>
								<div class="w-full md:w-3/12 md:mx-2">
									<!-- Profile Card -->
									<div class="bg-grey-900 p-3 border-t-4 border-green-400">
										<div class="image overflow-hidden">
											<img class="h-auto w-full mx-auto" src={item.instance.thumbnail} alt="" />
										</div>
										<span class="ml-auto"
											><span
												class="{item.locked
													? 'bg-red-500'
													: 'bg-green-500'} py-1 px-2 rounded text-white text-sm"
												>{item.instance.approval_required ? 'Needs Approval' : 'Open'}</span
											></span
										>
										<span class=" ml-3 text-gray-200 font-bold text-xl leading-8 my-1"
											><A
												rel="noopener nofollow"
												href={`https://${item.domain}`}
												target="_blank"
												class="font-medium hover:underline">{item.domain}</A
											></span
										>
										<P>{item.instance.short_description}</P>
										<List list="none">
											<Li class="ml-auto text-gray-300 my-1"
												># Toots: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
													>{item.instance.stats?.status_count.toLocaleString()}</span
												></Li
											>
											<Li class="ml-auto text-gray-300 my-1"
												># Users: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
													>{item.instance.stats?.user_count.toLocaleString()}</span
												></Li
											>
										</List>
									</div>
								</div>
							</TableWrap></a
						>
					{/each}
				</div>
			</div>
		</div></TableWrap
	>
</div>

<style>
	/* Other styles for your component */

	/* Show the slot content only on small screens */
	.show-on-mobile {
		@apply block lg:hidden;
	}

	/* Hide the slot fragment on small screens */
	.hidden-on-mobile {
		@apply hidden lg:block;
	}
</style>
