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
		TootMeta,
		MobileTootViewWrapper
	} from '$lib/components';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { Breadcrumb, BreadcrumbItem, Heading } from 'flowbite-svelte';
	import { getLanguage } from '$lib/utils';
	import { Button, Modal } from 'flowbite-svelte';
	import { t } from '$lib/translations';
	let clickOutsideModal = false;

	if (browser) {
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
				<BreadcrumbItem href="/">{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem href="/languages">{$t('pagelinks.languages')}</BreadcrumbItem>
				<BreadcrumbItem>{id}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class="mx-auto mb-5 p-4">
				<!-- Left Side -->
				<div class="md:col-span-2 md:col-start-1 order-first">
					<!-- Top of page -->
					<Heading tag="h3" class="text-xl md:text-2xl lg:text-3xl  dark:text-gray-200"
						>{$t('general.latestTootsIn')}
						{entity.language}
						({language.englishValue}):</Heading
					>
				</div>
				<div class="dark:bg-gray-800">
					<div class=" mx-auto mb-5 p-2">
						<!-- Header setion -->
						<div class="md:flex no-wrap md:-mx-2">
							<!-- Left Side -->
							<div class="w-full md:w-3/12 md:mx-2 flex items-center justify-center">
								<!-- WikiData button -->
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
							<div class="md:col-span-2 md:col-start-3 order-last">
								<TootsRadio bind:tootType {getTootType} />
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
							<TableWrap spacing="px-2">
								<MobileTootViewWrapper {toot} />
							</TableWrap>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</TableWrap>
</div>
