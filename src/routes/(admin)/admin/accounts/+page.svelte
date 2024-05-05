<script lang="ts">
	import { t } from '$lib/translations';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { AdminTootTable, TableWrap } from '$lib/components';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { Button, Li, List, Modal, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { formatCreatedAt, formatText } from '$lib/utils';
	import { Section } from 'flowbite-svelte-blocks';
	import { invalidateAll } from '$app/navigation';

	const toastStore = getToastStore();

	let loading = false;
	let entity;
	let domain: string;
	let toots;
	let entityObject;
	let tootId: string;
	let deleteModal = false;
	let loadSpinner = false;

	const tableData = {
		tableHead: [
			$t('tableHeaders.safe'),
			$t('tableHeaders.created'),
			$t('tableHeaders.content'),
			$t('tableHeaders.link')
		]
	};

	const search: SubmitFunction = (input) => {
		// do something before the form submits

		return async (options) => {
			// do something after the form submits
			loading = false;
			const { data, status } = options.result;
			toots = data?.toots || [];

			entity = data?.entity || {};
			try {
				domain = new URL(entity?.url)?.hostname || '';
			} catch (error) {
				console.warn('entity', entity);
				console.warn('Error getting URL', error);
			}
		};
	};

	const delData = (appdata) => {
		console.log('data to delete', appdata);
		deleteModal = true;
		entityObject = appdata;
		tootId = `${entityObject.accountId}_${entityObject.id}`;
	};

	const deleteToot: SubmitFunction = ({}) => {
		// Before call
		loadSpinner = true;
		deleteModal = false;

		// After call
		return async ({ result }) => {
			const { type, status } = result;
			const { message } = result.data;

			if (result.type === 'success') {
				toots = toots.filter((toot) => {
					if (!(`${toot.accountId}_${toot.id}` === tootId)) {
						return toot;
					}
				});
				await invalidateAll();
				const t: ToastSettings = {
					message: `Toot deleted!`,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}

			if (result.type === 'failure' || result.type === 'error') {
				const errorMessage: string = `Error on delete - Status: ${status}, Type: ${type}, Message: ${message}.`;
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

	$: entity;
</script>

<div class="bg-gray-50 dark:bg-gray-900">
	<!-- Search field -->
	<div class="p-5">
		<form
			class="flex items-center max-w-sm mx-auto"
			method="POST"
			action="?/getToot"
			use:enhance={search}
		>
			<label for="entity-search" class="sr-only">Search</label>
			<div class="relative w-full">
				<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
					<i class="fa-solid fa-magnifying-glass" />
				</div>
				<input
					type="text"
					id="entity-search"
					name="entity-search"
					class="bg-gray-50 border border-gray-300 dark:text-gray-200 text-sm focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500 dark:focus:border-green-500"
					placeholder={$t('search.accountName')}
					required
				/>
			</div>
			<button
				type="submit"
				class="p-2.5 ms-2 text-sm font-medium text-white bg-green-700 border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>
				<svg
					class="w-4 h-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 20 20"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
					/>
				</svg>
				<span class="sr-only">Search</span>
			</button>
		</form>
	</div>

	{#if entity}
		<TableWrap>
			<div
				class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-2"
			>
				<div class=" mx-auto my-2 p-2">
					<!-- Account Profile -->
					<div class="md:flex no-wrap md:-mx-2">
						<!-- Left Side -->
						<div class="w-full md:w-3/12 md:mx-2">
							<!-- Profile Card -->
							<div class="bg-grey-900 p-2 border-t-4 border-green-400">
								<div class="image overflow-hidden">
									<img class="h-auto w-full mx-auto" src={entity.avatar} alt="" />
								</div>
								<span class="ml-auto"
									><span
										class="{entity.locked
											? 'bg-red-500'
											: 'bg-green-500'} py-1 px-2 rounded text-white text-sm"
										>{entity.locked ? 'Locked' : 'Public'}</span
									></span
								>
								<div class="dark:text-gray-200 font-bold text-xl leading-8 my-1">
									{entity.username}
								</div>
								<h3 class="text-white dark:text-gray-200 font-lg">
									<a
										rel="noopener nofollow"
										target="_blank"
										href={entity.url}
										class="inline-flex items-center hover:underline"
									>
										{domain}
										<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
									</a>
								</h3>
								<!-- Account info -->
								<div class="pt-2 text-gray-200">
									<List list="none">
										<Li class="my-1"
											><span class=" text-lg">Started: </span>{entity.createdAt.split('T')[0]}</Li
										>
										<Li class="my-1"
											><span class=" text-lg"
												># Toots:
											</span>{entity.statusesCount.toLocaleString()}</Li
										>
										<Li class="my-1"
											><span class=" text-lg"
												>Following:
											</span>{entity.followingCount.toLocaleString()}</Li
										>
										<Li class="my-1"
											><span class=" text-lg"
												>Followers:
											</span>{entity.followersCount.toLocaleString()}</Li
										>
									</List>
								</div>
							</div>
						</div>
						<!-- Right Side -->
						<div class="w-full md:w-9/12 mx-2">
							<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
								<div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
									<div class="text-gray-700">
										<img src={entity.header} alt="User" />
									</div>
								</div>
								<h3 class="mt-5">
									<span class="pt-10 ml-auto text-gray-200 my-1">@{entity.acct}</span>
								</h3>
								<div class="mt-7 text-gray-200">
									<p>
										{@html formatText(
											entity.note
												.replaceAll('</p><p>', '</p><br /><p>')
												.replaceAll(
													'class="invisible"',
													'class="font-medium hover:text-blue-300 hover:underline'
												)
												.replaceAll('class="mention hashtag"', ''),
											'underline text-green-200'
										)}
									</p>
								</div>

								<TableBody>
									{#each entity.fields as field}
										<TableBodyRow>
											<TableBodyCell class="pb-0">{field.name.toUpperCase()}:</TableBodyCell>
										</TableBodyRow>
										<TableBodyRow>
											<TableBodyCell class="whitespace-normal break-words py-0">
												<span class="px-10"
													>{@html formatText(
														field.value.replaceAll(
															'class="invisible"',
															'class="font-medium hover:text-blue-300 hover:underline'
														),
														'underline text-green-200'
													)}</span
												></TableBodyCell
											>
										</TableBodyRow>
									{/each}
								</TableBody>
							</div>
						</div>
					</div>
					<div class="my-4 text-white">
						<h2 class="text-gray-200 font-bold text-xl leading-8 my-1 mb-4">
							{$t('general.latestTootsFrom')}
							{entity.acct}:
						</h2>

						<AdminTootTable {tableData} {delData} sourceData={toots} />
					</div>
				</div>
			</div>
		</TableWrap>
	{/if}
</div>

<Section classSection="h-96 {!deleteModal ? 'hidden' : ''}">
	<Modal size="sm" bind:open={deleteModal} class="min-w-full">
		<form
			class="flex flex-col space-y-6"
			method="POST"
			action="?/deleteToot"
			use:enhance={deleteToot}
		>
			<h3 class="mb-4 text-xl font-medium text-gray-900">Delete Toot</h3>
			<p class="text-base text-gray-900">
				Are you sure you want to delete <br />Toot: {tootId}<br />Account {entityObject.acct}?
				<br />Created: {formatCreatedAt(entityObject.createdAt)}?
			</p>
			<div class="grid gap-4 mb-4 sm:grid-cols-2">
				<input type="hidden" name="acct" value={entityObject.acct} />
				<input type="hidden" name="domain" value={entityObject.domain} />
				<input type="hidden" name="id" value={entityObject.id} />
				<input type="hidden" name="language" value={entityObject.language} />
				<input type="hidden" name="tags" value={entityObject.tags} />
				<input type="hidden" name="tootId" value={tootId} />

				<button
					type="button"
					on:click={() => (deleteModal = false)}
					class="py-2 px-3 text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
				>
					No, cancel
				</button>
				<Button type="submit" class="w-52">
					<svg
						class="mr-1 -ml-1 w-6 h-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
							clip-rule="evenodd"
						/></svg
					>
					Yes, I'm sure
				</Button>
			</div>
		</form>
	</Modal>
</Section>
