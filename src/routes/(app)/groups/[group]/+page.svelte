<script lang="ts">
	import { TableWrap } from '$lib/components';
	import { onMount } from 'svelte';
	import { createUser, sendMessage } from '$lib/socket';
	import { chatRoomsStore, chatMessagesStore, chatUsersStore } from '$lib/stores';
	import {
		Button,
		Heading,
		Input,
		P,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;
	const { acct, group, user } = data;

	let messageInput = '';
	let enterKey;

	onMount(async () => {
		createUser({ acct: data.entity?.acct || 'Anonymous', group });
		document.querySelector('#messageInput')?.addEventListener('keyup', (event) => {
			if (event.key !== 'Enter') return;

			document.querySelector('#submitButton').click();
			event.preventDefault();
		});
	});

	chatMessagesStore.subscribe(() => {
		// Scroll down
		const chatMessages = document.getElementById('chat-messages');
		const messageInput = document.getElementById('messageInput');
		if (chatMessages) {
			//chatMessages.scroll({ top: chatMessages.scrollHeight, behavior: 'smooth' });
			//chatMessages.scrollTop = chatMessages.scrollHeight;
			setTimeout(() => {
				chatMessages.scrollTop = chatMessages.scrollHeight;
				if (messageInput) {
					messageInput.focus();
				}
			}, 0);
		}
	});

	function submitMessage() {
		if (user.uid && messageInput) {
			sendMessage(messageInput, data.entity?.acct || 'Anonymous');
		}

		// Clear the message
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
			<div class="overflow-y-scroll">
				<div class="mt-4">
					<div class="grid grid-cols-12 gap-4">
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
							</Table>
						</div>
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
							</Table>
						</div>
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
							</Table>
						</div>

						<!-- Groups -->
						<div class="col-span-2">
							<Table
								name="advancedTable"
								classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
								hoverable={true}
							>
								<TableBody>
									<!-- List the rooms -->
									{#each $chatRoomsStore as chatRoom}
										<TableBodyRow class="border-none cursor-pointer">
											<TableBodyCell class="pl-4">
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
								<div id="chat-messages" class="pb-2 h-96 overflow-y-scroll">
									<TableBody>
										<!-- List the messages -->
										{#each $chatMessagesStore as chatMessage}
											<TableBodyRow class="border-none cursor-pointer">
												<TableBodyCell class="pl-4">
													<P size="xs" opacity={50} italic
														>{chatMessage.userName} - {chatMessage.time}</P
													>
													<P>{chatMessage.content}</P>
												</TableBodyCell>
											</TableBodyRow>
										{/each}
									</TableBody>
								</div>
							</Table>
						</div>

						<!-- Users -->
						<div class="col-span-2">
							<Table
								name="advancedTable"
								classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
								hoverable={true}
							>
								<TableBody>
									<!-- List the users -->
									{#each $chatUsersStore as chatUser}
										<TableBodyRow class="border-none cursor-pointer">
											<TableBodyCell class="pl-4" on:click={() => goto(`/accounts/${acct}`)}>
												{chatUser.userName}
											</TableBodyCell>
										</TableBodyRow>
									{/each}
								</TableBody>
							</Table>
						</div>
					</div>

					<!-- Message input and Send Button -->
					<div class="grid grid-cols-12 pt-4">
						<div class="col-span-2"></div>
						<div class="col-span-8">
							<div class="grid grid-cols-12 gap-4">
								<Input
									type="text"
									class="col-span-10 rounded-none"
									name="messageInput"
									id="messageInput"
									bind:value={messageInput}
								/>
								<div class="col-span-2">
									<Button on:click={submitMessage} id="submitButton" class="rounded-none"
										>Send Message</Button
									>
								</div>
							</div>
						</div>
						<div class="col-span-2"></div>
					</div>
				</div>
			</div>
		</div>
	</div></TableWrap
>
