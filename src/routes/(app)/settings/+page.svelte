<script lang="ts">
	import type { PageData } from './$types';
	import { Heading, Input } from 'flowbite-svelte';
	import { Loading, TableWrap } from '$lib/components';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	const updateButtonClass =
		'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white hover:text-green-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200';

	export let data: PageData;
	const { user, entity } = data;

	const toastStore = getToastStore();
	let accessToken = entity.accessToken || '';
	let instance = entity.instance || '';
	let acct = entity.acct || '';

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
		<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
			<Heading tag="h2" class="pb-4">Your Settings</Heading>
			<form
				class="flex flex-col space-y-6"
				method="POST"
				action="?/update"
				use:enhance={updateSettings}
			>
				<div class="grid gap-4 grid-cols-3">
					<div class="col-span-3"><span class="text-left"> Mastodon</span></div>

					<div class="col-span-1 col-start-2">
						<Input
							bind:value={instance}
							type="text"
							maxlength="50"
							id="instance"
							name="instance"
							placeholder="mastodon.world"
							required
						/>
					</div>
					<div></div>
					<div class="col-span-1 col-start-2">
						<Input
							bind:value={acct}
							type="text"
							maxlength="30"
							id="acct"
							name="acct"
							placeholder="you@mastodon.world"
							required
						/>
					</div>
					<div>
						<button type="submit" class={updateButtonClass}>Update Mastodon Information</button>
					</div>
					<div class="col-span-1 col-start-2">
						<Input
							bind:value={accessToken}
							type="text"
							maxlength="50"
							id="accessToken"
							name="accessToken"
							placeholder="d6FM_khFhxJxKj9eOjKH8c9tuZWAPs5rxU8y92gcbI8"
							required
						/>
					</div>
					<div></div>
				</div>
				<input type="hidden" name="type" value="mastodon" />
			</form>
		</div>
	</TableWrap>
{/if}
