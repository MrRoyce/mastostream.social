<script lang="ts">
	import { Section, Contact } from 'flowbite-svelte-blocks';
	import { Label, Input, Textarea, Button } from 'flowbite-svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import emailjs from '@emailjs/browser';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { TableWrap } from '$lib/components';
	import { t } from '$lib/translations.js';

	export let form;

	let loadSpinner = false;
	const toastStore = getToastStore();

	const sendMessageViaSDK = () => {
		if (document) {
			const templateParams = {
				name: document.getElementById('userName').value,
				email: document.getElementById('userEmail').value,
				message: document.getElementById('emailMessage').value
			};

			emailjs
				.send(
					import.meta.env.VITE_EMAILJS_SERVICE_ID,
					import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
					templateParams
				)
				.then(
					() => {
						const t: ToastSettings = {
							background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white',
							message: `Email Sent!`,
							hideDismiss: true
						};
						toastStore.trigger(t);
						// Reset form fields
						document.getElementById('emailForm').reset();
					},
					(error) => {
						const t: ToastSettings = {
							background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white',
							message: `EMail failed! ${error}`,
							hideDismiss: true
						};
						toastStore.trigger(t);
					}
				);
		}
	};

	const sendMessage: SubmitFunction = () => {
		loadSpinner = true;

		// After call to validate turnstile token
		return async ({ result }) => {
			const { type, status } = result;
			const { message } = result.data;

			if (result.type === 'success') {
				sendMessageViaSDK();
			}

			if (result.type === 'failure' || result.type === 'error') {
				const errorMessage: string = `Error on sending email: ${status}, Type: ${type}, Message: ${message}.`;
				const t: ToastSettings = {
					background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white',
					message: errorMessage,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}
			await applyAction(result);
			loadSpinner = false;
		};
	};
</script>

<TableWrap divContainerPadding="px-4">
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<Section name="contact">
			<Contact>
				<svelte:fragment slot="h2">Contact Us</svelte:fragment>
				<svelte:fragment slot="paragraph"
					>Got a technical issue? Want to send feedback about a beta feature? Need details about our
					Business plan? Let us know.</svelte:fragment
				>
				<form
					method="POST"
					action="?/sendMessage"
					use:enhance={sendMessage}
					id="emailForm"
					class="flex flex-col space-y-8"
				>
					<div>
						<Label for="userEmail" class="block mb-2">{$t('general.yourEmail')}</Label>
						<Input
							id="userEmail"
							maxlength="40"
							name="userEmail"
							placeholder={$t('general.emailPlaceholder')}
							required
						/>
					</div>
					<div>
						<Label for="userName" class="block mb-2">{$t('general.subject')}</Label>
						<Input
							id="userName"
							maxlength="50"
							name="userName"
							placeholder={$t('general.username')}
							required
						/>
					</div>
					<div>
						<Textarea
							id="emailMessage"
							name="emailMessage"
							placeholder="Leave a comment..."
							label="Your message"
							required
						/>
					</div>
					<Button type="submit"
						><svg
							class="mr-1 -ml-1 w-6 h-6"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
								clip-rule="evenodd"
							/></svg
						>Send message</Button
					>
					<Turnstile siteKey={PUBLIC_TURNSTILE_SITE_KEY} theme="dark" />
				</form>
			</Contact>
		</Section>
	</div>
</TableWrap>
