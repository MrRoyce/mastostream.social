<script lang="ts">
	import { A, Heading } from 'flowbite-svelte';
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
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import showSensitiveStore from '$lib/stores/SensitiveStore';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import type { PageData } from '../$types';
	import { formatCreatedAt, truncateHTML } from '$lib/utils';
	import { MobileTootViewWrapper, TableWrap, TootsRadio } from '$lib/components';
	import { t } from '$lib/translations';

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Toots'
		});
	}

	export let data: PageData;
	const tootTypePassed = data.tootTypePassed;
	const toots = data.toots;

	const tableData = {
		tableHead: ['Pic', 'Safe', 'Type', 'Language', 'Pics', 'Video', 'Audio', 'Link']
	};

	let showSensitive: boolean;
	const limit = 1000;

	showSensitiveStore.subscribe((data) => {
		showSensitive = data;
	});

	$: tootType = tootTypePassed || 'both';
	function getTootType() {
		if (browser) {
			goto(`/toots?type=${tootType}`);
		}
	}

	showSensitive = $showSensitiveStore;
</script>

{#if toots}
	<TableWrap>
		<!-- Breadcrumb -->
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Link to Dashboard">
				<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem>{$t('pagelinks.toots')}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div
			class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
		>
			<!-- Top of Page with radio buttons -->
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div class="col-span-2">
					<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200"
						>{$t('general.latestToots')}</Heading
					>
				</div>
				<!-- Right Side -->
				<div class="md:col-span-2 md:col-start-3">
					<TootsRadio bind:tootType {getTootType} />
				</div>
			</div>

			<div class="hidden-on-mobile">
				<div class="mt-6">
					<Table
						name="advancedTable"
						classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
						hoverable={true}
					>
						<TableHead>
							{#each tableData.tableHead as tableHead}
								<TableHeadCell class="text-center " padding="px-4 py-3" scope="col"
									>{tableHead}</TableHeadCell
								>
							{/each}
						</TableHead>
						<TableBody>
							{#each toots as toot}
								<TableBodyRow
									class="border-none cursor-pointer"
									on:click={() => goto(`/toots/${toot.accountId}_${toot.tootId}`)}
								>
									<TableBodyCell>
										<img class=" w-10 h-auto max-w-xs" src={toot.avatar} alt="User" />
									</TableBodyCell>

									<TableBodyCell>
										{toot.sensitive ? '❌' : '✅'}
									</TableBodyCell>
									<TableBodyCell>
										{toot.bot ? '🤖' : '👤'}
									</TableBodyCell>
									<TableBodyCell>
										{toot.language}
									</TableBodyCell>

									<TableBodyCell class="text-right"
										>{toot.mediaAttachementCounts?.totalPictures || 0}</TableBodyCell
									>
									<TableBodyCell class="text-right"
										>{toot.mediaAttachementCounts?.totalVideos || 0}</TableBodyCell
									>
									<TableBodyCell class="text-right"
										>{toot.mediaAttachementCounts?.totalAudio || 0}</TableBodyCell
									>
									<TableBodyCell>
										<A
											rel="noopener nofollow"
											href={toot.uri}
											target="_blank"
											class="font-medium hover:underline"
											><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" /></A
										></TableBodyCell
									>
								</TableBodyRow>

								<TableBodyRow
									class="cursor-pointer"
									on:click={() => goto(`/toots/${toot.accountId}_${toot.tootId}`)}
									><TableBodyCell
										colspan="10"
										class="whitespace-normal break-words py-2 dark:text-gray-200"
									>
										{#if toot.sensitive && !showSensitive}
											{toot.spoiler_text || toot.spoilerText || 'Sensitive content'}
										{:else}
											<span class="text-base">{@html truncateHTML(toot.content, 300)}</span>
										{/if}
										<span class="text-gray-400">
											{@html '<br /><br />'}
											{toot.acct}
											{@html '<br />'}

											{`${formatCreatedAt(toot.createdAt)}`}
										</span>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			</div>

			<!-- Mobile view -->
			<div class="show-on-mobile">
				{#each toots as toot}
					<TableWrap spacing="px-2">
						<MobileTootViewWrapper {toot} {limit} hoverBg="dark:hover:bg-gray-700" />
					</TableWrap>
				{/each}
			</div>
		</div>
	</TableWrap>
{:else}
	{console.log('Waiting for toots')}
{/if}
