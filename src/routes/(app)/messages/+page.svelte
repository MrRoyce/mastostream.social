<script lang="ts">
	import { TableWrap } from '$lib/components';
	import type { ChatUser } from '$lib/models';
	import { connectSocket, sendMessage } from '$lib/socket/private';
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
	import { onDestroy, onMount } from 'svelte';
	import { chatMessagesStore, chatUsersStore } from '$lib/stores';

	export let data: PageData;
	const { user, entity } = data;

	let messageInput = '';

	console.log('user in messages', user);
	console.log('entity in messages', entity);
	const { acct } = entity;

	onMount(async () => {
		console.log(`Mounting messages page for acct: ${acct}, uid: ${user.uid}.`);
		connectSocket({ acct, uid: user.uid }); // Pass acct as handshake auth
	});

	onDestroy(() => {
		// chatMessagesStore.set([]);
		// leaveRoom({
		// 	roomId: groupId
		// });
		console.log('Destroy event for messages');
	});

	function submitMessage() {
		if (user.uid && messageInput) {
			sendMessage({
				acct,
				content: messageInput
			});
		}

		// Clear the message
		messageInput = '';
	}

	function userClicked(chatUser: ChatUser) {
		console.log('userClicked', chatUser);
	}
</script>

<TableWrap divContainerPadding="px-4">
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class="dark:bg-gray-900 p-4">
			<Heading tag="h3">Private Chats</Heading>
			<div class="overflow-y-scroll">
				<div class="mt-4">
					<div class="grid grid-cols-12 gap-4">
						<!-- Users -->
						<div class="col-span-3">
							<!-- Users Header -->
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

							<!-- Users Content-->
							<Table
								name="advancedTable"
								classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
								hoverable={true}
							>
								<div id="chat-users" class="pb-2 h-96 overflow-y-scroll">
									<TableBody>
										<!-- List the users -->
										{#each $chatUsersStore as chatUser, index}
											<TableBodyRow class="border-none cursor-pointer">
												<TableBodyCell class="pl-4" on:click={userClicked(chatUser)}>
													{chatUser.username}
												</TableBodyCell>
											</TableBodyRow>
										{/each}
									</TableBody>
								</div>
							</Table>
						</div>

						<!-- Messages-->
						<div class="col-span-9">
							<!-- Messages Header-->
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

							<!-- Messages Content-->
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
														>{chatMessage.userName === acct ? 'You' : chatMessage.userName} - {chatMessage.time}</P
													>
													<P>{chatMessage.content}</P>
												</TableBodyCell>
											</TableBodyRow>
										{/each}
									</TableBody>
								</div>
							</Table>

							<!-- Message input and Send Button -->
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
					</div>
				</div>
			</div>
		</div>
	</div>
</TableWrap>
