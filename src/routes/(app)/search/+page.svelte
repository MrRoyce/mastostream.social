<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Radio } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { TableWrap } from '$lib/components';
	import { t } from '$lib/translations';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Search'
		});
	}

	let searchTerm = '';
	$: activeUrl = $page.url?.pathname;
</script>

<div class="pt-0.5">
	<TableWrap>
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Link to Dashboard">
				<BreadcrumbItem href="/">{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem>{$t('pagelinks.search')}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class="container mx-auto my-5 p-5">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div class="md:col-span-2 md:col-start-1 order-first">
						<form class="flex items-left">
							<label for="entity-search" class="sr-only">Search</label>
							<div class="relative w-full">
								<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
									<svg
										class="w-4 h-4 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 18 20"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
										/>
									</svg>
								</div>
								<input
									type="text"
									id="entity-search"
									name="entity-search"
									bind:value={searchTerm}
									class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder={$t('search.anyTerm')}
									required
								/>
							</div>
						</form>
					</div>
					<div class="md:col-span-2 md:col-start-3 order-last">
						<ul
							class=" py-0.5 items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
						>
							<li
								class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
							>
								<div class="flex items-center ps-3">
									<Radio
										name="search-list"
										class="p-2"
										on:click={() => goto(`/search/toot/${searchTerm}`)}>Toot Content</Radio
									>
								</div>
							</li>
							<li
								class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
							>
								<div class="flex items-center ps-3">
									<Radio
										name="search-list"
										class="p-2"
										on:click={() => goto(`/search/website/${searchTerm}`)}>Website</Radio
									>
								</div>
							</li>
							<li
								class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
							>
								<div class="flex items-center ps-3">
									<Radio
										name="search-list"
										class="p-2"
										on:click={() => goto(`/search/account/${searchTerm}`)}>Account Name</Radio
									>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</TableWrap>
</div>
