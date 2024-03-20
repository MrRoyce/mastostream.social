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
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils/formatDate';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser, dev } from '$app/environment';
	import { searchStyles } from '$lib/assets/styles/search';
	import TootsRadio from '$lib/components/UI/TootsRadio.svelte';
	import { t } from '$lib/translations';

	let searchTerm = '';
	export let data: PageData;
	const { tootTypePassed, accounts } = data;
	if (browser && dev) console.log(data);

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

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Accounts'
		});
	}

	let tootType = tootTypePassed || 'human';
	function getTootType() {
		if (browser) {
			goto(`/accounts?type=${tootType}`);
		}
	}
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="$t('breadCrumb.BreadcrumbLinks')">
		<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
		<BreadcrumbItem>{$t('pagelinks.accounts')}</BreadcrumbItem>
	</Breadcrumb>
</div>
<div
	class="dark:bg-gray-800 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4"
>
	<div class="container mx-auto my-5 p-5">
		<div class="md:flex no-wrap md:-mx-2">
			<!-- Left Side -->
			<div class="w-full md:w-3/12 md:mx-2">
				<!-- Profile Card -->
				<Heading>{$t('general.latestAccountToots')}</Heading>
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
			<TableSearch
				bind:inputValue={searchTerm}
				classInput={searchStyles.classInput}
				divClass={searchStyles.divClass}
				hoverable={true}
				innerDivClass={searchStyles.innerDivClass}
				placeholder={`Search by account`}
				searchClass={searchStyles.searchClass}
			>
				<div
					slot="header"
					class="w-full md:w-auto md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-left md:space-x-3 flex-shrink-0"
				>
					<Button
						class="!p-2.5"
						on:click={() =>
							goto(`/accounts/${searchTerm.startsWith('@') ? searchTerm.slice(1) : searchTerm}`)}
					>
						<SearchOutline class="w-5 h-5" />
					</Button>
				</div>
				<TableHead>
					{#each tableData.tableHead as tableHead}
						<TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
							>{tableHead}</TableHeadCell
						>
					{/each}
				</TableHead>
				<TableBody>
					{#each accounts as item}
						<TableBodyRow on:click={() => goto(`/accounts/${item.acct}`)}>
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
			</TableSearch>
		</Table>
	</div>
</div>
