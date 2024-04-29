<script lang="ts">
	import { TableWrap } from '$lib/components';
	import {
		Button,
		Heading,
		Input,
		Label,
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Textarea,
		Toggle
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';
	import { Section } from 'flowbite-svelte-blocks';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, enhance } from '$app/forms';

	export let data: PageData;

	let updateModal = false;
	let addModal = false;
	let groupObject: GroupReference;

	const toastStore = getToastStore();

	const { user, entity } = data;
	let { groups } = data;
	let originalGroups = JSON.stringify(groups);

	const tableData = {
		tableHead: ['Name', 'Joined', 'Creator', 'Moderator']
	};

	function formatTheDate(date: { seconds: any; nanoseconds: any }) {
		return formatDate({
			seconds: date.seconds,
			nanoseconds: date.nanoseconds
		});
	}

	let formattedDate: string;

	let moderator = false;
	let creator = false;
	let moderatorString = '0';
	let creatorString = '0';
	let matureString = '';
	let visibilityString = '';

	const getData = (appdata: GroupReference) => {
		updateModal = true;
		groupObject = appdata;
		formattedDate = formatTheDate(groupObject.joined);
		moderator = groupObject.moderator ? true : false;
		moderatorString = groupObject.moderator ? '1' : '0';
		creator = groupObject.creator ? true : false;
		creatorString = groupObject.creator ? '1' : '0';
	};

	const addGroup: SubmitFunction = () => {
		// Before calls
		addModal = false;

		// After call
		return async ({ result }) => {
			const { type, status } = result;
			const { message } = result.data;

			if (result.type === 'success') {
				await invalidateAll();
				const t: ToastSettings = {
					message: `Group added!`,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}

			if (result.type === 'failure' || result.type === 'error') {
				const errorMessage: string = `Error on add - Status: ${status}, Type: ${type}, Message: ${message}.`;
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

	const updateGroup: SubmitFunction = () => {
		// Before call
		updateModal = false;

		// After call
		return async ({ result }) => {
			const { type, status } = result;
			const { message } = result.data;

			if (result.type === 'success') {
				await invalidateAll();
				const t: ToastSettings = {
					message: `Group updated!`,
					hideDismiss: true
				};
				toastStore.trigger(t);
			}

			if (result.type === 'failure' || result.type === 'error') {
				const errorMessage: string = `Error on update - Status: ${status}, Type: ${type}, Message: ${message}.`;
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
</script>

<TableWrap divContainerPadding="px-4">
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class="dark:bg-gray-900 p-4">
			<div class="grid grid-cols-2 gap-4">
				<Heading tag="h3">Your Groups</Heading>
				<Button
					class="max-w-xs"
					color="light"
					on:click={() => {
						addModal = !addModal;
					}}>Add Group</Button
				>
			</div>
			<div class="mt-4">
				<Table
					name="advancedTable"
					classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
					hoverable={true}
				>
					<TableHead>
						{#each tableData.tableHead as tableHead}
							<TableHeadCell class="text-center " padding="px-4 py-3" scope="col"
								>{tableHead}</TableHeadCell
							>
						{/each}
					</TableHead>
					<TableBody>
						{#each groups as group}
							<TableBodyRow class="border-none cursor-pointer" on:click={() => getData(group)}>
								<TableBodyCell>{group.name}</TableBodyCell>
								<TableBodyCell
									>{formatDate({
										seconds: group.joined.seconds,
										nanoseconds: group.joined.nanoseconds
									})}</TableBodyCell
								>
								<TableBodyCell bind:value={group.creator}>{group.creator}</TableBodyCell>
								<TableBodyCell bind:value={group.moderator}>{group.moderator}</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		</div>
	</div></TableWrap
>

<Section classSection="h-96 {!updateModal ? 'hidden' : ''}">
	<Modal bind:open={updateModal} class="min-w-full">
		<form class="flex flex-col space-y-6" method="POST" action="?/update" use:enhance={updateGroup}>
			<div class="grid gap-4 mb-4 sm:grid-cols-2">
				<div>
					<Label for="groupName" class="mb-2">Name</Label>
					<Input type="text" bind:value={groupObject.name} name="groupName" readonly="readonly" />
				</div>
				<div>
					<Label for="joinedDate" class="mb-2">Joined</Label>
					<Input
						type="text"
						id="joinedDate"
						name="joinedDate"
						bind:value={formattedDate}
						readonly="readonly"
					/>
				</div>
				<div class="sm:col-span-2">
					<Toggle
						name="creatorField"
						checked={creator ? true : false}
						bind:value={creatorString}
						disabled>Group Creator?</Toggle
					>
				</div>
				<div class="sm:col-span-2">
					<Toggle name="moderator" checked={moderator ? true : false} bind:value={moderatorString}
						>Moderator?</Toggle
					>
				</div>
				<input type="hidden" name="creator" bind:value={creator} />
				<input type="hidden" name="originalGroups" bind:value={originalGroups} />
				<input type="hidden" name="uid" bind:value={user.uid} />
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
					Update Group
				</Button>
			</div>
		</form>
	</Modal>
</Section>

<Section classSection="h-96 {!addModal ? 'hidden' : ''}">
	<Modal bind:open={addModal} class="min-w-full">
		<form class="flex flex-col space-y-6" method="POST" action="?/add" use:enhance={addGroup}>
			<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
				<div class="sm:col-span-2">
					<Label for="groupName" class="mb-2">Group Name</Label>
					<Input type="text" name="groupName" />
				</div>
				<div class="w-full">
					<Toggle
						name="mature"
						on:click={() => {
							matureString = '1';
						}}
						bind:value={matureString}>Sensitive?</Toggle
					>
				</div>
				<div class="w-full">
					<Toggle
						name="type"
						on:click={() => {
							visibilityString = '1';
						}}
						bind:value={visibilityString}>Public?</Toggle
					>
				</div>
				<div class="sm:col-span-2">
					<Label for="description" class="mb-2">Description</Label>
					<Textarea
						id="description"
						placeholder="Your description here"
						rows="4"
						name="description"
						required
					/>
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
					Add Group
				</Button>
				<input type="hidden" name="uid" bind:value={user.uid} />
				<input type="hidden" name="acct" bind:value={entity.acct} />
			</div>
		</form>
	</Modal>
</Section>
