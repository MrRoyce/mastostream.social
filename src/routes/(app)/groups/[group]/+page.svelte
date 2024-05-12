<script lang="ts">
	import { TableWrap } from '$lib/components';
	import { onMount } from 'svelte';
	import { createUser, sendMessage } from '$lib/socket';
	import { chatRoomsStore, chatMessagesStore, chatUsersStore } from '$lib/stores';
	import {
		Button,
		Heading,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { acct, group, user } = data;

	let messageInput = '';

	onMount(async () => {
		createUser({ acct: data.entity?.acct || 'Anonymous', group });
	});

	function submitMessage() {
		if (user.uid) {
			sendMessage(messageInput, data.entity?.acct || 'Anonymous');
		} else {
			console.log('No user.uid!');
		}

		messageInput = '';
	}
</script>

<TableWrap divContainerPadding="px-4">
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class="dark:bg-gray-900 p-4">
			<div class="grid grid-cols-2 gap-4">
				<Heading tag="h3">{group} Group</Heading>
			</div>
			<div class="mt-4">
				<div class="grid grid-cols-12 gap-4">
					<!-- Groups -->
					<div class="col-span-2">
						<Table
							name="advancedTable"
							classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
							hoverable={true}
						>
							<TableHead
								><TableHeadCell class="text-center " padding="px-4 py-3" scope="col"
									>Rooms</TableHeadCell
								></TableHead
							>
							<TableBody>
								<!-- List the rooms -->
								{#each $chatRoomsStore as chatRoom}
									<TableBodyRow class="border-none cursor-pointer">
										<TableBodyCell>
											{chatRoom.name}
										</TableBodyCell>
									</TableBodyRow>
								{/each}
							</TableBody>
						</Table>
					</div>

					<!-- Messages -->
					<div class="col-span-8">
						<Table
							name="advancedTable"
							classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
							hoverable={true}
						>
							<TableHead
								><TableHeadCell class="text-center " padding="px-4 py-3" scope="col"
									>Messages</TableHeadCell
								></TableHead
							>
							<TableBody>
								<!-- List the messages -->
								{#each $chatMessagesStore.reverse() as chatMessage}
									<TableBodyRow class="border-none cursor-pointer">
										<TableBodyCell>
											({chatMessage.userName}) - {chatMessage.content}
										</TableBodyCell>
									</TableBodyRow>
								{/each}
							</TableBody>
						</Table>
					</div>

					<!-- Users -->
					<div class="col-span-2">
						<Table
							name="advancedTable"
							classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
							hoverable={true}
						>
							<TableHead
								><TableHeadCell class="text-center " padding="px-4 py-3" scope="col"
									>Users</TableHeadCell
								></TableHead
							>
							<TableBody>
								<!-- List the users -->
								{#each $chatUsersStore as chatUser}
									<TableBodyRow class="border-none cursor-pointer">
										<TableBodyCell>
											{chatUser.userName}
										</TableBodyCell>
									</TableBodyRow>
								{/each}
							</TableBody>
						</Table>
					</div>
				</div>
				<div class="grid grid-cols-12 gap-4">
					<div class="col-span-2"></div>
					<div class="col-span-8">
						<form>
							<div class="grid grid-cols-3 gap-4">
								<Input
									type="text"
									class="col-span-2"
									name="messageInput"
									bind:value={messageInput}
								/>
								<div class="col-span-1">
									<Button on:click={submitMessage}>
										<svg
											class=" -ml-1 w-6 h-6"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
											><path
												fill-rule="evenodd"
												d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
												clip-rule="evenodd"
											/></svg
										>
										Send Message
									</Button>
								</div>
							</div>
						</form>
					</div>
					<div class="col-span-2"></div>
				</div>
			</div>
		</div>
	</div>
</TableWrap>
