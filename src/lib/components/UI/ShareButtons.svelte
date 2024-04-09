<script lang="ts">
	import {
		Email,
		Facebook,
		HackerNews,
		LinkedIn,
		Pinterest,
		Reddit,
		Telegram,
		Tumblr,
		Vk,
		WhatsApp,
		X,
		Xing
	} from 'svelte-share-buttons-component';

	export let shareContent;

	const { url, title, desc, acct } = shareContent ? shareContent : { url: 0, title: 0, desc: 0 };
</script>

<p class="text-sm font-normal text-gray-500 dark:text-gray-400">
	Thanks for sharing this content. We really appreciate it!.
</p>
<p class="text-sm font-normal text-gray-500 dark:text-gray-400">
	{acct}
</p>
<p class="text-sm font-normal text-gray-500 dark:text-gray-400">
	{desc}
</p>
<div class="grid grid-rows-3 grid-cols-4 grid-flow-col gap-4">
	<div><Email subject={title} body="{desc} {url}" /></div>
	<div><HackerNews class="share-button" {title} {url} /></div>
	<div><Reddit class="share-button" {title} {url} /></div>
	<div><LinkedIn class="share-button" {url} /></div>
	<div><Tumblr class="share-button" {title} {url} caption={title} /></div>
	<div>
		<Pinterest
			class="share-button"
			{url}
			media="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/200px-Svelte_Logo.svg.png"
			description={title}
		/>
	</div>
	<div><Telegram class="share-button" text={title} {url} /></div>
	<div><Vk class="share-button" {title} {url} /></div>
	<div><WhatsApp class="share-button" text="{title} {url}" /></div>
	<div><Xing class="share-button" {title} {url} /></div>
	<div><Facebook class="share-button" quote={title} {url} /></div>
	<div>
		<X
			class="share-button"
			text={title}
			{url}
			hashtags="utoots,mastodon"
			via={acct}
			related="other,users"
		/>
	</div>
</div>
