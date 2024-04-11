<script lang="ts">
	import { Maintenance, Section } from 'flowbite-svelte-blocks';
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
		MobileTootViewWrapper,
		Page404,
		TableWrap,
		TootTable,
		YouTube
	} from '$lib/components';
	import { goto } from '$app/navigation';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';
	import { formatCreatedAt, formatImages, getBadWords, hasAdultContent } from '$lib/utils';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Toots_[id]'
		});
	}

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Pic', 'Safe', 'Type', 'Pics', 'Video', 'Audio', 'Language', 'Link']
	};

	const badWords = getBadWords();

	export let data: PageData;
	const toot = data.entity;
	const adultContent = hasAdultContent(toot.content, badWords);

	let replies: [];
	let replyTo: {};
	let card: {};
	let images: {};
	let accountNote: string;

	if (toot.acct) {
		replies = data.replies;
		replyTo = data.replyTo ? [data.replyTo] : false;
		card = data.card;
		if (browser && dev) console.log('toot', toot);
		if (browser && dev) console.log('card', card);

		images =
			toot && toot.mediaAttachments && Array.isArray(toot.mediaAttachments)
				? formatImages(toot?.mediaAttachments)
				: { audio: [], videos: [], pictures: [] };

		if (browser && dev) console.log('images', images);

		accountNote =
			toot && toot.account && toot.account.note
				? toot.account.note.replaceAll('</p><p>', '</p><br /><p>')
				: '';
	}

	$: showSensitive = false;
	const hideSensitive = () => {
		showSensitive = !showSensitive;
	};
</script>

{#if toot.acct}
	<TableWrap>
		<!-- Breadcrumb -->
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label={$t('aria.breadcrumbLink')}>
				<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem href="/toots">{$t('pagelinks.toots')}</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div
			class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
		>
			<div class="dark:bg-gray-900 p-2">
				<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
					<!-- Toot -->
					<div class="md:col-span-8 md:col-start-5 order-first md:order-last">
						<!-- Date and Sensitive Toggle Grid -->
						<div class="grid col-span-1 md:grid-cols-2">
							<!-- Created At date -->
							<div class=" pt-2 col-span-1 md:col-start-1">
								<div class="flex sm:items-center md:items-start sm:justify-center md:justify-start">
									<p class="text-base font-bold flex dark:text-gray-200">
										{formatCreatedAt(toot.createdAt)}

										<A target="_blank" href={toot.uri}
											><ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
										</A>
									</p>
								</div>
							</div>

							<!-- Toot -->
							<div class="flex items-center justify-center">
								<!-- Sensitive Toggle -->
								{#if toot.sensitive || adultContent}
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
								{/if}
							</div>
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

						{#if (toot.sensitive && !showSensitive) || (adultContent && !showSensitive)}
							<div class="pt-10">
								<Section name="maintenance">
									<Maintenance>
										<svelte:fragment slot="h1"
											>{toot.spoiler_text ||
												toot.spoilerText ||
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
							<TableWrap spacing="px-2" divContainerPadding="">
								<MobileTootViewWrapper {toot} showProfile={false} />
							</TableWrap>
						{/if}

						{#each images.videos as video}
							{#if (toot.sensitive && !showSensitive) || (adultContent && !showSensitive)}
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
								sensitive={toot.sensitive}
								{showSensitive}
								{adultContent}
							/>
						{/if}

						{#each images.audio as audio}
							<audio controls muted={false} src={audio.src}></audio>
						{/each}

						{#if card && (card.provider_name || card.title || card.description || card.image || card.url)}
							<div class="pt-4 justify-center">
								{#if (toot.sensitive && !showSensitive) || (adultContent && !showSensitive)}
									<p>Sensitive or Adult Content</p>
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
					<div class="md:col-span-4 md:col-start-1 order-last md:order-first">
						<div class="bg-grey-900 shadow-sm border-t-2 border-green-400">
							<div class=" items-top h-auto mx-auto lg:my-0">
								<div id="profile" class="w-full shadow-2xl h-fit mx-0 lg:mx-0">
									<div class="p-6 text-center lg:text-left">
										<p class="text-3xl pb-5 text-ellipsis overflow-hidden dark:text-gray-200">
											{toot.account?.displayName || toot.account?.display_name || ''}
										</p>
										<div class="image overflow-hidden pb-2">
											<img class="h-auto w-full mx-auto" src={toot.avatar} alt="" />
										</div>
										<Button
											color="dark"
											class=""
											on:click={() => {
												goto(`/accounts/${toot.acct}`);
											}}
											><p class=" text-ellipsis overflow-hidden dark:text-gray-200">
												<span class="">{toot.acct}</span>
											</p></Button
										>
										<div
											class="mx-auto lg:mx-0 w-4/5 pt-2 border-b-2 border-green-500 opacity-25 mb-2"
										></div>

										<p class="pt-2 text-base text-left overflow-hidden dark:text-gray-200">
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
{:else if browser}
	<Page404 route="toots" />
{/if}
