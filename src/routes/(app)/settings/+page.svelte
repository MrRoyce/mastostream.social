<script lang="ts">
	import { Section } from 'flowbite-svelte-blocks';
	import type { PageData } from './$types';
	import { Button, Heading, Input, Label, Textarea } from 'flowbite-svelte';
	import { TableWrap } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	const { user, entity } = data;

	const toastStore = getToastStore();
	let accessToken = entity.accessToken || '';

	let loadSpinner = false;

	const updateSettings: SubmitFunction = () => {
		// Before call
		loadSpinner = true;

		// After call
		return async ({ result }) => {
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
				const errorMessage: string = `Error on update settings - Status: ${status}, Type: ${type}, Message: ${message}.`;
				console.error(errorMessage);

				const t: ToastSettings = {
					background: 'variant-filled-error',
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

<TableWrap>
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<Heading class="pb-2">Your Settings</Heading>
			<form
				class="flex flex-col space-y-6"
				method="POST"
				action="?/update"
				use:enhance={updateSettings}
			>
				<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
					<div class="sm:col-span-2">
						<Label for="access_token" class="mb-2">Mastodon Access Token</Label>
						<Input
							bind:value={accessToken}
							type="text"
							maxlength="30"
							id="accessToken"
							name="accessToken"
							placeholder=""
							required
						/>
					</div>
					<Button type="submit" class="w-32">Update Settings</Button>
				</div>
			</form>
		</div>
	</div>
</TableWrap>
