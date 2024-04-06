<script lang="ts">
	import { t } from '$lib/translations';
	import { browser, dev } from '$app/environment';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import { OwnersTootTable, TableWrap, TootContent, TootMeta } from '$lib/components';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Li,
		List,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Button
	} from 'flowbite-svelte';
	import { formatText } from '$lib/utils';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { Section } from 'flowbite-svelte-blocks';

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;
	const id = data.id;

	if (browser && dev) console.log('account entity', entity);
	if (browser && dev) console.log('account toots', toots);

	let domain: string;

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
		tableHead: [
			$t('tableHeaders.safe'),
			$t('tableHeaders.created'),
			'Pics',
			'Video',
			'Audio',
			$t('tableHeaders.link')
		]
	};

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Account'
		});
	}
</script>

{#if entity}
	<TableWrap>
		<!-- Breadcrumb -->
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label={$t('aria.breadcrumbLink')}>
				<BreadcrumbItem href="/">{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem href="/accounts">{$t('pagelinks.accounts')}</BreadcrumbItem>
				<BreadcrumbItem>{id}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class=" mx-auto my-5 p-5">
				<!-- Account Profile -->
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

							<TableBody>
								{#each entity.fields as field}
									<TableBodyRow>
										<TableBodyCell class="pb-0 break-words truncate"
											>{field.name.toUpperCase()}:</TableBodyCell
										>
									</TableBodyRow>
									<TableBodyRow>
										<TableBodyCell class="whitespace-normal break-words py-0">
											<span class="px-10"
												>{@html formatText(
													field.value.replaceAll(
														'class="invisible"',
														'class="font-medium hover:text-blue-300 hover:underline'
													),
													'underline text-green-200'
												)}</span
											></TableBodyCell
										>
									</TableBodyRow>
								{/each}
							</TableBody>
						</div>
					</div>
				</div>
				<!-- OwnersTootTable  -->
				<div class="my-4 text-gray-200">
					<h2 class="text-gray-200 font-bold text-xl leading-8 my-1 mb-4">
						{$t('general.latestTootsFrom')}
						{entity.acct}:
					</h2>
					<!-- hidden-on-mobile -->
					<div class="hidden-on-mobile">
						<OwnersTootTable {tableData} sourceData={toots} />
					</div>
					<!-- show-on-mobile view -->
					<div class="show-on-mobile">
						{#each toots as toot}
							{@const url = `/toots/${toot.accountId}_${toot.tootId}`}
							<a href={url}>
								<TableWrap>
									<!-- Contet -->
									<TootContent {toot} />
									<!-- Metadata -->
									<TootMeta createdAt={toot.createdAt} counts={toot.mediaAttachementCounts} />
								</TableWrap></a
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</TableWrap>
{:else if browser}
	{goto('/accounts/notfound')}
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
