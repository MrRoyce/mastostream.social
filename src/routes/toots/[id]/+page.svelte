<script lang="ts">
	import { Page404 } from 'flowbite-svelte-blocks';
	import { Button, Gallery } from 'flowbite-svelte';
	import type { PageData } from '../$types';
	import { formatText } from '$lib/utils/formatText';
	import { formatImages } from '$lib/utils/formatImages';

	export let data: PageData;
	const entity = data.entity;
	const images =
		entity && entity.mediaAttachments && Array.isArray(entity.mediaAttachments)
			? formatImages(entity?.mediaAttachments)
			: { videos: [], images: [] };
</script>

{#if entity.acct}
	<div class="dark:bg-gray-800">
		<div class="container mx-auto my-5 p-5">
			<div class="md:flex no-wrap md:-mx-2">
				<div class="w-full mx-2">
					<div class="bg-grey-900 p-3 shadow-sm">
						<div class="mt-7 text-gray-200">
							<div
								class="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0"
							>
								<!--Main Col-->
								<div id="profile" class="w-full lg:w-3/5 shadow-2xl opacity-75 mx-6 lg:mx-0">
									<div class="p-4 md:p-12 text-center lg:text-left">
										<!-- Image for mobile view-->
										<div
											class="block rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
											style="background-image: url('{entity.avatar}')"
										></div>

										<h1 class="text-3xl font-bold pt-8 lg:pt-0">{entity.acct}</h1>
										<div
											class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"
										></div>
										<p
											class="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"
										>
											<svg
												class="h-4 fill-current text-green-700 pr-4"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
											>
												<path
													d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z"
												/>
											</svg>
											{entity.createdAt}
										</p>
										<p
											class="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start"
										>
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
										<p class="pt-8 text-sm">
											{@html formatText(
												entity.content
													.replaceAll('</p><p>', '</p><br /><p>')
													.replaceAll(
														'class="invisible"',
														'class="font-medium hover:text-blue-300 hover:underline'
													),
												'underline text-green-200'
											)}
										</p>
										<div class="mt-6">
											<Gallery class="gap-2 grid-cols-2" items={images.images} />
										</div>
										{#each images.videos as video}
											<video
												class="h-80"
												controls
												src={video.src}
												poster={video.previewUrl}
												preload="none"
												role="button"
												tabindex="0"
												aria-label={video.description}
												title={video.description}
												lang={video.language}
												volume="1"
												style="width: 100%;"
											></video>
										{/each}

										<div class="pt-12 pb-8">
											<a target="_blank" class="toot-btn" href={entity.uri}>View toot ...</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
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

<style>
	.toot-btn {
		background-color: #199319;
		color: white;
		padding: 15px 25px;
		text-decoration: none;
	}

	.toot-btn:hover {
		background-color: #223094;
	}
</style>
