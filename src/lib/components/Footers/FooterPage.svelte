<script>
	import { Marquee } from '@selemondev/svelte-marquee';
	import '@selemondev/svelte-marquee/dist/style.css';
	import MastodonWhite from '$lib/components/icons/mastodon-wordmark-white-text.svg';
	import PeertubeBrand from '$lib/components/icons/peertube-brand.svg';
	import FunkwhaleBrand from '$lib/components/icons/Funkwhalelogo.svg';
	import PixelfedBrand from '$lib/components/icons/pixelfed-full-color.svg';
	import MobilizonBrand from '$lib/components/icons/mobilizonlogo.svg';
	import { Button, Card } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
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
		}
	];
</script>

<Marquee pauseOnHover={true} direction="up" fade={false} reverse={true} class=" overflow-hidden">
	{#each sites as site}
		<Button
			color="dark"
			class=""
			on:click={() => {
				window.open(site.url, '_blank');
			}}
			><img class=" w-10 h-auto max-w-xs mr-4" src={site.image} alt="Fediverse site" />
			{site.text}</Button
		>
	{/each}
</Marquee>
