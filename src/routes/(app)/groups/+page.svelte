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
	let loadSpinner = false;
	let groupObject: GroupReference;

	const toastStore = getToastStore();

	const { user, groups } = data;

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

	let moderator = '0';
	let creator = '0';

	const getData = (appdata: GroupReference, group) => {
		updateModal = true;
		groupObject = appdata;
		groupObject.id = group.id;
		formattedDate = formatTheDate(groupObject.joined);
		moderator = groupObject.moderator ? '1' : '0';
		creator = groupObject.creator ? '1' : '0';
		console.log('groupObject', groupObject);
	};

	const updateGroup: SubmitFunction = () => {
		// Before call
		updateModal = false;
		loadSpinner = true;

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
			loadSpinner = false;
		};
	};
</script>

<TableWrap>
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class="dark:bg-gray-900 p-4">
			<Heading tag="h3">Your Groups</Heading>
		</div>
		<div class="hidden-on-mobile">
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
							{#each group.references as reference}
								<TableBodyRow
									class="border-none cursor-pointer"
									on:click={() => getData(reference, group)}
								>
									<TableBodyCell>{reference.name}</TableBodyCell>
									<TableBodyCell
										>{formatDate({
											seconds: reference.joined.seconds,
											nanoseconds: reference.joined.nanoseconds
										})}</TableBodyCell
									>
									<TableBodyCell>{reference.creator}</TableBodyCell>
									<TableBodyCell>{reference.moderator}</TableBodyCell>
								</TableBodyRow>
							{/each}
						{/each}
					</TableBody>
				</Table>
			</div>
		</div>
	</div>
</TableWrap>

<Section classSection="h-96 {!updateModal ? 'hidden' : ''}">
	<Modal bind:open={updateModal} class="min-w-full">
		<form class="flex flex-col space-y-6" method="POST" action="?/update" use:enhance={updateGroup}>
			<div class="grid gap-4 mb-4 sm:grid-cols-2">
				<div>
					<Label for="groupName" class="mb-2">Name</Label>
					<Input type="text" bind:value={groupObject.name} name="groupName" disabled />
				</div>
				<div>
					<Label for="joined" class="mb-2">Joined</Label>
					<Input type="text" id="joined" name="joined" bind:value={formattedDate} disabled />
				</div>
				<div class="sm:col-span-2">
					<Toggle name="creator" checked={groupObject.creator} bind:value={creator} disabled
						>Group Creator?</Toggle
					>
				</div>
				<div class="sm:col-span-2">
					<Toggle name="moderator" checked={groupObject.moderator} bind:value={moderator}
						>Moderator?</Toggle
					>
				</div>
				<input type="hidden" name="groupId" bind:value={groupObject.id} />
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
