<script lang="ts">
	import { TableWrap } from '$lib/components';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Heading,
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import type { PageData } from './$types';
	import { t } from '$lib/translations';
	import { goto, invalidateAll } from '$app/navigation';
	import { browser, dev } from '$app/environment';
	import { Section } from 'flowbite-svelte-blocks';
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let data: PageData;
	const { user, groups, entity } = data;

	let originalGroups = JSON.stringify(entity?.groups || []);
	let { acct } = data;

	let joinModal = false;
	let groupName: any;
	let groupId: any;
	let groupMembers: any;

	const toastStore = getToastStore();
	let uid = user?.uid; // Has to be a let to be able to bind to it!
	const groupUid = user ? `${uid}_${acct}` : undefined;

	if (originalGroups.length > 0) {
		groups.forEach((group) => {
			if (group.creatorId === uid) {
				group.creator = true;
			} else if (group.groupModerators.includes(groupUid)) {
				group.moderator = true;
			} else if (group.groupMembers.includes(groupUid)) {
				group.member = true;
			}
		});
	}

	const joinGroup: SubmitFunction = () => {
		// Before calls
		joinModal = false;

		// After call
		return async ({ result }) => {
			const { type, status } = result;
			const { message } = result.data;

			if (result.type === 'success') {
				await invalidateAll();
				const t: ToastSettings = {
					message: `You have been added to the group!`,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}

			if (result.type === 'failure' || result.type === 'error') {
				const errorMessage: string = `Error on group join - Status: ${status}, Type: ${type}, Message: ${message}.`;
				console.error('errorMessage', errorMessage);
				const t: ToastSettings = {
					background: 'variant-filled-error',
					message: errorMessage,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}
			await applyAction(result);
		};
	};

	if (browser && dev) console.log('groups in allgroups', groups);
	if (browser && dev) console.log('user in allgroups', user);
	if (browser && dev) console.log('acct in allgroups', acct);

	let searchTerm = '';

	const tableData = {
		tableHead: ['Group Name', 'NSFW', 'Creator', 'Moderator', 'Member', 'Description']
	};

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'AllGroups'
		});
	}

	function processRowClick(group: { id: any; groupMembers: any; name: any }) {
		groupId = group.id;
		groupMembers = JSON.stringify(group.groupMembers || []);
		groupName = group.name;
		joinModal = !joinModal;
	}

	function searchText() {
		if (searchTerm) {
			goto(`/allgroups/${searchTerm}`);
		}
	}
</script>

<TableWrap divContainerPadding="px-4">
	<!-- Breadcrumb -->
	<div class="pl-0 pt-0 pb-4">
		<Breadcrumb aria-label="Link to Dashboard">
			<BreadcrumbItem href="/" home>{$t('pagelinks.dashboard')}</BreadcrumbItem>
			<BreadcrumbItem>{$t('pagelinks.search')}</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<!-- Search wrapper -->
	<div class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<div class=" mx-auto pt-4 px-4">
			<div class="col-span-2 mb-4">
				<Heading class="text-xl md:text-3xl lg:text-5xl  dark:text-gray-200"
					>Search Group Description</Heading
				>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<!-- search form -->
				<div class="md:col-span-2 md:col-start-1 order-first md:mb-4">
					<form class="flex items-left">
						<label for="entity-search" class="sr-only">Search</label>
						<div class="relative w-full">
							<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
								<i class="fa-solid fa-magnifying-glass" />
							</div>
							<input
								type="text"
								id="entity-search"
								maxlength="50"
								name="entity-search"
								bind:value={searchTerm}
								class="bg-gray-50 border border-gray-300 dark:text-gray-200 text-sm focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-green-500 dark:focus:border-green-500"
								placeholder={$t('search.anyTerm')}
								required
							/>
						</div>
						<Button
							color="green"
							on:click={searchText}
							class="rounded-none py-2.5 px-3.5  ms-2 text-sm font-medium dark:text-gray-200"
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
						</Button>
					</form>
				</div>
			</div>
			<div class="hidden-on-mobile">
				<Table
					name="advancedTable"
					classSection="bg-gray-50 dark:bg-gray-900 sm:p-5"
					hoverable={true}
				>
					<TableHead>
						{#each tableData.tableHead as tableHead}
							<TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
								>{tableHead}</TableHeadCell
							>
						{/each}
					</TableHead>
					<TableBody>
						{#each groups as group}
							<TableBodyRow
								class="border-none cursor-pointer"
								on:click={() => processRowClick(group)}
							>
								<TableBodyCell>
									{group.name}
								</TableBodyCell>
								<TableBodyCell>
									{group.mature}
								</TableBodyCell>
								<TableBodyCell>{group.creator ? 'Yes' : 'No'}</TableBodyCell>
								<TableBodyCell>{group.moderator ? 'Yes' : 'No'}</TableBodyCell>
								<TableBodyCell>{group.member ? 'Yes' : 'No'}</TableBodyCell>
								<TableBodyCell>
									{group.description}
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
			<div class="show-on-mobile">
				{#each groups as item}{/each}
			</div>
		</div>
	</div>
</TableWrap>

<Section classSection="h-96 {!joinModal ? 'hidden' : ''}">
	<Modal bind:open={joinModal} class="min-w-full">
		<form class="flex flex-col space-y-6" method="POST" action="?/join" use:enhance={joinGroup}>
			<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
				<div class="sm:col-span-2">
					<p class="mb-2">Join {groupName}</p>
				</div>

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
					Join Group
				</Button>
				<input type="hidden" name="uid" bind:value={uid} />
				<input type="hidden" name="groupId" bind:value={groupId} />
				<input type="hidden" name="groupName" bind:value={groupName} />
				<input type="hidden" name="acct" bind:value={acct} />
				<input type="hidden" name="originalGroups" bind:value={originalGroups} />
				<input type="hidden" name="groupMembers" bind:value={groupMembers} />
			</div>
		</form>
	</Modal>
</Section>
