<script lang="ts">
	import { goto } from '$app/navigation';
	import { TootContent, TootMeta } from '$lib/components';
	import { truncateHTML } from '$lib/utils';
	import { Button } from 'flowbite-svelte';

	export let toot;

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
	<TootContent {toot} />

	<!-- Date and Share -->
	<div class="grid grid-cols-2">
		<div>
			{toot.createdAt?.includes('T') ? formatCreatedAt(toot.createdAt) : toot.createdAt}
		</div>
		<div class="justify-self-end">
			<Button outline={true} class="!p-2" color="green" on:click={() => showShareModal(toot)}
				><i class="fa-solid fa-share" style="color: #31c48d;" /></Button
			>
		</div>
	</div>
	<!-- Metadata -->
	<TootMeta counts={toot.mediaAttachementCounts} {karmaCounts} />
	<!-- Profile -->
	<div class="md:col-span-1 md:col-start-1 order-last md:order-first">
		<div class="bg-grey-900 shadow-sm border-t-4 border-green-400">
			<div class=" items-top h-auto mx-auto lg:my-0">
				<div id="profile" class="w-full shadow-2xl h-fit mx-0 lg:mx-0">
					<div class="p-6 text-center lg:text-left">
						<p class="text-3xl pb-5 text-ellipsis overflow-hidden dark:text-gray-200">
							{toot.account?.displayName || toot.account?.display_name || ''}
						</p>
						<div class="image overflow-hidden pb-5">
							<img class="h-auto w-full mx-auto" src={toot.avatar} alt="" />
						</div>
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
						<div class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>

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
							{toot.domain}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
