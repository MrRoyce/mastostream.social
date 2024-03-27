<script lang="ts">
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import { OwnersTootTable } from '$lib/components';
	import { A, Breadcrumb, BreadcrumbItem, Li, List } from 'flowbite-svelte';
	import { formatText } from '$lib/utils/formatText';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser, dev } from '$app/environment';
	import { Section } from 'flowbite-svelte-blocks';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Websites_[domain]'
		});
	}

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;
	const id = data.id;

	if (browser && dev) console.log('account entity', entity);
	if (browser && dev) console.log('account toots', toots);

	let domain: string;

	try {
		domain = entity.domain;
	} catch (error) {
		if (browser) {
			goto('/websites/notfound');
		}
	}

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Safe', 'Created', 'Link']
	};
</script>

{#if entity?.domain && entity.instance}
	{@const instance = entity.instance}
	<div class="pt-0.5">
		<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 m-4 h-fit">
			<div class="pl-0 pt-0 pb-4">
				<Breadcrumb aria-label="Links to Dashboard and Servers">
					<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
					<BreadcrumbItem href="/websites">Web Sites</BreadcrumbItem>
					<BreadcrumbItem>{id}</BreadcrumbItem>
				</Breadcrumb>
			</div>
			<div
				class="dark:bg-gray-800 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4"
			>
				<div class=" mx-auto my-5 p-5">
					<div class="md:flex no-wrap md:-mx-2">
						<!-- Left Side -->
						<div class="w-full md:w-3/12 md:mx-2">
							<!-- Profile Card -->
							<div class="bg-grey-900 p-3 border-t-4 border-green-400">
								<div class="image overflow-hidden">
									<img class="h-auto w-full mx-auto" src={instance.thumbnail} alt="" />
								</div>
								<span class="ml-auto"
									><span
										class="{entity.locked
											? 'bg-red-500'
											: 'bg-green-500'} py-1 px-2 rounded text-white text-sm"
										>{entity.approval_required ? 'Needs Approval' : 'Open'}</span
									></span
								>
								<span class=" ml-3 text-gray-200 font-bold text-xl leading-8 my-1"
									>{entity.domain}</span
								>
								<h3 class="text-white font-lg text-semibold leading-6 pt-5">
									<a
										rel="noopener nofollow"
										target="_blank"
										href={entity.url}
										class="inline-flex items-center hover:underline"
									>
										<A
											rel="noopener nofollow"
											href={`https://${domain}`}
											target="_blank"
											class="font-medium hover:underline">{domain}</A
										>
										<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
									</a>
								</h3>
								<List list="none">
									<Li class="ml-auto text-gray-300 my-1"
										># Toots: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
											>{instance.stats?.status_count.toLocaleString()}</span
										></Li
									>
									<Li class="ml-auto text-gray-300 my-1"
										># Users: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
											>{instance.stats?.user_count.toLocaleString()}</span
										></Li
									>
								</List>
							</div>
						</div>
						<!-- Right Side -->
						<div class="w-full md:w-9/12 mx-2">
							<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
								<p class="mt-5 text-xl">
									{instance.title || ''}
								</p>
								<p class="mt-5 text-l">
									<span class="pt-10 ml-auto my-1">Email:</span>
									{instance.email || 'Not Available'}
								</p>
								<div class="mt-7 text-gray-200">
									<p class="text-l">
										{@html formatText(instance.short_description || '', 'underline text-green-200')}
									</p>
								</div>
								{#if instance.rules?.length > 0}
									<h2 class="mt-7 text-white">Rules:</h2>
								{/if}
								<List list="none">
									{#if instance.rules}
										{#each instance.rules as rule}
											<Li class=" pl-4 mb-4">
												<span class="text-gray-200 mr-3"
													>{@html formatText(
														rule.text.replaceAll(
															'class="invisible"',
															'class="font-medium hover:text-blue-300 hover:underline'
														),
														'underline text-green-200'
													)}</span
												></Li
											>
										{/each}
									{/if}
								</List>
							</div>
						</div>
					</div>
					<div class="my-4 text-white">
						<h2 class="text-gray-200 font-bold text-xl leading-8 my-1">
							Recent toots from {entity.domain}
						</h2>

						<OwnersTootTable {tableData} sourceData={toots} />
					</div>
				</div>
			</div></Section
		>
	</div>
{:else if browser}
	{goto('/websites/notfound')}
{/if}
