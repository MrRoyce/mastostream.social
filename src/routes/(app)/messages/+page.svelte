<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { PUBLIC_PRIVATE_HOST, PUBLIC_SOCKET_HOST } from '$env/static/public';
	import { activeClass, nonActiveClass, ownTextClass, sentTextClass } from '$lib/classCSS';
	import { TableWrap } from '$lib/components';
	import { SESSION_ID } from '$lib/constants';
	import type { PrivateMessage } from '$lib/models';
	import { validatePrivateChatMessage } from '$lib/models/chatMessage';
	import { validatePrivateUser, type ChatPrivateUser } from '$lib/models/chatUser';
	import { connectSocket, leavePrivate, sendMessage } from '$lib/socket/private';
	import { chatNumUsers, chatUsersStore, privateMessagesStore } from '$lib/stores';
	import { convertUnixEpochToDateString } from '$lib/utils';
	import { redirectPage } from '$lib/utils/redirectPage';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import {
		Button,
		Heading,
		Input,
		Modal,
		P,
		TabItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Tabs
	} from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import { MessageDotsSolid, MessagesSolid } from 'flowbite-svelte-icons';
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { user, entity, userClickedData } = data;
	const { acct } = entity;
	const toastStore = getToastStore();

	let userNameClicked = userClickedData.userNameClicked || '';
	let uidClicked = userClickedData.uidClicked || '';
	let messageInput = '';

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

	let showUserNameOnTab = true;

	chatMessages = document.getElementById('chat-messages');
	messageInputDiv = document.getElementById('messageInputDiv');

	const users = {};
	const chatPrivateUsers: ChatPrivateUser[] | { connected: boolean; userID: any; username: any }[] =
		[];

	onMount(async () => {
		// Auto click submit button on Enter
		document
			.querySelector('#messageInputDiv')
			?.addEventListener('keyup', (event: KeyboardEvent) => {
				if (event.key !== 'Enter') {
					return;
				}

				const submitButton = document.querySelector('#submitButton') as HTMLButtonElement;
				if (submitButton) {
					submitButton.click();
				}

				event.preventDefault();
			});

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
						// Add the message.fromUserName to the users object
						if (!users.fromUserName && message.fromUserName !== acct) {
							const newPrivateUser = {
								connected: false,
								userID: message.from,
								uid: message.from,
								username: message.fromUserName
							};
							users[message.fromUserName] = true;

							// Add newPrivateUser to chatPrivateUsers array if it doesn't exist already
							if (!chatPrivateUsers.find((user) => user.userID === newPrivateUser.userID)) {
								chatPrivateUsers.push(newPrivateUser);
							}
						}

						const validatedMessage = validatePrivateChatMessage(message);
						if (validatedMessage) {
							const createdAtDate = convertUnixEpochToDateString(validatedMessage.createdAt);
							validatedMessage.createdAt = createdAtDate;
							validatedMessages.push(validatedMessage);
						}
					}

					if (chatPrivateUsers.length) {
						chatUsersStore.set(chatPrivateUsers);
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

				socket.on('updateUsers', (updatedUsers) => {
					for (const user of updatedUsers) {
						const validatedUser = validatePrivateUser(user);

						if (validatedUser) {
							// Get the index of the user in the chatPrivateUsers array that matches validatedUser.userID
							if (validatedUser.username !== acct) {
								const index = chatPrivateUsers.findIndex(
									(chatUser) => chatUser.userID === validatedUser.userID
								);

								if (index !== -1) {
									chatPrivateUsers[index].connected = true;
								} else {
									// Add the validatedUser to chatPrivateUsers array
									const newPrivateUser = {
										connected: validatedUser.connected,
										userID: validatedUser.userID,
										username: validatedUser.username
									};

									// Add newPrivateUser to chatPrivateUsers array if it doesn't exist already
									chatPrivateUsers.push(newPrivateUser);
								}

								// Check each chatPrivateUsers to see if it matches an object in the passed in updatedUsers array, if not, then set the chatPrivateUsers.connected property to false
								for (const chatUser of chatPrivateUsers) {
									const updatedUser = updatedUsers.find(
										(updatedUser) => updatedUser.userID === chatUser.userID
									);

									if (!updatedUser) {
										chatUser.connected = false;
									}
								}
							}
						} else {
							console.error('invalid user', user);
						}
					}

					chatUsersStore.set(chatPrivateUsers);
				});

				socket.on('updateCount', (id, count) => {
					chatNumUsers.set(count);
					console.log(`Num users: ${id}, count: ${count}.`);
				});
			} catch (error) {
				console.error('Error connecting onMount', error);
			}
		}
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

	function showMessageTab() {
		showUserNameOnTab = false;
	}

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

	function userClicked(chatUser: ChatPrivateUser) {
		showUserNameOnTab = true;
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

	$: showMessages = showUserNameOnTab;

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

			<div class="grid grid-rows-[auto_1fr]">
				<Tabs tabStyle="underline">
					<!-- Users TabItem -->
					<TabItem on:click={() => showMessageTab()}>
						<div slot="title" class="flex items-center gap-2">
							<MessagesSolid size="md" />
							All chats
						</div>

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
										{#if acct !== chatUser.username}
											<!-- content here -->

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

													{#if chatUser.connected}
														{'✅'}
													{:else}
														{'🚫'}
													{/if}

													{chatUser.username}
												</TableBodyCell>
											</TableBodyRow>{/if}
									{/each}
								</TableBody>
							</div>
						</Table>
					</TabItem>

					<!-- Messages TabItem-->
					<TabItem on:click={() => (showUserNameOnTab = true)} open={showMessages}>
						<div slot="title" class="flex items-center gap-2">
							<MessageDotsSolid size="md" />
							{`Chat with ${showUserNameOnTab ? userNameClicked : '...'}`}
						</div>
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
							<div id="chat-messages" bind:this={chatMessages} class="pb-2 h-96 overflow-y-scroll">
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
					</TabItem></Tabs
				>

				<!-- Input field and submit button -->
				<div class="mt-4">
					<div class="grid grid-cols-12 gap-4">
						<Input
							type="text"
							class="col-span-10 rounded-none"
							name="messageInput"
							id="messageInputDiv"
							bind:value={messageInput}
						/>
						<Button
							on:click={() => submitMessage()}
							id="submitButton"
							class="col-span-2 rounded-none">Send Message</Button
						>
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
