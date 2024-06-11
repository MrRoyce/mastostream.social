<script lang="ts">
	import { TableWrap } from '$lib/components';
	import type { ChatUser } from '$lib/models';
	import { connectSocket, leavePrivate, sendMessage } from '$lib/socket/private';
	import {
		Button,
		Heading,
		Input,
		Modal,
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
	import { chatUsersStore, privateMessagesStore } from '$lib/stores';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { Section } from 'flowbite-svelte-blocks';
	import { redirectPage } from '$lib/utils/redirectPage';

	export let data: PageData;
	const { user, entity } = data;

	let messageInput = '';
	const toastStore = getToastStore();
	const { acct } = entity;

	let gotosettings = acct ? false : true;

	if (!acct) {
		redirectPage(5, `/settings`);
	}

	let chatMessages: HTMLElement | null;
	let messageInputDiv: HTMLElement | null;

	onMount(async () => {
		if (acct) {
			connectSocket({
				acct,
				uid: user.uid
			}); // Pass acct as handshake auth
		}

		chatMessages = document.getElementById('chat-messages');
		messageInputDiv = document.getElementById('messageInput');

		// Auto click submit button on Enter
		document.querySelector('#messageInput')?.addEventListener('keyup', (event) => {
			if (event.key !== 'Enter') {
				return;
			}
			document.querySelector('#submitButton').click();
			event.preventDefault();
		});
	});

	onDestroy(() => {
		const sessionID = localStorage.getItem('sessionID');
		if (acct && sessionID) {
			privateMessagesStore.set([]);
			leavePrivate({ acct, sessionID });
		}
		localStorage.setItem('sessionID', '');
	});

	privateMessagesStore.subscribe(() => {
		// Scroll down
		if (chatMessages) {
			setTimeout(() => {
				chatMessages.scrollTop = chatMessages.scrollHeight;
				if (messageInputDiv) {
					messageInputDiv.focus();
				}
			}, 0);
		}
	});

	let activeClass =
		'flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-gray-700 dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700';
	let nonActiveClass =
		'flex items-center p-2 text-base font-normal text-green-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700';
	let ownTextClass = 'border-none cursor-pointer text-right';
	let sentTextClass = 'border-none cursor-pointer';

	let userNameClicked = '';
	let uidClicked = '';

	function submitMessage() {
		if (user.uid && messageInput) {
			sendMessage({
				content: messageInput,
				from: user.uid,
				fromUserName: entity.acct,
				to: uidClicked,
				userName: userNameClicked
			});
		} else {
			const t: ToastSettings = {
				message: `Please select a user and enter a message to send to them!`,
				hideDismiss: true
			};
			toastStore.trigger(t);
		}

		// Clear the message
		messageInput = '';
	}

	function userClicked(chatUser: ChatUser) {
		userNameClicked = chatUser.username;
		uidClicked = chatUser.userID;

		// Update the message count for that user
		chatUsersStore.update((chatUsers) => {
			const response = chatUsers;
			const index = response.findIndex(
				(chatUserStore) => chatUserStore.username === userNameClicked
			);

			if (index !== -1) {
				response[index].newMessagesCount = 0;
			} else {
				console.log(`Did not find index: ${index} for acct: ${acct}.`);
			}
			return response;
		});
	}

	$: messagesForUser = $privateMessagesStore.filter((privateMessage) => {
		if (
			(privateMessage.fromUserName === acct && privateMessage.userName === userNameClicked) ||
			(privateMessage.userName === acct && privateMessage.fromUserName === userNameClicked)
		) {
			return privateMessage;
		}
	});
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
								divClass="relative overflow-x-auto"
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
										{#each $chatUsersStore as chatUser}
											<TableBodyRow class="border-none cursor-pointer">
												<TableBodyCell
													class={userNameClicked == chatUser.username
														? activeClass
														: nonActiveClass}
													on:click={() => userClicked(chatUser)}
												>
													{#if acct == chatUser.username}
														{''}
													{:else}
														{chatUser.newMessagesCount || ''}
													{/if}

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
									><TableHeadCell class="text-center" padding="px-4 py-3" scope="col"
										>Messages</TableHeadCell
									></TableHead
								>
							</Table>

							<!-- Messages Content-->
							<Table
								name="advancedTable"
								classSection="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5"
								class="table-fixed"
								hoverable={true}
							>
								<div id="chat-messages" class="pb-2 h-96 overflow-y-scroll">
									<TableBody>
										<!-- List the messages -->
										{#each messagesForUser as privateMessage}
											{@const fromUserName = privateMessage.fromUserName}
											<TableBodyRow class="border-none cursor-pointer mt-2">
												<TableBodyCell class="pl-4 w-[800px]">
													<div>
														<P
															class={fromUserName === acct ? ownTextClass : sentTextClass}
															size="xs"
															opacity={50}
															italic
															>{fromUserName === acct ? 'You' : fromUserName} - {privateMessage.createdAt}</P
														>
														<P class={fromUserName === acct ? ownTextClass : sentTextClass}
															>{privateMessage.content}</P
														>
													</div>
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
									<Button on:click={() => submitMessage()} id="submitButton" class="rounded-none"
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

<Section classSection="h-96 {!gotosettings ? 'hidden' : ''}">
	<Modal title="Connect to your Mastodon account!" bind:open={gotosettings} class="min-w-full">
		<P>Please connect to your Mastodon account to use this feature.</P>
		<P>Please click here if you are not automatically redirected.</P>
		<Button href={`/settings`} size="lg" color="red">Go to /settings</Button>
	</Modal>
</Section>
