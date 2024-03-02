<script lang="ts">
	import { Card } from 'flowbite-svelte';

	export let cardImage: string;
	export let videoSource: string;
	export let title: string;
	export let authorName: string;
	export let imageDescription: string;
	export let url: string;
</script>

<div class="status-card expanded" role="button">
	{#if videoSource}
		<div class="">
			<a href="#!">
				{@html videoSource}
			</a>
		</div>
	{:else}
		<div class="status-card__image">
			<div class="status-card__actions" role="none">
				<div>
					<button type="button"><i class="fa fa-play"></i></button><a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Card img={cardImage}>
							<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{title}
							</h5>
							<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
								{imageDescription}
							</p>
						</Card>
					</a>
				</div>
			</div>
		</div>
	{/if}

	<a href={url} target="_blank" rel="noopener noreferrer"
		><div class="">
			<p>
				<span lang="">YouTube</span>
			</p>
			<strong {title} lang="">{title}</strong><span>
				<p>By <strong>{authorName}</strong></p>
			</span>
		</div>
	</a>
</div>
