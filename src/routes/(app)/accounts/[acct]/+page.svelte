<script lang="ts">
	import { t } from '$lib/translations';
	import { browser, dev } from '$app/environment';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import type { PageData } from '../$types';
	import {
		AccountButtons,
		MobileTootViewWrapper,
		OwnersTootTable,
		Page404,
		TableWrap
	} from '$lib/components';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Input,
		Label,
		Li,
		List,
		Modal,
		Textarea
	} from 'flowbite-svelte';
	import { formatText, updateButtonClass } from '$lib/utils';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';

	export let data: PageData;
	const entity = data.entity || {};
	const toots = data.toots || [];
	const user = data.user;
	let uid = user && user.uid ? user.uid : '';

	let acctName = '';
	let acctInstance = '';
	let accountModal = false;
	let messageModal = false;
	let isSubmitting = false;

	function showAccountModal() {
		accountModal = true;
		messageModal = false;
	}

	function showMessageModal() {
		accountModal = false;
		messageModal = true;
	}

	const toastStore = getToastStore();
	let loadSpinner = false;

	const sendMessage: SubmitFunction = () => {
		// Before call
		loadSpinner = true;
		messageModal = false;

		// After call
		return async ({ result }) => {
			const { type, status } = result;

			if (result.type === 'success') {
				await invalidateAll();
				const t: ToastSettings = {
					message: `Message Sent!`,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}

			if (result.type === 'failure' || result.type === 'error') {
				messageModal = false;
				const errorMessage: string = `Error on sending message - Status: ${status}, Type: ${type}`;
				//TODO log this on server
				console.error(errorMessage);
				const userErrorMessage =
					'Sorry, an error occurred sending the message.  Please check the data and try again. Please contact us if the problem continues.';

				const t: ToastSettings = {
					background: 'variant-filled-error',
					message: userErrorMessage,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}
			await applyAction(result);
			loadSpinner = false;
		};
	};

	if (entity && entity.acct) {
		[acctName, acctInstance] = entity.acct.split('@');
	}

	if (browser && dev) console.log('account entity', entity);
	if (browser && dev) console.log('account toots', toots);

	let domain: string;

	try {
		domain = new URL(entity?.url).hostname;
	} catch (error) {}

	const tableData = {
		tableHead: [
			$t('tableHeaders.safe'),
			$t('tableHeaders.created'),
			'Pics',
			'Video',
			'Audio',
			$t('tableHeaders.link')
		]
	};

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Account'
		});
	}
</script>

{#if entity && entity.url}
	<TableWrap divContainerPadding="px-4">
		<!-- Breadcrumb -->
		<div class="pl-0 pt-0 pb-4">
			<Breadcrumb aria-label={$t('aria.breadcrumbLink')}>
				<BreadcrumbItem href="/">{$t('pagelinks.dashboard')}</BreadcrumbItem>
				<BreadcrumbItem href="/accounts">{$t('pagelinks.accounts')}</BreadcrumbItem>
			</Breadcrumb>
		</div>

		<div
			class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 pt-2 px-2"
		>
			<div class=" mx-auto my-2 px-2">
				<!-- Account Profile -->
				<div class="md:flex no-wrap md:-mx-2">
					<!-- Left Side -->
					<div class="w-full md:w-3/12 md:mx-2">
						<!-- Profile Card -->
						<div class="bg-grey-900 pt-2 border-t-4 border-green-400">
							<div class="image overflow-hidden">
								<img class="h-auto w-full mx-auto" src={entity.avatar} alt="" />
							</div>
							<p class="dark:text-gray-200 font-bold text-lg pt-2 my-2">
								{entity.username}
							</p>
							<p class="text-white dark:text-gray-200 text-lg">
								<a
									rel="noopener nofollow"
									target="_blank"
									href={entity.url}
									class="inline-flex items-center hover:underline"
								>
									{domain}
									<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
								</a>
							</p>
							<!-- Account info -->
							<div class="pt-2 text-gray-200">
								<List list="none">
									<Li><span class=" text-lg">Started: </span>{entity.createdAt.split('T')[0]}</Li>
									<Li
										><span class=" text-lg"
											># Toots:
										</span>{entity.statusesCount.toLocaleString()}</Li
									>
									<Li
										><span class=" text-lg"
											>Following:
										</span>{entity.followingCount.toLocaleString()}</Li
									>
									<Li
										><span class=" text-lg"
											>Followers:
										</span>{entity.followersCount.toLocaleString()}</Li
									>
									<Li>
										<div class="justify-self-end">
											<Button
												outline={true}
												class="!p-2"
												color="green"
												on:click={() => showAccountModal()}
												><i class="fa-solid fa-share" style="color: #31c48d;" /></Button
											>
										</div>
										{#if user && user.uid}
											<!-- content here -->
											<div class="justify-self-end">
												<Button
													outline={true}
													class="!p-2"
													color="green"
													on:click={() => showMessageModal()}
													><i class="fa-solid fa-share" style="color: #31c48d;" /></Button
												>
											</div>
										{/if}
									</Li>
								</List>
							</div>
						</div>
					</div>

					<!-- Right Side -->
					<div class="w-full md:w-9/12">
						<div class="bg-grey-900 px-2 shadow-sm">
							<!-- Banner image -->
							<img src={entity.header} alt="User" />

							<!-- acct  -->
							<p class=" dark:text-gray-200 my-2">@{acctName}</p>

							<!-- Account note -->
							<div class="pb-2 overflow-ellipsis">
								{#if entity.note}
									<!-- content here -->

									{@html entity.note
										.replaceAll('</p><p>', '</p><p>&nbsp;</p><p>')
										.replaceAll('class="mention hashtag"', '')
										.replaceAll('invisible', '')
										.replaceAll('<a ', '<a class="underline text-green-400" ')}
								{/if}
							</div>

							<div class="m-2 border-t-2 border-green-400"></div>

							<!-- Account Favorites -->
							<div class="grid grid-cols-1">
								{#if entity.fields}
									<!-- content here -->

									{#each entity.fields as field}
										<div class="pt-2 dark:text-gray-200 text-lg">
											{field.name}:
										</div>
										<div class="dark:text-gray-300">
											{@html formatText(
												field.value.replaceAll(
													'class="invisible"',
													'class="font-medium hover:text-green-400 hover:underline'
												),
												'underline text-green-200'
											)}
										</div>
									{/each}
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- OwnersTootTable  -->
				<div class="my-2 text-gray-200">
					<h2 class="text-gray-200 text-lg">
						{$t('general.latestTootsFrom')}
					</h2>
					<p>{acctName}</p>

					<!-- hidden-on-mobile -->
					<div class="hidden-on-mobile">
						<OwnersTootTable {tableData} sourceData={toots} />
					</div>

					<!-- show-on-mobile view -->
					<div class="show-on-mobile">
						{#if toots}
							<!-- content here -->
							{#each toots as toot}
								<TableWrap spacing="px-0">
									<MobileTootViewWrapper {toot} showProfile={false} />
								</TableWrap>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</TableWrap>

	<!-- Share Modal -->
	<Modal title="Share this page" bind:open={accountModal} class="dark:text-gray-200" size="xs"
		><AccountButtons accountContent={entity} /></Modal
	>

	<!-- Message Modal -->
	<Modal title="Send a Message" bind:open={messageModal} class="dark:text-gray-200" size="xs">
		<div class="flex justify-center items-center">
			<form
				class="flex flex-col space-x-8"
				method="POST"
				action="?/message"
				enctype="multipart/form-data"
				use:enhance={sendMessage}
			>
				<div class="grid grid-cols-1">
					<!-- content here -->

					<div>
						<p class="mb-2">Send to: {acctName}</p>
					</div>
					<div>
						<Label for="subject" class="block mb-2">Subject</Label>
						<Input id="subject" name="subject" placeholder="Your subject..." required />
					</div>
					<div>
						<Textarea
							id="message"
							name="message"
							placeholder="Your message..."
							label="Your message"
						/>
					</div>
					<input type="hidden" name="uid" bind:value={uid} />
					<input type="hidden" name="sendTo" value={acctName} />
				</div>
				<div class="flex justify-center items-center space-x-4">
					<Button
						color="none"
						on:click={() => {
							messageModal = false;
						}}>No, cancel</Button
					>
					<Button type="submit" disabled={isSubmitting} class={updateButtonClass}
						>Send message</Button
					>
				</div>
			</form>
		</div>
	</Modal>
{:else if browser}
	<Page404 route="accounts" />
{/if}
