<script lang="ts">
	import {
		A,
		Breadcrumb,
		BreadcrumbItem,
		Heading,
		Li,
		List,
		P,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { MobileTootViewWrapper, TableWrap, TootTable } from '$lib/components';
	import { t } from '$lib/translations';
	import { goto } from '$app/navigation';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { formatDate, formatText } from '$lib/utils';

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Search_[type]_[term]'
		});
	}

	export let data: PageData;
	const items = data.items;
	const term = data.term;
	const type = data.type;

	const tableData = {
		toots: {
			tableHead: ['Pic', 'Safe', 'Type', 'Pics', 'Video', 'Audio', 'Language', 'Link']
		},
		instance: {
			tableHead: ['Name', 'Title', 'Link']
		},
		account: {
			tableHead: [$t('pageHeaders.pic'), $t('pageHeaders.type'), $t('pageHeaders.numberToots')]
		}
	};

	let tableDataHeaders;
	if (type === 'account') {
		tableDataHeaders = tableData.account;
	} else if (type === 'instance') {
		tableDataHeaders = tableData.instance;
	} else {
		tableDataHeaders = tableData.toots;
	}

	$: type;
</script>

<TableWrap divContainerPadding="px-4">
	<div class="pl-0 pt-0 pb-4">
		<Breadcrumb aria-label="Breadcrumbs for search term page">
			<BreadcrumbItem href="/">{$t('pagelinks.dashboard')}</BreadcrumbItem>
			<BreadcrumbItem href="/search">{$t('pagelinks.search')}</BreadcrumbItem>
			<BreadcrumbItem>{term}</BreadcrumbItem>
		</Breadcrumb>
	</div>
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class=" mx-auto mb-5 p5">
			<div class="col-span-2 mb-6">
				<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200">
					{#if type === 'account'}
						Accounts with the term "{term}"
					{:else if type === 'instance'}
						Sites with the term "{term}"
					{:else}
						{$t('general.latestTootsInTerm')} "{term}"
					{/if}
				</Heading>
			</div>
			<div class="hidden-on-mobile">
				<div class="my-4 text-grey-200">
					<!-- Account -->
					{#if type === 'account'}
						<TableHead>
							{#each tableDataHeaders.tableHead as tableHead}
								<TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
									>{tableHead}</TableHeadCell
								>
							{/each}
						</TableHead>
						<TableBody>
							{#each items as item}
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
								</TableBodyRow>
								<TableBodyRow
									class="border-none cursor-pointer"
									on:click={() => goto(`/accounts/${item.acct}`)}
									><TableBodyCell colspan="3" class="overflow-y-scroll">
										{@html item.note ? item.note.substring(0, 130 - 3) + '...' : ''}
									</TableBodyCell></TableBodyRow
								>
							{/each}
						</TableBody>

						<!-- Instance/Website -->
					{:else if type === 'instance'}
						<TableHead>
							{#each tableDataHeaders.tableHead as tableHead}
								<TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
									>{tableHead}</TableHeadCell
								>
							{/each}
						</TableHead>
						<TableBody>
							{#each items as item}
								{@const url = `/websites/${item.domain}`}

								<TableBodyRow
									class=" border-none cursor-pointer"
									on:click={() => goto(`/websites/${item.domain}`)}
								>
									<TableBodyCell>
										{item.domain ? item.domain : ''}
									</TableBodyCell>

									<TableBodyCell>
										{item.title ? item.title : ''}
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
									<TableBodyCell colspan="6">
										<span class="text-base text-gray-200">
											{item.short_description
												? item.short_description.substring(0, 115 - 3) + '...'
												: ''}</span
										>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>

						<!-- Toots -->
					{:else}
						<TootTable tableData={tableDataHeaders} sourceData={items} />
					{/if}
				</div>
			</div>
			<!-- Mobile view -->
			<div class="show-on-mobile">
				{#each items as item}
					<TableWrap spacing="px-0">
						<!-- Account -->
						{#if type === 'account'}
							<!-- Top green border -->
							<div class="bg-grey-900 mb-4 border-t-4 border-green-400"></div>

							<div class="mx-auto my-2 p-2">
								<a
									href={`/websites/${item.domain}`}
									class="flex flex-col px-0 items-center md:flex-row"
								>
									<img
										class="object-cover w-full h-96 md:h-auto md:w-48 rounded-none"
										src={item.avatar}
										alt=""
									/>
									<div class=" py-4">
										<!-- Account name -->
										<p class="pb-2 sm:max-w-xs md:max-w-md dark:text-gray-200">
											{item.acct}
										</p>

										<!-- account note -->
										<p
											class=" max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto font-normal text-gray-700 dark:text-gray-400"
										>
											{@html formatText(
												item.note
													.replaceAll('</p><p>', '</p><p>&nbsp;</p><p>')
													.replaceAll('invisible', '')
													.replaceAll('#', '<br>#'),
												'underline text-green-200'
											)}
										</p>
									</div>
								</a>
							</div>

							<!-- Instance/Website -->
						{:else if type === 'instance'}
							<TableWrap spacing="px-2">
								<div class="w-full md:w-3/12 md:mx-2">
									<!-- Profile Card -->
									<div class="bg-grey-900 pb-4 border-t-4 border-green-400">
										<div class="image overflow-hidden">
											<img class="h-auto w-full mx-auto" src={item.thumbnail} alt="" />
										</div>
										<span class="ml-auto"
											><span
												class="{item.locked
													? 'bg-red-500'
													: 'bg-green-500'} py-1 px-2 rounded text-white text-sm"
												>{item.approval_required ? 'Needs Approval' : 'Open'}</span
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
										<P>{item.short_description}</P>
										<List list="none">
											<Li class="ml-auto text-gray-300 my-1"
												># Toots: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
													>{item.stats?.status_count
														? item.stats.status_count.toLocaleString()
														: 'N/A'}</span
												></Li
											>
											<Li class="ml-auto text-gray-300 my-1"
												># Users: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
													>{item.stats?.user_count
														? item.stats.user_count.toLocaleString()
														: 'N/A'}</span
												></Li
											>
										</List>
									</div>
								</div>
							</TableWrap>

							<!-- Toots -->
						{:else}
							<MobileTootViewWrapper toot={item} />
						{/if}
					</TableWrap>
				{/each}
			</div>
		</div>
	</div></TableWrap
>
