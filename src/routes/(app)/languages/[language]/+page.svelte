<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { TootTable, CardWithImage, TootsRadio } from '$lib/components';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { Breadcrumb, BreadcrumbItem, Heading } from 'flowbite-svelte';
	import { getLanguage } from '$lib/utils';
	import { Button, Modal } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
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
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};
</script>

<div class="pt-0.5">
	<Section name="tableheader" sectionClass="bg-gray-50 dark:bg-gray-900 flex pt-4 m-4 h-fit">
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label="Links to Dashboard and Languages">
				<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
				<BreadcrumbItem href="/languages">Languages</BreadcrumbItem>
				<BreadcrumbItem>{id}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<div class="container mx-auto my-5 p-5">
				<div class="col-span-2">
					<Heading>
						<span class="text-gray-200"
							>Latest {entity.language}
							({language.englishValue}) toots:</span
						>
					</Heading>
				</div>
				<div class="dark:bg-gray-800">
					<div class="container mx-auto my-5 p-5">
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

						<!-- Toots setion -->
						<div class="my-4 text-grey-200">
							<TootTable {tableData} sourceData={toots} getData={() => {}} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</Section>
</div>
