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
	import { autolinker, convertUnixEpochToDateString } from '$lib/utils';
	import { redirectPage } from '$lib/utils/redirectPage';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import DOMPurify from 'dompurify';
	import {
		Avatar,
		Button,
		Card,
		Dropdown,
		DropdownItem,
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
	import { DotsHorizontalOutline, MessageDotsSolid, MessagesSolid } from 'flowbite-svelte-icons';
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

	function purifyMessage(message: string): string {
		return DOMPurify.sanitize(message);
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

				socket.on('messages', async (messages) => {
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
							users[message.fromUserName] = true;

							// Add newPrivateUser to chatPrivateUsers array if it doesn't exist already
							if (!chatPrivateUsers.find((user) => user.userID === message.from)) {
								const fetchURL = `/api/picture?uid=${message.from}`;
								const photoURLResponse = await fetch(fetchURL, {
									method: 'GET',
									headers: {
										'Content-Type': 'application/json'
									}
								});
								const resJson = await photoURLResponse.json();
								const newPrivateUser = {
									connected: false,
									photoURL: resJson?.pictureURL || '',
									userID: message.from,
									uid: message.from,
									username: message.fromUserName
								};

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

				socket.on('userDisconnected', (uid) => {
					chatUsersStore.update((users) => users.filter((user) => user.userID !== uid));

					console.log('userDisconnected', uid);
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
							console.error('Invalid user in updateUsers', user);
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
				<Tabs contentClass="p-4 bg-gray-50 rounded-none dark:bg-gray-800 mt-4" tabStyle="underline">
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
							<div class="pb-2 overflow-y-scroll w-full">
								<TableBody tableBodyClass="w-full">
									<!-- List the users -->
									{#each userList as chatUser}
										{#if acct !== chatUser.username}
											<div class="pt-4 w-full">
												<TableBodyRow scope="col" class="border-none cursor-pointer mt-4 w-full">
													<TableBodyCell
														scope="col"
														class={userNameClicked === chatUser.username
															? activeClass
															: nonActiveClass}
														on:click={() => userClicked(chatUser)}
													>
														<!-- User Profile Tab Card -->
														<div class="flex flex-row border-gray-200/80 p-6 w-full">
															<!-- Avatar Container -->

															<!-- User Avatar -->
															<Avatar
																rounded
																src={chatUser.photoURL}
																alt={chatUser.photoURL}
																class="flex-shrink-0"
																dot={{
																	placement: 'bottom-right',
																	color: chatUser.connected ? 'green' : 'red'
																}}
															/>

															<!-- Meta Body -->
															<div class="flex flex-col px-6">
																<!-- Username Container -->
																<div class="flex h-8 flex-row">
																	<!-- Username -->
																	<h2 class="text-lg font-semibold">{chatUser.username}</h2>

																	<!-- User Verified -->
																	<svg
																		class="my-auto ml-2 h-5 fill-blue-400"
																		xmlns="http://www.w3.org/2000/svg"
																		xmlns:xlink="http://www.w3.org/1999/xlink"
																		version="1.1"
																		width="24"
																		height="24"
																		viewBox="0 0 24 24"
																	>
																		<path
																			d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"
																		/>
																	</svg>
																</div>

																<!-- Meta Badges -->
																<div class="my-2 flex flex-row space-x-2">
																	<!-- Badge Role -->
																	<div class="flex flex-row">
																		<svg
																			class="mr-2 h-4 w-4 fill-gray-500/80"
																			xmlns="http://www.w3.org/2000/svg"
																			xmlns:xlink="http://www.w3.org/1999/xlink"
																			version="1.1"
																			width="24"
																			height="24"
																			viewBox="0 0 24 24"
																		>
																			<path
																				d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"
																			/>
																		</svg>

																		<div class="text-xs text-gray-400/80 hover:text-gray-400">
																			{chatUser.newMessagesCount || '0'} New Comments
																		</div>
																	</div>
																</div>
															</div>

															<!-- Right Actions Container -->
															<div class="w-100 flex flex-grow flex-col items-end justify-start">
																<div class="flex flex-row space-x-3">
																	<!-- Follow Button -->
																	<button
																		class="flex rounded-md bg-blue-500 py-2 px-4 text-white transition-all duration-150 ease-in-out hover:bg-blue-600"
																	>
																		<svg
																			class="mr-2 fill-current"
																			xmlns="http://www.w3.org/2000/svg"
																			xmlns:xlink="http://www.w3.org/1999/xlink"
																			version="1.1"
																			width="24"
																			height="24"
																			viewBox="0 0 24 24"
																		>
																			<path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg
																		>

																		Follow
																	</button>

																	<!-- More Actions Button -->
																	<button
																		class="flex rounded-md bg-gray-100 py-2 px-1 text-white
        transition-all duration-150 ease-in-out hover:bg-gray-200"
																	>
																		<svg
																			class="fill-gray-500"
																			xmlns="http://www.w3.org/2000/svg"
																			xmlns:xlink="http://www.w3.org/1999/xlink"
																			version="1.1"
																			width="24"
																			height="24"
																			viewBox="0 0 24 24"
																		>
																			<path
																				d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
																			/>
																		</svg>
																	</button>
																</div>
															</div>
														</div></TableBodyCell
													>
												</TableBodyRow>
											</div>
										{/if}
									{/each}
								</TableBody>
							</div>
						</Table>
					</TabItem>

					<!-- Messages TabItem-->
					<TabItem on:click={() => (showUserNameOnTab = true)} open={showMessages}>
						<!-- Tab header -->
						<div slot="title" class="flex items-center gap-2">
							<MessageDotsSolid size="md" />
							{`Chat with ${showUserNameOnTab ? userNameClicked : '...'}`}
						</div>

						<!-- Messages Table Header-->
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
														>{@html autolinker(purifyMessage(privateMessage.content))}</P
													>
												</div>
											</TableBodyCell>
										</TableBodyRow>
									{/each}
								</TableBody>
							</div>
						</Table>
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
