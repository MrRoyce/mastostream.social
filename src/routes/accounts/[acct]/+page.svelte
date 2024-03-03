<script lang="ts">
	import { browser } from '$app/environment';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import TootTable from '$lib/components/UI/TootTable.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Li,
		List,
		TableBody,
		TableBodyRow,
		TableHeadCell
	} from 'flowbite-svelte';
	import { formatText } from '$lib/utils/formatText';
	import { formatToot } from '$lib/utils/formatToot';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;
	const id = data.id;

	let domain: string;

	const items = toots.map((item) => {
		return formatToot(item);
	});

	try {
		domain = new URL(entity?.url).hostname;
	} catch (error) {
		if (browser) {
			goto('/accounts/notfound');
		}
	}

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Account'
		});
	}
</script>

{#if entity}
	<!-- content here -->

	<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
		<Breadcrumb aria-label="Links to Dashboard and Accounts">
			<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
			<BreadcrumbItem href="/accounts">Accounts</BreadcrumbItem>
			<BreadcrumbItem>{id}</BreadcrumbItem>
		</Breadcrumb>
	</div>
	<div class="dark:bg-gray-800">
		<div class="container mx-auto my-5 p-5">
			<div class="md:flex no-wrap md:-mx-2">
				<!-- Left Side -->
				<div class="w-full md:w-3/12 md:mx-2">
					<!-- Profile Card -->
					<div class="bg-grey-900 p-3 border-t-4 border-green-400">
						<div class="image overflow-hidden">
							<img class="h-auto w-full mx-auto" src={entity.avatar} alt="" />
						</div>
						<span class="ml-auto"
							><span
								class="{entity.locked
									? 'bg-red-500'
									: 'bg-green-500'} py-1 px-2 rounded text-white text-sm"
								>{entity.locked ? 'Locked' : 'Public'}</span
							></span
						>
						<span class=" ml-3 text-gray-200 font-bold text-xl leading-8 my-1"
							>{entity.username}</span
						>
						<h3 class="text-white font-lg text-semibold leading-6 pt-5">
							<a
								rel="noopener nofollow"
								target="_blank"
								href={entity.url}
								class="inline-flex items-center hover:underline"
							>
								{domain}
								<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
							</a>
						</h3>
						<List list="none">
							<Li class="ml-auto text-gray-300 my-1"
								>Started: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.createdAt.split('T')[0]}</span
								></Li
							>
							<Li class="ml-auto text-gray-300 my-1"
								># Toots: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.statusesCount.toLocaleString()}</span
								></Li
							>
							<Li class="ml-auto text-gray-300 my-1"
								>Following: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.followingCount.toLocaleString()}</span
								></Li
							>
							<Li class="ml-auto text-gray-300 my-1"
								>Followers: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.followersCount.toLocaleString()}</span
								></Li
							>
						</List>
					</div>
				</div>
				<!-- Right Side -->
				<div class="w-full md:w-9/12 mx-2">
					<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
						<div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
							<div class="text-gray-700">
								<img src={entity.header} alt="User" />
							</div>
						</div>
						<h3 class="mt-5">
							<span class="pt-10 ml-auto text-gray-200 my-1">@{entity.acct}</span>
						</h3>
						<div class="mt-7 text-gray-200">
							<p>
								{@html formatText(
									entity.note
										.replaceAll('</p><p>', '</p><br /><p>')
										.replaceAll(
											'class="invisible"',
											'class="font-medium hover:text-blue-300 hover:underline'
										)
										.replaceAll('class="mention hashtag"', ''),
									'underline text-green-200'
								)}
							</p>
						</div>

						<TableBody>
							{#each entity.fields as field}
								<TableBodyRow>
									<TableHeadCell
										><span class="text-gray-200 mr-3">{field.name.toUpperCase()}:</span
										></TableHeadCell
									>
									<TableHeadCell class=" pl-4 mb-4">
										<span class="text-gray-200 mr-3"
											>{@html formatText(
												field.value.replaceAll(
													'class="invisible"',
													'class="font-medium hover:text-blue-300 hover:underline'
												),
												'underline text-green-200'
											)}</span
										></TableHeadCell
									>
								</TableBodyRow>
							{/each}
						</TableBody>
					</div>
				</div>
			</div>
			<div class="my-4 text-white">
				<h2 class="text-gray-200 font-bold text-xl leading-8 my-1">
					Latest toots from {entity.acct}:
				</h2>

				<TootTable
					{tableData}
					sourceData={toots}
					getData={() => {}}
					entity={`Toots from ${entity.username}`}
				/>
			</div>
		</div>
	</div>
{:else}
	{goto('/accounts/notfound')}
{/if}
