<script lang="ts">
	import type { PageData } from './$types';
	import { Button, Heading, Input, Label, Modal } from 'flowbite-svelte';
	import { Loading, TableWrap } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let settingsType = '';
	let settingsModal = false;

	const updateButtonClass =
		'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-600 focus:outline-none bg-white hover:text-green-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200';

	export let data: PageData;
	const { user, entity } = data;

	const toastStore = getToastStore();

	let accessToken: string;
	let instance: string;
	let acct: string;

	({ accessToken, acct, instance } = entity);
	const origAccessToken = accessToken;
	const origInstance = instance;
	const origAcct = acct;

	const modalSettingsClass = 'mt-1 max-w-2xl text-base sm:text-lg md:text-2xl text-gray-200';
	const modalDivClass = 'pb-1 sm:grid grid-cols-1 md:grid-cols-3 sm:gap-4 sm:px-6';
	const modalDtClass = 'md:text-right text-base lg:text-lg text-gray-200';
	const modalDdClass = 'mt-1 text-gray-300 sm:mt-0 sm:col-span-2';

	function cancelSettings() {
		accessToken = origAccessToken;
		instance = origInstance;
		acct = origAcct;
		settingsModal = false;
	}

	let modalTitle: string;

	function showModal(type: string) {
		settingsType = type;
		modalTitle = `Update ${settingsType} settings.`;
		settingsModal = true;
	}

	let loadSpinner = false;

	const updateSettings: SubmitFunction = () => {
		// Before call
		loadSpinner = true;
		console.log('about to update settings');

		// After call
		return async ({ result }) => {
			console.log('after settings update');
			const { type, status } = result;
			const { message } = result.data;

			if (result.type === 'success') {
				await invalidateAll();
				const t: ToastSettings = {
					message: `Settings updated!`,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}

			if (result.type === 'failure' || result.type === 'error') {
				cancelSettings();
				settingsModal = false;
				const errorMessage: string = `Error on update settings - Status: ${status}, Type: ${type}, Message: ${message}.`;
				console.error(errorMessage);
				const userErrorMessage =
					'Sorry, we are not able to verify that information.  Please check the data and try again!';

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
</script>

{#if loadSpinner}
	<Loading />
{:else}
	<TableWrap>
		<div
			class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
		>
			<div class="dark:bg-gray-900 p-4">
				<Heading tag="h2" class="pb-4">Your Settings</Heading>

				<!-- Mastodon Settings -->
				<div class="px-4 py-5 sm:p-0">
					<dl>
						<div class={modalDivClass}>
							<dt class={modalDtClass}>
								<p class={modalSettingsClass}>Mastdon Settings</p>
							</dt>
							<dd class={modalDdClass}>
								<Button
									color="none"
									on:click={() => showModal('mastodon')}
									class="rounded-none underline  italic text-sm font-medium dark:text-gray-200"
									><span class="sr-only">Update Mastodon Settings</span>Update Mastodon Settings
								</Button>
							</dd>
						</div>
						<div class={modalDivClass}>
							<dt class={modalDtClass}>Mastodon Account</dt>
							<dd class={modalDdClass}>{instance}</dd>
						</div>
						<div class={modalDivClass}>
							<dt class={modalDtClass}>Account</dt>
							<dd class={modalDdClass}>{acct}</dd>
						</div>
						<div class={modalDivClass}>
							<dt class={modalDtClass}>Access Token</dt>
							<dd class={modalDdClass}>{accessToken}</dd>
						</div>
					</dl>
				</div>

				<!-- Account Settings -->
				<div class="mt-4 px-4 py-5 sm:p-0">
					<dl>
						<div class={modalDivClass}>
							<dt class={modalDtClass}>
								<p class={modalSettingsClass}>Account Settings</p>
							</dt>
							<dd class={modalDdClass}>
								<Button
									color="none"
									on:click={() => showModal('account')}
									class="rounded-none underline  italic text-sm font-medium dark:text-gray-200"
									><span class="sr-only">Update Account Settings</span>Update Account Settings
								</Button>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	</TableWrap>

	<!-- Settings update modal -->
	<Modal title={modalTitle} bind:open={settingsModal} autoclose={false} size="sm" class="w-full">
		<div class="flex justify-center items-center">
			<form
				class="flex flex-col space-x-8"
				method="POST"
				action="?/update"
				use:enhance={updateSettings}
			>
				<div class="grid grid-cols-1">
					{#if settingsType === 'mastodon'}
						<!-- content here -->

						<!-- Mastodon fields -->
						<Label class="space-x-4 pt-4 pb-2">
							<span>Mastodon Website Name</span>
							<Input
								bind:value={instance}
								type="text"
								maxlength="50"
								id="instance"
								name="instance"
								placeholder="mastodon.world"
								required
							/>
						</Label>

						<Label class="space-x-4 pt-4 pb-2">
							<span>Your account name</span>
							<Input
								bind:value={acct}
								type="text"
								maxlength="30"
								id="acct"
								name="acct"
								placeholder="you@mastodon.world"
								required
							/>
						</Label>

						<Label class="space-x-4 pt-4 pb-2">
							<span>Mastodon Access Token</span>
							<Input
								bind:value={accessToken}
								type="text"
								maxlength="50"
								id="accessToken"
								name="accessToken"
								placeholder="d6FM_khFhxJxKj9eOjKH8c9tuZWAPs5rxU8y92gcbI8"
								required
							/>
						</Label>
					{:else if settingsType === 'account'}
						<p>Coming soon</p>
					{/if}
					<input type="hidden" name="type" value={settingsType} />
				</div>
				<div class="flex justify-center items-center space-x-4">
					<Button color="none" on:click={cancelSettings}>No, cancel</Button>
					<Button type="submit" class={updateButtonClass}>Yes, update the settings</Button>
				</div>
			</form>
		</div>
	</Modal>
{/if}
