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
	import { truncateHTML } from '$lib/utils/truncateHTML';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import showSensitiveStore from '$lib/stores/SensitiveStore';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import TootsRadio from '$lib/components/UI/TootsRadio.svelte';
	import type { PageData } from '../$types';
	import { formatCreatedAt } from '$lib/utils';
	import { Section } from 'flowbite-svelte-blocks';
	import { TableWrap } from '$lib/components';

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
		tableHead: ['Pic', 'Safe', 'Type', 'Language', 'Created', 'Account', 'Link']
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
				<div class=" mx-auto my-5 p-5">
					<!-- Top of Page with radio buttons -->
					<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div class="col-span-2">
							<Heading><span class="text-gray-200">Latest Toots</span></Heading>
						</div>
						<!-- Right Side -->
						<div class="md:col-span-2 md:col-start-3">
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
								{#each toots as item}
									<TableBodyRow
										class="border-none"
										on:click={() => goto(`/toots/${item.accountId}_${item.tootId}`)}
									>
										<TableBodyCell
											><img
												class=" w-10 h-auto max-w-xs"
												src={item.avatar}
												alt="User"
											/></TableBodyCell
										>
										<TableBodyCell>
											{item.sensitive ? '❌' : '✅'}
										</TableBodyCell>
										<TableBodyCell>
											{item.bot ? '🤖' : '👤'}
										</TableBodyCell>
										<TableBodyCell>
											{item.language}
										</TableBodyCell>
										<TableBodyCell>
											{`${formatCreatedAt(item.createdAt)}`}
										</TableBodyCell>
										<TableBodyCell>
											{item.acct}
										</TableBodyCell>
										<TableBodyCell>
											<A
												rel="noopener nofollow"
												href={item.uri}
												target="_blank"
												class="font-medium hover:underline"
												><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" /></A
											></TableBodyCell
										>
									</TableBodyRow>
									<TableBodyRow on:click={() => goto(`/toots/${item.accountId}_${item.tootId}`)}>
										<TableBodyCell></TableBodyCell>
										<TableBodyCell colspan="6" class="whitespace-normal break-words py-2">
											{#if item.sensitive && !showSensitive}
												{item.spoiler_text || item.spoilerText || 'Sensitive content'}
											{:else}
												{@html truncateHTML(item.content, 300)}
											{/if}
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
{:else}
	{console.log('Waiting for toots')}
{/if}
