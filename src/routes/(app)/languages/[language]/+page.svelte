<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import {
		TootTable,
		CardWithImage,
		TootsRadio,
		TableWrap,
		TootContent,
		TootMeta
	} from '$lib/components';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { Breadcrumb, BreadcrumbItem, Heading } from 'flowbite-svelte';
	import { getLanguage } from '$lib/utils';
	import { Button, Modal } from 'flowbite-svelte';
	let clickOutsideModal = false;

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Language'
		});
	}

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;
	const id = data.id;
	const wikiData = data.wikiData;
	const tootTypePassed = data.tootTypePassed;

	const wikiTitle = `${wikiData.title}: ${wikiData.description}`;
	let tootType = tootTypePassed || 'both';

	function getTootType() {
		if (browser) {
			goto(`/languages/${entity.language}?type=${tootType}`);
		}
	}

	if (!entity.language && browser) {
		goto('/languages/notfound');
	}

	const language = getLanguage(entity.language);

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Pics', 'Video', 'Audio', 'Language', 'Link']
	};
</script>

<div class="pt-0.5">
	<TableWrap>
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Links to Dashboard and Languages">
				<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
				<BreadcrumbItem href="/languages">Languages</BreadcrumbItem>
				<BreadcrumbItem>{id}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class="mx-auto my-5 p-5">
				<div class="col-span-2">
					<Heading tag="h3" class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200"
						>Latest {entity.language}
						({language.englishValue}) toots:</Heading
					>
				</div>
				<div class="dark:bg-gray-800">
					<div class=" mx-auto my-5 p-5">
						<!-- Header setion -->
						<div class="md:flex no-wrap md:-mx-2">
							<!-- Left Side -->
							<div class="w-full md:w-3/12 md:mx-2 flex items-center justify-center">
								<!-- Profile Card -->
								{#if wikiData.extract}
									<div class="6">
										<Button on:click={() => (clickOutsideModal = true)}>WikiData</Button>
									</div>
									<Modal title="WikiData" bind:open={clickOutsideModal} autoclose outsideclose
										><CardWithImage
											cardImage={wikiData.originalimage?.source ||
												'https://commons.wikimedia.org/static/images/project-logos/commonswiki-2x.png'}
											description={wikiData.extract}
											imageDescription={wikiData.extract}
											providerName="en.wikipedia.org"
											title={wikiTitle}
											url={wikiData.content_urls?.desktop?.page}
										/></Modal
									>
								{/if}
							</div>
							<!-- Right Side -->
							<div class="w-full md:w-9/12 mx-2">
								<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
									<h3 class="">
										<TootsRadio bind:tootType {getTootType} />
									</h3>
								</div>
							</div>
						</div>

						<!-- Toots section -->
						<div class="hidden-on-mobile">
							<div class="my-4 text-grey-200">
								<TootTable {tableData} sourceData={toots} getData={() => {}} />
							</div>
						</div>
						<!-- Mobile view -->
						<div class="show-on-mobile">
							{#each toots as toot}
								{@const url = `/toots/${toot.accountId}_${toot.tootId}`}
								<a href={url}>
									<TableWrap>
										<!-- Contet -->
										<TootContent {toot} />
										<!-- Metadata -->
										<TootMeta createdAt={toot.createdAt} counts={toot.mediaAttachementCounts} />
										<!-- Profile -->
										<div class="md:col-span-1 md:col-start-1 order-last md:order-first">
											<div class="bg-grey-900 shadow-sm border-t-4 border-green-400">
												<div class=" items-top h-auto mx-auto lg:my-0">
													<div id="profile" class="w-full shadow-2xl h-fit mx-0 lg:mx-0">
														<div class="p-6 text-center lg:text-left">
															<p
																class="text-3xl pb-5 text-ellipsis overflow-hidden dark:text-gray-200"
															>
																{toot.account?.displayName || toot.account?.display_name || ''}
															</p>
															<div class="image overflow-hidden pb-5">
																<img class="h-auto w-full mx-auto" src={toot.avatar} alt="" />
															</div>
															<p class="pb-5 text-ellipsis overflow-hidden">
																<Button
																	color="dark"
																	class=""
																	on:click={() => {
																		goto(`/accounts/${toot.acct}`);
																	}}
																>
																	<span class="">{toot.acct}</span></Button
																>
															</p>
															<div
																class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"
															></div>

															<p class="pt-2 text-base font-bold lg:justify-start">
																<svg
																	class="h-4 fill-current text-green-700 pr-4"
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 20 20"
																>
																	<path
																		d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z"
																	/>
																</svg>
																{toot.domain}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</TableWrap></a
								>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</TableWrap>
</div>

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
