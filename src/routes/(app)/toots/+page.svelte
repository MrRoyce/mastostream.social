<script lang="ts">
	import { A } from 'flowbite-svelte';
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
		tableHead: ['Pic', 'Safe', 'Type', 'Language', 'Created', 'Account', 'Content', 'Link']
	};

	let showSensitive: boolean;

	showSensitiveStore.subscribe((data) => {
		showSensitive = data;
	});

	let tootType = tootTypePassed || 'human';
	function getTootType() {
		if (browser) {
			goto(`/toots?type=${tootType}`);
		}
	}

	showSensitive = $showSensitiveStore;
</script>

{#if toots}
	<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
		<Breadcrumb aria-label="Link to Dashboard">
			<BreadcrumbItem href="/" home>Dashboard</BreadcrumbItem>
			<BreadcrumbItem>Toots</BreadcrumbItem>
		</Breadcrumb>
	</div>
	<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<div class="container mx-auto my-5 p-5">
			<div class="md:flex text-wrap md:-mx-2">
				<!-- Left Side -->
				<div class="w-full md:w-3/12 md:mx-2">
					<!-- Profile Card -->
					<h1>Latest toots</h1>
				</div>
				<!-- Right Side -->
				<div class="w-full md:w-9/12 mx-2">
					<div class="p-3">
						<h3 class="mt-5">
							<TootsRadio bind:tootType {getTootType} />
						</h3>
					</div>
				</div>
			</div>

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
						<TableBodyRow on:click={() => goto(`/toots/${item.accountId}_${item.tootId}`)}>
							<TableBodyCell
								><img class=" w-10 h-auto max-w-xs" src={item.avatar} alt="User" /></TableBodyCell
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

							<TableBodyCell class="whitespace-normal break-words py-2">
								{#if item.sensitive && !showSensitive}
									{item.spoiler_text || item.spoilerText || 'Sensitive content'}
								{:else}
									{@html truncateHTML(item.content, 300)}
								{/if}
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
					{/each}
				</TableBody>
			</Table>
		</div>
	</div>
{:else}
	{console.log('Waiting for toots')}
{/if}
