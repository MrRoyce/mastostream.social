<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils/formatDate';
	import { getLanguage } from '$lib/utils/getLanguage';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { TableWrap } from '$lib/components';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Languages'
		});
	}

	export let data: PageData;
	const languages = data.languages;

	let searchTerm = '';

	const tableData = {
		tableHead: ['Name', 'Language', 'Count', 'Last Toot']
	};
</script>

<div class="pt-0.5">
	<TableWrap>
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Link to Dashboard">
				<BreadcrumbItem href="/" home>Dashboard</BreadcrumbItem>
				<BreadcrumbItem>Languages</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class="container mx-auto my-5 p-5">
				<div class="col-span-2 mb-6">
					<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200"
						>Toots by Language</Heading
					>
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
						{#each languages as item}
							{@const translations = getLanguage(item.language)}
							<TableBodyRow
								class="cursor-pointer"
								on:click={() => goto(`/languages/${item.language}`)}
							>
								<TableBodyCell>
									{item.language}
								</TableBodyCell>
								<TableBodyCell>
									{translations.englishValue}
								</TableBodyCell>
								<TableBodyCell class="text-right">
									{item.count.toLocaleString()}
								</TableBodyCell>

								<TableBodyCell>
									{item.lastSeen
										? formatDate({
												seconds: item.lastSeen.seconds,
												nanoseconds: item.lastSeen.nanoseconds
											})
										: 'N/A'}
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</div></TableWrap
	>
</div>
