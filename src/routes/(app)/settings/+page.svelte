<script lang="ts">
	import type { PageData } from './$types';
	import { Button, Heading, Input, Label, Modal } from 'flowbite-svelte';
	import { Loading, TableWrap } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { dev } from '$app/environment';
	import { v4 as uuid } from 'uuid';

	export let form;

	let settingsType = '';
	let settingsModal = false;
	let pictureModal = false;

	const updateButtonClass =
		'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-600 focus:outline-none bg-white hover:text-green-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200';

	export let data: PageData;
	const { user, entity } = data;

	const toastStore = getToastStore();

	let accessToken: string;
	let acct: string;
	let instance: string;
	let photoURL: string;

	let isSubmitting = false;
	let uploadComplete = false;
	let files = [];
	let errors = { files: null };
	let downdloadUrl = '';
	$: filename = files.length > 0 ? files[0].name : '';

	({ accessToken, acct, instance, photoURL } = entity);
	const origAccessToken = accessToken;
	const origInstance = instance;
	const origAcct = acct;

	const modalSettingsClass = 'mt-1 max-w-2xl text-base sm:text-lg md:text-2xl text-gray-200';
	const modalDivClass = 'pb-1 sm:grid grid-cols-1 md:grid-cols-3 sm:gap-4 sm:px-6';
	const modalDtClass = 'md:text-right text-base lg:text-lg text-gray-200';
	const modalDdClass = 'mt-1 text-gray-300 sm:mt-0 sm:col-span-2';

	function resetForm() {
		files = [];
		errors = { files: null };
	}

	const handleChange = (event) => {
		errors = { files: null };
		files = event.target.files;
	};

	function cancelSettings() {
		accessToken = origAccessToken;
		instance = origInstance;
		acct = origAcct;
		settingsModal = false;
		pictureModal = false;
	}

	let modalTitle: string;

	function showModal(type: string) {
		settingsType = type;
		modalTitle = `Update ${settingsType} settings.`;
		settingsModal = type === 'mastodon' ? true : false;
		pictureModal = type === 'picture' ? true : false;
	}

	let loadSpinner = false;

	const updateSettings: SubmitFunction = () => {
		// Before call
		loadSpinner = true;

		// After call
		return async ({ result }) => {
			const { type, status } = result;

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
				pictureModal = false;
				const errorMessage: string = `Error on update settings - Status: ${status}, Type: ${type}`;
				console.error(errorMessage);
				const userErrorMessage =
					'Sorry, we are not able to update your settings.  Please check the data and try again. Please contact us if the problem continues.';

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

	// Picture upload handler
	const handleSubmit = async () => {
		try {
			if (files.length === 0) {
				errors.files = 'Select a file to upload first';
				return;
			}

			isSubmitting = true;
			const { name: key, type } = files[0];
			const bbPrefix = `https://utoots-user-images.s3.us-west-004.backblazeb2.com/`;
			const bbKey = `${uuid()}-${key}`;
			const backblazeURL = `${bbPrefix}${bbKey}`;

			// get signed upload URL
			const response = await fetch('/api/presigned-urls', {
				method: 'POST',
				credentials: 'omit',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ key: bbKey })
			});
			const json = await response.json();
			const { readSignedUrl, writeSignedUrl } = json;
			downdloadUrl = readSignedUrl;

			const devProxyPrefix = dev ? 'https://nameless-stream-31297-c52892a66e07.herokuapp.com/' : '';

			// Upload file
			const reader = new FileReader();
			reader.onloadend = async () => {
				const writeResponse = await fetch(`${devProxyPrefix}${writeSignedUrl}`, {
					method: 'PUT',
					body: reader.result,
					headers: {
						'Content-Type': type
					}
				});
				uploadComplete = true;
				isSubmitting = false;

				// Update the database with the new url
				const picResponse = await fetch('/api/picture', {
					method: 'POST',
					credentials: 'omit',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ backblazeURL, uid: user.uid })
				});
			};

			// Read the file into the buffer
			reader.readAsArrayBuffer(files[0]);
		} catch (error) {
			console.error(`Error in handleSubmit on / route: ${error}`);
		}
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
									on:click={() => showModal('picture')}
									class="rounded-none underline  italic text-sm font-medium dark:text-gray-200"
									><span class="sr-only">Update Account Picture</span>Update Account Picture
								</Button>
							</dd>
						</div>
						<div class={modalDivClass}>
							<dt class={modalDtClass}>Account Picture</dt>
							<dd class={modalDdClass}>
								{#if photoURL}
									<img id="users-picture" height="48" src={photoURL} alt="User" />
								{:else}
									<i class={'fas fa-user-secret fa-5x'}></i>
								{/if}
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
				action="?/{settingsType}"
				enctype="multipart/form-data"
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
								maxlength="50"
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
					{/if}
					<input type="hidden" name="type" value={settingsType} />
					<input type="hidden" name="acct" value={acct} />
				</div>
				<div class="flex justify-center items-center space-x-4">
					<Button color="none" on:click={cancelSettings}>No, cancel</Button>
					<Button type="submit" disabled={isSubmitting} class={updateButtonClass}
						>Yes, update the settings</Button
					>
				</div>
			</form>
		</div>
	</Modal>

	<Modal title={modalTitle} bind:open={pictureModal} autoclose={false} size="sm" class="w-full">
		<div class="flex justify-center items-center">
			<form class="" on:submit|preventDefault={handleSubmit}>
				<div class="">
					{#if uploadComplete}
						<section class="upload-complete">
							<h2 class="heading">Upload complete</h2>
							<p class="filename">
								Download link: <a aria-label={`Download ${filename}`} href={downdloadUrl}
									>{filename}</a
								>
							</p>
							<div class="button-container">
								<button
									class="another-upload-button"
									on:click={() => {
										uploadComplete = false;
										resetForm();
									}}>Upload another file</button
								>
							</div>
						</section>
					{:else if !uploadComplete}
						<div class="file-input-container">
							<Label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
								<span class="screen-reader-text">Find a file to upload</span>
								Upload file</Label
							>
							<input
								id="file"
								aria-invalid={errors.files != null}
								aria-describedby={errors.files != null ? 'files-error' : 'file_input_help'}
								type="file"
								class="block w-full rounded-none text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
								formenctype="multipart/form-data"
								accept="image/*"
								title="File"
								on:change={handleChange}
							/>
							<p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
								SVG, PNG, JPG or GIF (MAX. 800x400px).
							</p>
						</div>
					{/if}
				</div>
				<div class="flex justify-center items-center space-x-4">
					<div class="button-container">
						<Button color="none" on:click={cancelSettings}>No, cancel</Button>
					</div>
					<div class="button-container">
						<Button type="submit" disabled={isSubmitting} class={updateButtonClass}
							>Upload picture</Button
						>
					</div>
				</div>
			</form>
		</div>
	</Modal>
{/if}
