<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { auth, db } from '$lib/firebase/client';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { doc, setDoc } from 'firebase/firestore';
	import type { PageData } from './$types';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { Button, Heading } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { t } from '$lib/translations';
	import { Section } from 'flowbite-svelte-blocks';

	export let data: PageData;

	const toastStore = getToastStore();
	const analytics = typeof window !== 'undefined' ? getAnalytics() : null;

	let email = '';
	let password = '';

	async function addUserToDB(user: any) {
		const { uid, email, displayName, photoURL } = user;
		try {
			await setDoc(
				doc(db, 'users', uid),
				{
					email,
					displayName,
					photoURL
				},
				{ merge: true }
			);

			if (analytics) {
				logEvent(analytics, 'sign_up');
			}
		} catch (error) {
			const t: ToastSettings = {
				background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-gray-200',
				message: `An error occured during registration setup - please contact us to complete your registration: ${error}`,
				hideDismiss: true
			};
			toastStore.trigger(t);
		}
	}

	async function signInWithEmailAndPW() {
		try {
			const credential = await createUserWithEmailAndPassword(auth, email, password);

			// Get idToken from Google.
			// Be careful for other implementations!!
			const idToken = await credential.user.getIdToken();

			await addUserToDB(credential.user);

			const res = await fetch('/api/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					// 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
				},
				body: JSON.stringify({ idToken })
			});

			await goto('/', { invalidateAll: true, replaceState: true });
		} catch (error) {
			const t: ToastSettings = {
				background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-gray-200',
				message: `An error occured during registration: ${error}`,
				hideDismiss: true
			};
			toastStore.trigger(t);
		}
	}

	async function setSessionToken(idToken: string) {
		await fetch('/api/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
				// 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
			},
			body: JSON.stringify({ idToken })
		});
	}

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const credential = await signInWithPopup(auth, provider);

		// Get idToken from Google.
		// Be careful for other implementations!!
		const idToken = await credential.user.getIdToken();

		if (analytics) {
			logEvent(analytics, 'login');
		}

		await setSessionToken(idToken);

		await addUserToDB(credential.user);

		await goto('/', { invalidateAll: true, replaceState: true });
	}

	const validateToken: SubmitFunction = () => {
		// After call to validate turnstile token
		return async ({ result }) => {
			if (!result.data.success) {
				const t: ToastSettings = {
					background: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-gray-200',
					message: `An error occured during initial registration validation - Please try again!`,
					hideDismiss: true
				};
			} else {
				signInWithEmailAndPW();
			}
		};
	};
</script>

{#if data.email}
	{#if browser}
		{goto('/')}
	{/if}
{:else}
	<Section class="bg-gray-50 dark:bg-gray-900">
		<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
			<!-- Mission -->
			<div class="flex flex-col justify-center">
				<Heading class="mb-4  text-gray-900  dark:text-gray-200">U Toots</Heading>
				<Heading tag="h4" class="mb-4   text-gray-900  dark:text-gray-200">
					User supported discovery for the Fediverse!
				</Heading>
				<p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
					{$t('general.vision')}
				</p>
				<a
					href="/tac"
					class="text-green-600 dark:text-green-500 hover:underline font-medium text-lg inline-flex items-center"
					>Read more about our app
					<svg
						class="w-3.5 h-3.5 ms-2 rtl:rotate-180"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 10"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 5h12m0 0L9 1m4 4L9 9"
						/>
					</svg>
				</a>
			</div>

			<!-- Create account form -->
			<div>
				<div class="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white shadow-xl dark:bg-gray-800">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-200">Create an account</h2>
					<form
						method="POST"
						class="mt-8 space-y-6"
						action="?/validateTurnstile"
						use:enhance={validateToken}
						id="registerForm"
					>
						<!-- Username -->
						<div>
							<label
								for="username"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
								>{$t('general.username')}</label
							>
							<input
								type="text"
								maxlength="30"
								name="username"
								id="username"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-green-500 dark:focus:border-green-500"
								placeholder={$t('general.username')}
								required=""
							/>
						</div>

						<!-- EMail -->
						<div>
							<label
								for="email"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
								>Your email</label
							>
							<input
								type="email"
								maxlength="30"
								name="email"
								bind:value={email}
								id="email"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-green-500 dark:focus:border-green-500"
								placeholder={$t('general.emailPlaceholder')}
								required
							/>
						</div>

						<!-- Password -->
						<div>
							<label
								for="password"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
								>Password</label
							>
							<input
								type="password"
								maxlength="30"
								name="password"
								bind:value={password}
								id="password"
								placeholder="••••••••"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-green-500 dark:focus:border-green-500"
								required=""
							/>
						</div>

						<!-- Confirm Password -->
						<div>
							<label
								for="password_confirmation"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
								>Confirm password</label
							>
							<input
								maxlength="30"
								name="password_confirmation"
								id="password_confirmation"
								type="password_confirmation"
								placeholder="••••••••"
								class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-green-500 dark:focus:border-green-500"
								required=""
							/>
						</div>

						<!-- Confirm TAC Checkbox -->
						<div class="flex items-start">
							<div class="flex items-center h-5">
								<input
									maxlength="30"
									id="terms"
									aria-describedby="terms"
									type="checkbox"
									class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
									required=""
								/>
							</div>
							<div class="ml-3 text-sm">
								<label for="terms" class="font-light text-gray-500 dark:text-gray-300"
									>I accept the <a
										class="font-medium text-green-600 hover:underline dark:text-green-500"
										href="/tac">Terms and Conditions</a
									></label
								>
							</div>
						</div>
						<Button
							type="submit"
							class="w-full text-gray-200 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
							>Create an account</Button
						>
						<Turnstile siteKey={PUBLIC_TURNSTILE_SITE_KEY} theme="dark" />
					</form>
					<p class="text-sm font-light text-gray-500 dark:text-gray-400">
						Already have an account? <a
							href="/login"
							class="font-medium text-primary-600 hover:underline dark:text-green-500">Login here</a
						>
					</p>
				</div>
			</div>
		</div>
	</Section>
{/if}
