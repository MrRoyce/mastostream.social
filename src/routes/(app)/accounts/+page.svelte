<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils/formatDate';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser, dev } from '$app/environment';
	import TootsRadio from '$lib/components/UI/TootsRadio.svelte';
	import { t } from '$lib/translations';
	import type { PageData } from './$types';
	import { TableWrap } from '$lib/components';

	let searchTerm = '';
	export let data: PageData;
	const { tootTypePassed, accounts } = data;
	if (browser && dev) console.log('data in accounts', data);

	const tableData = {
		tableHead: [
			$t('pageHeaders.pic'),
			$t('pageHeaders.type'),
			$t('pageHeaders.account'),
			$t('pageHeaders.followers'),
			$t('pageHeaders.following'),
			$t('pageHeaders.numberToots'),
			$t('pageHeaders.lastPostUTC')
		]
	};

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Accounts'
		});
	}

	$: tootType = tootTypePassed || 'both';
	function getTootType() {
		if (browser) {
			goto(`/accounts?type=${tootType}`);
		}
	}
</script>

<div class="pt-0.5">
	<TableWrap>
		<Breadcrumb aria-label="$t('breadCrumb.BreadcrumbLinks')">
			<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
			<BreadcrumbItem>{$t('pagelinks.accounts')}</BreadcrumbItem>
		</Breadcrumb>

		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class=" mx-auto my-5 p-5">
				<div class="col-span-2 mb-6">
					<Heading>{$t('general.latestAccountToots')}</Heading>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<!-- Search Form -->
					<div class="md:col-span-2 md:col-start-1 order-first">
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
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Enter account name..."
									required
								/>
							</div>
							<button
								on:click={() =>
									goto(
										`/accounts/${searchTerm.startsWith('@') ? searchTerm.slice(1) : searchTerm}`
									)}
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
					<div class="md:col-span-2 md:col-start-3 order-last">
						<TootsRadio bind:tootType {getTootType} />
					</div>
				</div>

				<div class="mt-6">
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
							{#each accounts as item}
								<TableBodyRow
									class="border-none cursor-pointer"
									on:click={() => goto(`/accounts/${item.acct}`)}
								>
									<TableBodyCell
										><img
											class=" w-10 h-auto max-w-xs"
											src={item.avatar}
											alt="User"
										/></TableBodyCell
									>
									<TableBodyCell>
										{item.bot ? '🤖' : '👤'}
									</TableBodyCell>
									<TableBodyCell>
										{item.acct}
									</TableBodyCell>
									<TableBodyCell class="text-right">
										{item.followersCount.toLocaleString()}
									</TableBodyCell>
									<TableBodyCell class="text-right">
										{item.followingCount.toLocaleString()}
									</TableBodyCell>
									<TableBodyCell class="text-right">
										{item.statusesCount.toLocaleString()}
									</TableBodyCell>
									<TableBodyCell>
										{item.timestamp
											? formatDate({
													seconds: item.timestamp.seconds,
													nanoseconds: item.timestamp.nanoseconds
												})
											: 'N/A'}
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	</TableWrap>
</div>
