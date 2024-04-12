<script lang="ts">
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
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils/formatDate';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { browser, dev } from '$app/environment';
	import TootsRadio from '$lib/components/UI/TootsRadio.svelte';
	import { t } from '$lib/translations';
	import type { PageData } from './$types';
	import { TableWrap } from '$lib/components';
	import { formatText, truncateHTML } from '$lib/utils';

	export let data: PageData;
	const { tootTypePassed, accounts } = data;
	if (browser && dev) console.log('data in accounts', data);

	let searchTerm = '';

	function searchData() {
		if (searchTerm) {
			goto(`/accounts/${searchTerm.startsWith('@') ? searchTerm.slice(1) : searchTerm}`);
		}
	}

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

	if (browser) {
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

<TableWrap>
	<div class="pl-0 pt-0 pb-4">
		<Breadcrumb aria-label={$t('aria.breadcrumbLink')}>
			<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
			<BreadcrumbItem>{$t('pagelinks.accounts')}</BreadcrumbItem>
		</Breadcrumb>
	</div>
	<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<div class=" mx-auto mb-5 p-4">
			<div class="col-span-2 mb-6">
				<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200"
					>{$t('general.latestAccountToots')}</Heading
				>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- Search Form -->
				<div class="md:col-span-2 md:col-start-1 order-first mb-6">
					<form class="flex items-left max-w-sm">
						<label for="entity-search" class="sr-only">Search</label>
						<div class="relative w-full">
							<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
								<i class="fa-solid fa-magnifying-glass" />
							</div>
							<input
								type="text"
								id="entity-search"
								name="entity-search"
								maxlength="30"
								bind:value={searchTerm}
								class="bg-gray-50 border border-gray-300 dark:text-gray-200 text-sm focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500 dark:focus:border-green-500"
								placeholder={$t('search.accountName')}
								required
							/>
						</div>
						<Button
							color="green"
							on:click={searchData}
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
				<div class="md:col-span-2 md:col-start-3 order-last">
					<TootsRadio bind:tootType {getTootType} />
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
						{#each accounts as item}
							<TableBodyRow
								class="border-none cursor-pointer"
								on:click={() => goto(`/accounts/${item.acct}`)}
							>
								<TableBodyCell
									><img class=" w-10 h-auto max-w-xs" src={item.avatar} alt="User" /></TableBodyCell
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

			<!-- Mobile view -->
			<div class="show-on-mobile">
				{#each accounts as item}
					{@const truncatedText = truncateHTML(item.note, 150)}
					{@const url = `/accounts/${item.acct}`}
					<a href={url}>
						<TableWrap spacing="px-0">
							<!-- Profile Card -->
							<div class="bg-grey-900 mb-4 border-t-4 border-green-400"></div>
							<div class="pb-4">
								<a
									href={url}
									class="flex flex-col items-center bg-white border border-gray-200 shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
								>
									<img
										class="object-cover w-full h-96 md:h-auto md:w-48 rounded-none"
										src={item.avatar}
										alt=""
									/>
									<div class="flex flex-col justify-between p-4 leading-normal">
										<p class="pb-2 sm:max-w-xs md:max-w-md dark:text-gray-200">
											{item.acct}
										</p>
										<div class="overflow-hidden">
											<p class=" mb-2 font-normal text-gray-700 dark:text-gray-400">
												{@html formatText(truncatedText, 'underline text-green-200')}
											</p>
										</div>
									</div>
								</a>
							</div>
						</TableWrap>
					</a>
				{/each}
			</div>
		</div>
	</div>
</TableWrap>
