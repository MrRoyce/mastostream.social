<script lang="ts">
	import { t } from '$lib/translations';
	import { browser, dev } from '$app/environment';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import type { PageData } from '../$types';
	import { MobileTootViewWrapper, OwnersTootTable, Page404, TableWrap } from '$lib/components';
	import { Breadcrumb, BreadcrumbItem, Li, List } from 'flowbite-svelte';
	import { formatText } from '$lib/utils';
	import { getAnalytics, logEvent } from 'firebase/analytics';

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;

	let acctName = '';
	let acctInstance = '';

	if (entity && entity.acct) {
		[acctName, acctInstance] = entity.acct.split('@');
	}

	if (browser && dev) console.log('account entity', entity);
	if (browser && dev) console.log('account toots', toots);

	let domain: string;

	try {
		domain = new URL(entity?.url).hostname;
	} catch (error) {}

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

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Account'
		});
	}
</script>

{#if entity && entity.url}
	<TableWrap>
		<!-- Breadcrumb -->
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label={$t('aria.breadcrumbLink')}>
				<BreadcrumbItem href="/">{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem href="/accounts">{$t('pagelinks.accounts')}</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div
			class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 pt-2 px-2"
		>
			<div class=" mx-auto my-2 px-2">
				<!-- Account Profile -->
				<div class="md:flex no-wrap md:-mx-2">
					<!-- Left Side -->
					<div class="w-full md:w-3/12 md:mx-2">
						<!-- Profile Card -->
						<div class="bg-grey-900 pt-2 border-t-4 border-green-400">
							<div class="image overflow-hidden">
								<img class="h-auto w-full mx-auto" src={entity.avatar} alt="" />
							</div>
							<p class="dark:text-gray-200 font-bold text-lg pt-2 my-2">
								{entity.username}
							</p>
							<p class="text-white dark:text-gray-200 text-lg">
								<a
									rel="noopener nofollow"
									target="_blank"
									href={entity.url}
									class="inline-flex items-center hover:underline"
								>
									{domain}
									<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
								</a>
							</p>
							<!-- Account info -->
							<div class="pt-2 text-gray-200">
								<List list="none">
									<Li><span class=" text-lg">Started: </span>{entity.createdAt.split('T')[0]}</Li>
									<Li
										><span class=" text-lg"
											># Toots:
										</span>{entity.statusesCount.toLocaleString()}</Li
									>
									<Li
										><span class=" text-lg"
											>Following:
										</span>{entity.followingCount.toLocaleString()}</Li
									>
									<Li
										><span class=" text-lg"
											>Followers:
										</span>{entity.followersCount.toLocaleString()}</Li
									>
								</List>
							</div>
						</div>
					</div>

					<!-- Right Side -->
					<div class="w-full md:w-9/12">
						<div class="bg-grey-900 px-2 shadow-sm">
							<!-- Banner image -->
							<img src={entity.header} alt="User" />

							<!-- acct  -->
							<p class=" dark:text-gray-200 my-2">@{acctName}</p>

							<!-- Account note -->
							<div class="pb-2 overflow-ellipsis">
								{@html entity.note
									.replaceAll('</p><p>', '</p><p>&nbsp;</p><p>')
									.replaceAll('class="mention hashtag"', '')
									.replaceAll('invisible', '')
									.replaceAll('<a ', '<a class="underline text-green-400" ')}
							</div>

							<div class="m-2 border-t-2 border-green-400"></div>

							<!-- Account Favorites -->
							<div class="grid grid-cols-1">
								{#each entity.fields as field}
									<div class="pt-2 dark:text-gray-200 text-lg">
										{field.name}:
									</div>
									<div class="dark:text-gray-300">
										{@html formatText(
											field.value.replaceAll(
												'class="invisible"',
												'class="font-medium hover:text-green-400 hover:underline'
											),
											'underline text-green-200'
										)}
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- OwnersTootTable  -->
				<div class="my-2 text-gray-200">
					<h2 class="text-gray-200 text-lg">
						{$t('general.latestTootsFrom')}
					</h2>
					<p>{acctName}</p>

					<!-- hidden-on-mobile -->
					<div class="hidden-on-mobile">
						<OwnersTootTable {tableData} sourceData={toots} />
					</div>

					<!-- show-on-mobile view -->
					<div class="show-on-mobile">
						{#each toots as toot}
							<TableWrap spacing="px-0">
								<MobileTootViewWrapper {toot} showProfile={false} />
							</TableWrap>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</TableWrap>
{:else if browser}
	<Page404 route="accounts" />
{/if}
