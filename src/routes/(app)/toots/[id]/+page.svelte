<script lang="ts">
	import { Maintenance, Page404, Section } from 'flowbite-svelte-blocks';
	import { dev } from '$app/environment';
	import { A, Breadcrumb, BreadcrumbItem, Button, Toggle } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import type { PageData } from '../$types';
	import { t } from '$lib/translations';
	import {
		BlurHash,
		CardDefault,
		CardWithImage,
		ImageGallery,
		TableWrap,
		TootTable,
		YouTube
	} from '$lib/components';
	import { goto } from '$app/navigation';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { formatCreatedAt, formatImages, formatText } from '$lib/utils';
	import { redirectPage } from '$lib/utils/redirectPage';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Toots_[id]'
		});
	}

	function redirectToPage() {
		redirectPage(5, '/toots');
	}

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Created', 'Account', 'Language', 'Link']
	};

	export let data: PageData;
	const entity = data.entity;
	let replies: [];
	let replyTo: {};
	let card: {};
	let images: {};
	let accountNote: string;

	if (entity.acct) {
		console.log('entity.acct', entity.acct);
		replies = data.replies;
		replyTo = data.replyTo ? [data.replyTo] : false;
		card = data.card;
		if (browser && dev) console.log('entity', entity);
		if (browser && dev) console.log('card', card);

		images =
			entity && entity.mediaAttachments && Array.isArray(entity.mediaAttachments)
				? formatImages(entity?.mediaAttachments)
				: { audio: [], videos: [], pictures: [] };

		if (browser && dev) console.log('images', images);

		accountNote =
			entity && entity.account && entity.account.note
				? entity.account.note.replaceAll('</p><p>', '</p><br /><p>')
				: '';
	}

	$: showSensitive = false;
	const hideSensitive = () => {
		showSensitive = !showSensitive;
	};
</script>

{#if entity.acct}
	<div class="pt-0.5">
		<TableWrap>
			<div class="pl-0 pt-0 pb-4">
				<Breadcrumb aria-label="Links to Dashboard and Toots">
					<BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
					<BreadcrumbItem href="/toots">Toots</BreadcrumbItem>
				</Breadcrumb>
			</div>
			<div
				class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4"
			>
				<div class=" p-5">
					<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
						<!-- Toot -->
						<div class="md:col-span-3 md:col-start-2 order-first md:order-last">
							<div class="grid grid-cols-2">
								<!-- Created At date -->
								<span class="text-left">
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
										{formatCreatedAt(entity.createdAt)}

										<A target="_blank" href={entity.uri}
											><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
										</A>
									</p></span
								>
								<!-- Sensitive Toggle -->
								<Toggle
									color="red"
									checked={false}
									value="false"
									on:click={() => {
										{
											hideSensitive();
										}
									}}>{$t('pagelinks.showSensitive')}</Toggle
								>
							</div>
							<!-- Reply to if any -->
							{#if replyTo !== false && typeof replyTo == 'object' && replyTo.acct}
								<TootTable
									{tableData}
									sourceData={replyTo}
									getData={() => {}}
									reply={`Replying to this toot`}
								/>
							{/if}
							{#if entity.sensitive && !showSensitive}
								<div class="pt-10">
									<Section name="maintenance">
										<Maintenance>
											<svelte:fragment slot="h1"
												>{entity.spoiler_text ||
													entity.spoilerText ||
													'Sensitive Content'}</svelte:fragment
											>
											<svelte:fragment slot="paragraph"
												><span class="text-red-700">
													Toggle the above 'Show Senstive' switch to view.</span
												></svelte:fragment
											>
										</Maintenance>
									</Section>
								</div>
							{:else}
								<p class="pt-4 pb-8 text-2xl overflow-x-clip flex-wrap">
									{@html formatText(
										entity.content
											.replaceAll('</p><p>', '</p><br /><p>')
											.replaceAll(
												'class="invisible"',
												'class="font-medium text-green-400 underline"'
											)
											.replaceAll(
												'class="ellipsis"',
												'class="font-medium text-green-400 underline"'
											),
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
										loop
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
										<source
											src={video.src || video.remoteUrl}
											type={video.type === 'video' || video.src.endsWith('mp4')
												? 'video/mp4'
												: video.type}
										/>

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
								<ImageGallery
									pictures={images.pictures}
									sensitive={entity.sensitive}
									{showSensitive}
								/>
							{/if}

							{#each images.audio as audio}
								<audio controls muted={false} src={audio.src}></audio>
							{/each}

							{#if card && (card.provider_name || card.title || card.description || card.image || card.url)}
								<div class="pt-4 justify-center">
									{#if entity.sensitive && !showSensitive}
										<br />
									{:else if card.provider_name === 'YouTube'}
										<YouTube
											authorName={card.author_name}
											cardImage={card.image}
											imageDescription={card.image_description}
											title={card.title}
											url={card.url}
											videoSource={card.html}
										/>
									{:else if card.image}
										<CardWithImage
											cardImage={card.image}
											description={card.description}
											imageDescription={card.image_description || card.description}
											providerName={card.provider_name}
											title={card.title}
											url={card.url}
										/>
									{:else}
										<CardDefault
											description={card.description || card.title}
											providerName={card.provider_name}
											title={card.title}
											url={card.url}
										/>
									{/if}
								</div>
							{/if}

							<!-- Replies to the toot -->
							{#if replies && replies.length}
								<TootTable
									{tableData}
									sourceData={replies}
									getData={() => {}}
									reply={`Replies to this toot`}
								/>
							{/if}
						</div>
						<!-- Profile -->
						<div class="md:col-span-1 md:col-start-1 order-last md:order-first">
							<div class="bg-grey-900 shadow-sm border-t-4 border-green-400">
								<div class=" items-top h-auto mx-auto lg:my-0">
									<div id="profile" class="w-full shadow-2xl h-fit mx-0 lg:mx-0">
										<div class="p-6 text-center lg:text-left">
											<p class="text-3xl pb-5 text-ellipsis overflow-hidden">
												{entity.account?.displayName || entity.account?.display_name || ''}
											</p>
											<div class="image overflow-hidden pb-5">
												<img class="h-auto w-full mx-auto" src={entity.avatar} alt="" />
											</div>
											<p class="pb-5 text-ellipsis overflow-hidden">
												<Button
													color="dark"
													class=""
													on:click={() => {
														goto(`/accounts/${entity.acct}`);
													}}
												>
													<span class="">{entity.acct}</span></Button
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
												{entity.domain}
											</p>
											<p class="pt-2 text-base text-left">
												{@html accountNote}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div></TableWrap
		>
	</div>
{:else}
	{#if browser}
		{redirectToPage()}
	{/if}
	<Page404>
		<svelte:fragment slot="h1">404</svelte:fragment>
		<svelte:fragment slot="paragraph">
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
				Something's missing.
			</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
				Sorry, we can't find that page. You'll find lots to explore on the toots page. Please click
				here if you are not redirected
			</p>
			<Button href="/toots" size="lg" color="red">Back to Toots</Button>
		</svelte:fragment>
	</Page404>
{/if}
