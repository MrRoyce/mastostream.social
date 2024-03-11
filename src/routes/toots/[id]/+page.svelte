<script lang="ts">
	import { Maintenance, Page404, Section } from 'flowbite-svelte-blocks';
	import { A, Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import type { PageData } from '../$types';
	import { formatText } from '$lib/utils/formatText';
	import { formatImages } from '$lib/utils/formatImages';
	import TootTable from '$lib/components/UI/TootTable.svelte';
	import YouTube from '$lib/components/Cards/YouTube.svelte';
	import CardWithLink from '$lib/components/Cards/Card.svelte';
	import BlurHash from '$lib/components/BlurHash/BlurHash.svelte';
	import ImageGallery from '$lib/components/UI/ImageGallery.svelte';
	import showSensitiveStore from '$lib/stores/SensitiveStore';
	import { goto } from '$app/navigation';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Toots_[id]'
		});
	}

	export let data: PageData;
	const entity = data.entity;
	const replies = data.replies;
	const replyTo = data.replyTo ? [data.replyTo] : false;
	const card = data.card;
	// if (browser) console.log('entity', entity);
	// if (browser) console.log('card', card);

	const images =
		entity && entity.mediaAttachments && Array.isArray(entity.mediaAttachments)
			? formatImages(entity?.mediaAttachments)
			: { videos: [], pictures: [] };

	const accountNote =
		entity && entity.account && entity.account.note
			? entity.account.note.replaceAll('</p><p>', '</p><br /><p>')
			: '';

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Content', 'Link']
	};

	let showSensitive: boolean;

	showSensitiveStore.subscribe((data) => {
		showSensitive = data;
	});

	showSensitive = $showSensitiveStore;
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
	<Breadcrumb aria-label="Links to Dashboard and Toots">
		<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
		<BreadcrumbItem href="/toots">Toots</BreadcrumbItem>
	</Breadcrumb>
</div>
{#if entity.acct}
	<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<div class=" mx-auto my-5 p-5">
			<div class="md:flex no-wrap md:-mx-2">
				<!-- Left Side -->
				<div class="w-full md:w-3/12 md:mx-2">
					<div class="bg-grey-900 shadow-sm border-t-4 border-green-400">
						<div class="max-w-4xl items-top h-auto mx-auto lg:my-0">
							<div id="profile" class="w-full shadow-2xl h-fit mx-6 lg:mx-0">
								<div class="md:p-6 text-center lg:text-left">
									<p class="text-3xl pb-5">
										{entity.account?.displayName || entity.account?.display_name || ''}
									</p>
									<div class="image overflow-hidden pb-5">
										<img class="h-auto w-full mx-auto" src={entity.avatar} alt="" />
									</div>
									<p class="pb-5">
										<span class=" truncate">
											<Button
												color="dark"
												class=""
												on:click={() => {
													goto(`/accounts/${entity.acct}`);
												}}>{entity.acct}</Button
											>
										</span>
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
										{entity.domain}
									</p>
									<p class="pt-2 text-base">
										{@html accountNote}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Right Side -->
				<div class="w-full md:w-9/12 mx-2">
					<span class="text-leftfloat-left">
						<p class="pt-4 text-base font-bold flex lg:justify-start">
							<svg
								class="h-4 fill-current text-green-700 pr-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path
									d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z"
								/>
							</svg>
							{entity.createdAt.toLocaleString()}

							<A target="_blank" href={entity.uri}
								><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
							</A>
						</p></span
					>
					{#if replyTo !== false}
						<TootTable
							{tableData}
							sourceData={replyTo}
							getData={() => {}}
							entity={`Replying to this toot`}
						/>
					{/if}
					{#if entity.sensitive && !showSensitive}
						{#if entity.spoiler_text}
							<p class="text-2xl pb-4">{entity.spoiler_text}</p>
						{:else}
							<div class="pt-10">
								<Section name="maintenance">
									<Maintenance>
										<svelte:fragment slot="h1">Sensitive Content</svelte:fragment>
										<svelte:fragment slot="paragraph"
											>Toggle the above 'Show Senstive' switch to view.</svelte:fragment
										>
									</Maintenance>
								</Section>
							</div>
						{/if}
					{:else}
						<p class="pt-4 pb-8 text-2xl overflow-x-clip">
							{@html formatText(
								entity.content
									.replaceAll('</p><p>', '</p><br /><p>')
									.replaceAll('class="invisible"', 'class="font-medium text-green-400 underline"')
									.replaceAll('class="ellipsis"', 'class="font-medium text-green-400 underline"'),
								'underline text-green-400'
							)}
						</p>
					{/if}

					{#each images.videos as video}
						{#if entity.sensitive && !showSensitive}
							<BlurHash hash={video.blurhash} />
						{:else}
							<video
								controls
								class="h-80"
								poster={video.previewUrl}
								muted
								preload="none"
								tabindex="0"
								aria-label={video.description}
								lang={video.language}
								volume="1"
								style="width: 100%;"
							>
								<source src={video.src} type="video/mp4" />

								<!-- Add caption track -->
								<track
									kind="captions"
									label="English"
									src="captions_en.vtt"
									srclang={video.language}
								/>

								<!-- You can add additional caption tracks if needed -->
								<!-- <track kind="captions" label="Spanish" src="captions_es.vtt" srclang="es"> -->

								Your browser does not support the video tag.
							</video>
						{/if}
					{/each}

					{#if images.pictures}
						<ImageGallery pictures={images.pictures} sensitive={entity.sensitive} {showSensitive} />
					{/if}

					{#if card}
						{#if entity.sensitive && !showSensitive}
							<br />
						{:else if card.provider_name === 'YouTube'}
							<YouTube
								cardImage={card.image}
								videoSource={card.html}
								title={card.title}
								authorName={card.author_name}
								imageDescription={card.image_description}
								url={card.url}
							/>
						{:else}<CardWithLink
								cardImage={card.image}
								description={card.description}
								imageDescription={card.image_description}
								providerName={card.provider_name}
								title={card.title}
								url={card.url}
							/>
						{/if}
					{/if}
					{#if replies && replies.length}
						<TootTable
							{tableData}
							sourceData={replies}
							getData={() => {}}
							entity={`Replies to this toot`}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<Page404>
		<svelte:fragment slot="h1">404</svelte:fragment>
		<svelte:fragment slot="paragraph">
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
				Something's missing.
			</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
				Sorry, we can't find that page. You'll find lots to explore on the home page.
			</p>
			<Button href="/toots" size="lg" color="red">Back to Toots</Button>
		</svelte:fragment>
	</Page404>
{/if}
