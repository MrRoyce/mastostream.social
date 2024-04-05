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
		tableHead: ['Picture', 'Safe', 'Type', 'Language', 'Pics', 'Video', 'Audio', 'Link']
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
					<BreadcrumbItem href="/" home>Dashboard</BreadcrumbItem>
					<BreadcrumbItem>Toots</BreadcrumbItem>
				</Breadcrumb>
			</div>
			<div
				class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4"
			>
				<!-- Top of Page with radio buttons -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div class="col-span-2">
						<Heading tag="h3" class="text-xl md:text-2xl lg:text-3xl dark:text-gray-200"
							>Latest Toots</Heading
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
										><TableBodyCell colspan="10" class="whitespace-normal break-words py-2">
											{#if toot.sensitive && !showSensitive}
												{toot.spoiler_text || toot.spoilerText || 'Sensitive content'}
											{:else}
												{@html truncateHTML(toot.content, 300)}
												{@html '<br /><br />'}
												{toot.acct}
												{@html '<br />'}
												{`${formatCreatedAt(toot.createdAt)}`}
											{/if}
										</TableBodyCell>
									</TableBodyRow>

									<TableBodyRow></TableBodyRow>
								{/each}
							</TableBody>
						</Table>
					</div>
				</div>
				<!-- Mobile view -->
				<div class="show-on-mobile">
					{#each toots as toot}
						{@const url = `/toots/${toot.accountId}_${toot.tootId}`}
						<a href={url}>
							<TableWrap>
								<!-- Contet -->
								<TootContent {toot} />
								<!-- Metadata -->
								<TootMeta createdAt={toot.createdAt} counts={toot.mediaAttachementCounts} />
								<!-- Profile -->
								<div class="md:col-span-1 md:col-start-1 order-last md:order-first">
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

													<p class="pt-2 text-base font-bold lg:justify-start">
														<svg
															class="h-4 fill-current text-green-700 pr-4"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
														>
															<path
																d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z"
															/>
														</svg>
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
