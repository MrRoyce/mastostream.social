<script lang="ts">
	import { goto } from '$app/navigation';
	import { ShareButtons, TootContent, TootMeta } from '$lib/components';
	import { formatCreatedAt, truncateHTML } from '$lib/utils';
	import { Button, Modal } from 'flowbite-svelte';

	export let toot;
	export let limit = 5000;
	export let showProfile = true;

	const url = `/toots/${toot.accountId}_${toot.tootId}`;

	let karmaCounts = {
		upCount: 0,
		downCount: 0,
		commentsCount: 0
	};

	if (toot.acct) {
		karmaCounts = {
			upCount: toot.upCount || 0,
			downCount: toot.downCount || 0,
			commentsCount: toot.commentsCount || 0
		};
	}

	let shareModal = false;

	const shareContent = {
		acct: '',
		desc: '',
		title: '',
		url: ''
	};

	function showShareModal(toot) {
		shareContent.acct = toot.acct;
		shareContent.desc = truncateHTML(toot.content, 200);
		shareContent.title = `Found this on utoots.com from : ${toot.acct}`;
		shareContent.url = `https://utoots.com/toots/${toot.accountId}_${toot.tootId}`;
		shareModal = true;
	}
</script>

<div>
	<!-- Content -->
	<a href={url}>
		<TootContent {toot} {limit} />
	</a>
	<!-- Date and Share -->
	<div class="grid grid-cols-1">
		<div class="text-gray-300"><a href={url}>{toot.acct}</a></div>
		<div class="grid grid-cols-2">
			<div class="text-gray-400">
				<a href={url}>
					{toot.createdAt?.includes('T') ? formatCreatedAt(toot.createdAt) : toot.createdAt}</a
				>
			</div>
			<div class="justify-self-end">
				<Button outline={true} class="!p-2" color="green" on:click={() => showShareModal(toot)}
					><i class="fa-solid fa-share" style="color: #31c48d;" /></Button
				>
			</div>
		</div>
	</div>

	<!-- Metadata -->
	<a href={url}>
		<TootMeta counts={toot.mediaAttachementCounts} {karmaCounts} />
	</a>

	<!-- Profile -->
	{#if showProfile}
		<div class="md:col-span-1 md:col-start-1 order-last md:order-first">
			<div class="bg-grey-900 shadow-sm border-t-4 border-green-400">
				<div class=" items-top h-auto mx-auto lg:my-0">
					<div id="profile" class="w-full shadow-2xl h-fit mx-0 lg:mx-0">
						<div class="p-6 text-center lg:text-left">
							<a href={url}>
								<p class="text-3xl pb-5 text-ellipsis overflow-hidden dark:text-gray-200">
									{toot.account?.displayName || toot.account?.display_name || ''}
								</p>
								<div class="image overflow-hidden pb-5">
									<img class="h-auto w-full mx-auto" src={toot.avatar} alt="" />
								</div>
							</a>
							<p class="pb-5 text-ellipsis overflow-hidden">
								<Button
									color="dark"
									class=""
									on:click={() => {
										goto(`/accounts/${toot.acct}`);
									}}
								>
									<span class="">{toot.acct}</span></Button
								>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<Modal title="Share this page" bind:open={shareModal} size="xs"
	><ShareButtons {shareContent} /></Modal
>
