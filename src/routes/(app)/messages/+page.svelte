<script lang="ts">
	import { activeClass, nonActiveClass, ownTextClass, sentTextClass } from '$lib/classCSS';
	import { TableWrap } from '$lib/components';
	import type { ChatUser, PrivateMessage } from '$lib/models';
	import { connectSocket, leavePrivate, sendMessage } from '$lib/socket/private';
	import { chatNumUsers, chatUsersStore, privateMessagesStore } from '$lib/stores';
	import { redirectPage } from '$lib/utils/redirectPage';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
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
	import { Section } from 'flowbite-svelte-blocks';
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	import { browser, dev } from '$app/environment';
	import { PUBLIC_PRIVATE_HOST, PUBLIC_SOCKET_HOST } from '$env/static/public';
	import { SESSION_ID } from '$lib/constants';
	import { validatePrivateChatMessage } from '$lib/models/chatMessage';
	import { validatePrivateUser, type ChatPrivateUser } from '$lib/models/chatUser';
	import { convertUnixEpochToDateString } from '$lib/utils';
	export let data: PageData;
	const { user, entity, userClickedData } = data;

	let userNameClicked = userClickedData.userNameClicked || '';
	let uidClicked = userClickedData.uidClicked || '';

	let messageInput = '';
	const toastStore = getToastStore();
	const { acct } = entity;

	// Retry https://socket.io/docs/v4/tutorial/step-8
	const ioOptions = {
		// ackTimeout: 10000,
		// retries: 3,
		autoConnect: true,
		path: ''
	};

	if (!dev) {
		ioOptions.path = '/private';
	}

	const socketAddr = dev ? `${PUBLIC_PRIVATE_HOST}` : `${PUBLIC_SOCKET_HOST}`;
	let gotosettings = acct ? false : true;

	if (!acct) {
		redirectPage(5, `/settings`);
	}

	let chatMessages: HTMLElement | null;
	let messageInputDiv: HTMLElement | null;

	let socket = io(socketAddr, ioOptions);

	onMount(async () => {
		if (acct && user.uid) {
			try {
				await connectSocket({
					acct,
					socket,
					uid: user.uid
				}); // Pass acct as handshake auth

				socket.on('connect_error', (err) => {
					// the reason of the error, for example "xhr poll error"
					console.error('connect_error - private - err.message:', err.message);

					socket.off('connect_error');
				});

				socket.on('session', ({ connected, createdAt, sessionID, uid, userID, username }) => {
					// console.log(
					// 	`Private session - connected: ${connected}, createdAt: ${createdAt}, sessionID: ${sessionID}, uid: ${uid}, userID: ${userID}, username: ${username}.`
					// );
					// attach the session ID to the next reconnection attempts
					socket.auth = { sessionID };
					// store it in the localStorage
					localStorage.setItem(SESSION_ID, sessionID);
					// save the ID of the user
					socket.userID = userID;
				});

				socket.on('messages', (messages) => {
					if (!Array.isArray(messages)) {
						return;
					}

					const validatedMessages: PrivateMessage[] = [];
					const limitedMessages = messages.filter((_, index) => {
						return index < 1000;
					});

					for (const message of limitedMessages) {
						const validatedMessage = validatePrivateChatMessage(message);
						if (validatedMessage) {
							const createdAtDate = convertUnixEpochToDateString(validatedMessage.createdAt);
							validatedMessage.createdAt = createdAtDate;
							validatedMessages.push(validatedMessage);
						}
					}

					privateMessagesStore.set(validatedMessages);
				});

				socket.on(
					'private message',
					(message: {
						content: string;
						createdAt: string;
						from: string;
						fromUserName: string;
						to: string;
						userName: string;
					}) => {
						const { content, createdAt, from, fromUserName, to, userName } = message;

						if (
							!content ||
							!from ||
							!to ||
							typeof content !== 'string' ||
							typeof from !== 'string' ||
							typeof fromUserName !== 'string' ||
							typeof to !== 'string' ||
							typeof userName !== 'string'
						) {
							console.error('Invalid private message', message);
							return;
						}

						const createdAtDate = convertUnixEpochToDateString(createdAt);

						const response = {
							content,
							createdAt: createdAtDate,
							from,
							fromUserName,
							to,
							userName
						};

						// Update the message count for that user
						chatUsersStore.update((chatUsers) => {
							const response = chatUsers;
							const index = response.findIndex((chatUser) => chatUser.username === fromUserName);

							if (index !== -1) {
								if (response[index].newMessagesCount) {
									response[index].newMessagesCount++;
								} else {
									response[index].newMessagesCount = 1;
								}
							}

							return response;
						});

						privateMessagesStore.update((items) => {
							items.push(response);
							return items;
						});
					}
				);

				socket.on('user disconnected', (user) => {
					console.log('user disconnected', user);
				});

				socket.on('updateUsers', (users) => {
					const validatedUsers: ChatPrivateUser[] = [];

					for (const user of users) {
						const validatedUser = validatePrivateUser(user);

						if (validatedUser) {
							validatedUsers.push(validatedUser);
						} else {
							console.error('invalid user', user);
						}
					}

					chatUsersStore.set(validatedUsers);
				});

				socket.on('updateCount', (id, count) => {
					chatNumUsers.set(count);
					console.log(`Num users: ${id}, count: ${count}.`);
				});
			} catch (error) {
				console.error('Error connecting onMount', error);
			}
		}
		chatMessages = document.getElementById('chat-messages');
		messageInputDiv = document.getElementById('messageInput');

		// Auto click submit button on Enter
		document.querySelector('#messageInput')?.addEventListener('keyup', (event: KeyboardEvent) => {
			if (event.key !== 'Enter') {
				return;
			}

			const submitButton = document.querySelector('#submitButton') as HTMLButtonElement;
			if (submitButton) {
				submitButton.click();
			}

			event.preventDefault();
		});
	});

	onDestroy(async () => {
		const sessionID = localStorage.getItem(SESSION_ID);

		if (browser && acct && sessionID) {
			// Remove messages
			privateMessagesStore.set([]);

			localStorage.removeItem(SESSION_ID);

			// Leave the private socket
			await leavePrivate({ acct, socket, sessionID });

			socket.disconnect();
		}
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

	function submitMessage() {
		if (user.uid && messageInput) {
			sendMessage({
				content: messageInput,
				from: user.uid,
				fromUserName: entity.acct,
				socket,
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
		localStorage.setItem('userClicked', JSON.stringify({ userNameClicked, uidClicked }));

		// Update the message count for that user
		chatUsersStore.update((chatUsers) => {
			const response = chatUsers;
			const index = response.findIndex(
				(chatUserStore) => chatUserStore.username === userNameClicked
			);

			if (index !== -1) {
				response[index].newMessagesCount = 0;
			} else {
				console.warn();
				`Did not find index: ${index} for acct: ${acct}.`;
			}
			return response;
		});
	}

	$: userList = $chatUsersStore.filter((user) => {
		return user;
	});

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
										{#each userList as chatUser}
											<TableBodyRow class="border-none cursor-pointer">
												<TableBodyCell
													class={userNameClicked === chatUser.username
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
