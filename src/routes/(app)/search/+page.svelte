<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, Heading, Radio } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { TableWrap } from '$lib/components';
	import { t } from '$lib/translations';
	import { getBadWords, hasAdultContent } from '$lib/utils';

	let searchTerm = '';
	let selected = 'toot';

	const badWords = getBadWords();

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Search'
		});
	}

	function onChange(thisSelection) {
		console.log('thisSelection', thisSelection);
		selected = thisSelection;
	}

	function searchText() {
		// console.log(`Will search for ${searchTerm} in ${selected}`);
		const adultContent = hasAdultContent(searchTerm, badWords);
		console.log('adultContent', adultContent);
		//goto(`/search/${selected}/${searchTerm}`);
	}

	$: activeUrl = $page.url?.pathname;
</script>

<div class="pt-0.5">
	<TableWrap>
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Link to Dashboard">
				<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem>{$t('pagelinks.search')}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class=" mx-auto mb-5 p-4">
				<div class="col-span-2 mb-6">
					<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200"
						>Search in Toots, Websites, or Accounts</Heading
					>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div class="md:col-span-2 md:col-start-1 order-first mb-6">
						<form class="flex items-left">
							<label for="entity-search" class="sr-only">Search</label>
							<div class="relative w-full">
								<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
									<i class="fa-solid fa-magnifying-glass" />
								</div>
								<input
									type="text"
									id="entity-search"
									name="entity-search"
									bind:value={searchTerm}
									class="bg-gray-50 border border-gray-300 dark:text-gray-200 text-sm focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500 dark:focus:border-green-500"
									placeholder={$t('search.anyTerm')}
									required
								/>
							</div>
							<Button
								color="green"
								on:click={searchText}
								class="rounded-none py-2.5 px-3.5  ms-2 text-sm font-medium dark:text-gray-200"
							>
								<svg
									class="w-4 h-4"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 20"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
									/>
								</svg>
								<span class="sr-only">Search</span>
							</Button>
						</form>
					</div>
					<div class="md:col-span-2 md:col-start-3 order-last">
						<div class="grid col-span-1 grid-rows-1 grid-flow-col gap-4">
							<Radio
								name="search-list"
								class="p-2"
								checked={selected === 'website'}
								on:click={() => onChange('website')}>Website</Radio
							>

							<Radio
								name="search-list"
								class="p-2"
								checked={selected === 'account'}
								on:click={() => onChange('account')}>Account</Radio
							>
							<Radio
								name="search-list"
								class="p-2"
								checked={selected === 'toot'}
								on:click={() => onChange('toot')}>Toot Content</Radio
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</TableWrap>
</div>
