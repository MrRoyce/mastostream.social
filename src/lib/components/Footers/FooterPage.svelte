<script>
	import '@selemondev/svelte-marquee/dist/style.css';
	import MastodonWhite from '$lib/components/icons/mastodon-wordmark-white-text.svg';
	import PeertubeBrand from '$lib/components/icons/peertube-brand.svg';
	import FunkwhaleBrand from '$lib/components/icons/Funkwhalelogo.svg';
	import PixelfedBrand from '$lib/components/icons/pixelfed-full-color.svg';
	import MobilizonBrand from '$lib/components/icons/mobilizonlogo.svg';
	import EFFBrand from '$lib/components/icons/EFF-logo-lockup-reverse.svg';
	import { Card } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import Marqueeck from '@arisbh/marqueeck';
	const sites = [
		{
			name: 'Mastodon',
			text: 'Social Networking thats not for sale',
			image: MastodonWhite,
			url: 'https://joinmastodon.org/'
		},
		{
			name: 'Peertube',
			text: "An alternative to Big Tech's video platforms",
			image: PeertubeBrand,
			url: 'https://joinpeertube.org/'
		},
		{
			name: 'Funkwhale',
			text: 'A platform for all your audio',
			image: FunkwhaleBrand,
			url: 'https://www.funkwhale.audio/'
		},
		{
			name: 'Pixelfed',
			text: 'Explore + Share beautiful photos and videos.',
			image: PixelfedBrand,
			url: 'https://pixelfed.org/'
		},
		{
			name: 'Mobilizon',
			text: 'Gather ⋅ Organize ⋅ Mobilize',
			image: MobilizonBrand,
			url: 'https://joinmobilizon.org/en/'
		},
		{
			name: 'Electronic Frontier Foundation',
			text: 'The leading nonprofit defending digital privacy, free speech, and innovation.',
			image: EFFBrand,
			url: 'https://www.eff.org/'
		}
	];
</script>

<Marqueeck class="py-4  motion-reduce:overflow-auto">
	{#each sites as site}
		<Card class="dark:bg-gray-900">
			<img class=" w-10 h-auto max-w-xs mr-4" src={site.image} alt="Fediverse site" />
			<a href={site.url} target="_blank">
				<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-200">
					{site.name}
				</h5>
			</a>
			<p class="mb-3 font-normal text-gray-500 dark:text-gray-400">{site.text}</p>
			<a href={site.url} class="inline-flex items-center text-primary-600 hover:underline">
				{site.name}
				<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
			</a>
		</Card>
	{/each}
</Marqueeck>
