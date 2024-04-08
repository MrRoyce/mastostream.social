<script lang="ts">
	import { A, Button, Heading } from 'flowbite-svelte';
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
	import { truncateHTML } from '$lib/utils/truncateHTML';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import showSensitiveStore from '$lib/stores/SensitiveStore';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import TootsRadio from '$lib/components/UI/TootsRadio.svelte';
	import type { PageData } from '../$types';
	import { formatCreatedAt } from '$lib/utils';
	import { TableWrap, TootContent, TootMeta } from '$lib/components';
	import { t } from '$lib/translations';

	if (browser && isSupported()) {
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
	<div class="pt-0.5">
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
										class="border-none"
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

									<TableBodyRow on:click={() => goto(`/toots/${toot.accountId}_${toot.tootId}`)}
										><TableBodyCell
											colspan="10"
											class="whitespace-normal break-words py-2 dark:text-gray-200"
										>
											{#if toot.sensitive && !showSensitive}
												{toot.spoiler_text || toot.spoilerText || 'Sensitive content'}
											{:else}
												{@html truncateHTML(toot.content, 300)}
												<span class="text-gray-400">
													{@html '<br /><br />'}
													{toot.acct}
													{@html '<br />'}

													{`${formatCreatedAt(toot.createdAt)}`}
												</span>
											{/if}
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
						{@const url = `/toots/${toot.accountId}_${toot.tootId}`}
						{@const shareContent = {
							url: `https://utoots.com/toots/${toot.accountId}_${toot.tootId}`,
							title: `Found this on utoots.com from : ${toot.acct}`,
							desc: truncateHTML(toot.content, 200)
						}}
						{@const karmaCounts = {
							upCount: toot.upCount || 0,
							downCount: toot.downCount || 0,
							commentsCount: toot.commentsCount || 0
						}}
						<a href={url}>
							<TableWrap spacing="px-4">
								<!-- Contet -->
								<TootContent {toot} />
								<!-- Metadata -->
								<TootMeta
									createdAt={toot.createdAt}
									counts={toot.mediaAttachementCounts}
									{karmaCounts}
									{shareContent}
								/>
								<!-- Profile -->
								<div class="md:col-span-1 md:col-start-1 order-last md:order-first">
									<!-- Account Profile -->
									<div class="bg-grey-900 shadow-sm border-t-4 border-green-400">
										<div class=" items-top h-auto mx-auto lg:my-0">
											<div id="profile" class="w-full shadow-2xl h-fit mx-0 lg:mx-0">
												<div class="p-6 text-center lg:text-left">
													<p class="text-3xl pb-5 text-ellipsis overflow-hidden dark:text-gray-200">
														{toot.account?.displayName || toot.account?.display_name || ''}
													</p>
													<div class="image overflow-hidden pb-5">
														<img class="h-auto w-full mx-auto" src={toot.avatar} alt="" />
													</div>
													<p class="pb-5 text-ellipsis overflow-hidden">
														<Button
															color="dark"
															class=""
															on:click={() => {
																goto(`/accounts/${toot.acct}`);
															}}
														>
															<span class="">{toot.acct}</span></Button
														>
													</p>
													<div
														class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"
													></div>

													<p class="pt-2 text-base font-bold lg:justify-start dark:text-gray-200">
														{toot.domain}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</TableWrap></a
						>
					{/each}
				</div>
			</div>
		</TableWrap>
	</div>
{:else}
	{console.log('Waiting for toots')}
{/if}

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
