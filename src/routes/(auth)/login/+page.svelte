<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, sendMagicLink } from '$lib/firebase/client';
	import { isUserAdmin } from '$lib/firebase/isUserAdmin';

	import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
	import { getAnalytics, logEvent } from 'firebase/analytics';

	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { Cta, Section } from 'flowbite-svelte-blocks';
	import { setMagicEmail } from '$lib/localStorage/magicEmail';

	type FormState = 'idle' | 'submitting' | 'success' | Error;
	let state: FormState = 'idle';

	const toastStore = getToastStore();
	const analytics = typeof window !== 'undefined' ? getAnalytics() : null;

	let emailLink: string | null = null;
	let email: string | null = null;
	let password: string | null = null;

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

	const signInWithMagicLink = async ({ currentTarget }) => {
		state = 'submitting';
		emailLink = new FormData(currentTarget).get('emailLink') as string;
		const redirectUrl = `${window.location.origin}/auth/confirm`;

		try {
			await sendMagicLink(emailLink, redirectUrl);
			setMagicEmail(emailLink);

			if (analytics) {
				logEvent(analytics, 'login');
			}

			state = 'success';
		} catch (error) {
			if (error instanceof Error) {
				state = error;
			} else {
				console.error('An error occurred sending the magic link!', error);
				state = new Error('Something went wrong sending the magic link 😞');
			}
		}
	};

	async function signInWithEmailAndPW() {
		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);

			// Get idToken from Google.
			// Be careful for other implementations!!
			const idToken = await credential.user.getIdToken();

			if (analytics) {
				logEvent(analytics, 'login');
			}

			await setSessionToken(idToken);

			goto('/', { invalidateAll: true, replaceState: true });
		} catch (error) {
			const t: ToastSettings = {
				background: 'variant-filled-error',
				message: 'An error occurred with your login.  Please try again'
			};
			toastStore.trigger(t);
			console.error('Error logging in', error);
		}
	}

	async function signInWithGoogle() {
		try {
			const provider = new GoogleAuthProvider();
			const credential = await signInWithPopup(auth, provider);

			// Get idToken from Google.
			// Be careful for other implementations!!
			const idToken = await credential.user.getIdToken();

			if (analytics) {
				logEvent(analytics, 'login');
			}

			await setSessionToken(idToken);

			const admin = await isUserAdmin(credential.user?.email || '');

			goto(admin ? '/admin' : '/', {
				invalidateAll: true,
				replaceState: true
			});
		} catch (error) {
			console.log('error in signin in login', error);
		}
	}
</script>

{#if state !== 'success'}
	<div class="min-h-min bg-gray-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Sign in to your account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600 max-w">
				Or
				<a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
					create an account
				</a>
			</p>
		</div>

		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
			<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
				<div class="flex flex-row justify-center divide-x divide-solid py-12 sm:px-6 lg:px-8">
					<div class="w-1/2 p-4">
						<form
							class="space-y-6"
							action="#"
							on:submit|preventDefault={signInWithMagicLink}
							method="POST"
						>
							<div>
								<label for="emailLink" class="block text-sm font-medium text-gray-700">
									Email address
								</label>
								<div class="mt-1">
									<input
										id="emailLink"
										name="emailLink"
										bind:value={emailLink}
										type="email"
										autocomplete="email"
										aria-label="email"
										class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										placeholder="youremail@email.com"
									/>
								</div>
							</div>

							<div>
								<button
									type="submit"
									class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
								>
									Send Magic Link
								</button>
							</div>
							{#if state === 'submitting'}
								<p class="mt-2 text-center text-sm text-gray-600 max-w">
									Sending email to {emailLink || email}
								</p>
							{/if}
							{#if state instanceof Error}
								<p class="mt-2 text-center text-sm text-gray-600 max-w">
									Whoops, there was an error sending your email. Please try again soon!
								</p>
							{/if}
						</form>
					</div>
					<div class="w-1/2 p-4">
						<form class="space-y-6">
							<div>
								<label for="email" class="block text-sm font-medium text-gray-700">
									Email address
								</label>
								<div class="mt-1">
									<input
										id="email"
										name="email"
										bind:value={email}
										type="email"
										autocomplete="email"
										class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										placeholder="Enter your email address"
									/>
								</div>
							</div>

							<div>
								<label for="password" class="block text-sm font-medium text-gray-700">
									Password
								</label>
								<div class="mt-1">
									<input
										id="password"
										name="password"
										bind:value={password}
										type="password"
										autocomplete="current-password"
										class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										placeholder="Enter your password"
									/>
								</div>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<input
										id="remember_me"
										name="remember_me"
										type="checkbox"
										class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
									/>
									<label for="remember_me" class="ml-2 block text-sm text-gray-900">
										Remember me
									</label>
								</div>

								<div class="text-sm">
									<a href="#/" class="font-medium text-blue-600 hover:text-blue-500">
										Forgot your password?
									</a>
								</div>
							</div>

							<div>
								<button
									type="button"
									class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									on:click={signInWithEmailAndPW}
								>
									Sign in
								</button>
							</div>
						</form>
					</div>
				</div>

				<div class="mt-6">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-300" />
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-2 bg-gray-100 text-gray-500"> Or continue with </span>
						</div>
					</div>

					<div class="mt-6 grid grid-cols-3 gap-3">
						<div>
							<a
								href="#/"
								class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
							>
								<img
									class="h-5 w-5"
									src="https://www.svgrepo.com/show/511330/apple-173.svg"
									alt="Sign in with Apple"
								/>
							</a>
						</div>
						<div>
							<a
								href="#/"
								class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
							>
								<img
									class="h-5 w-5"
									src="https://www.svgrepo.com/show/512317/github-142.svg"
									alt="Sign in with GitHub"
								/>
							</a>
						</div>
						<div>
							<a
								on:click={signInWithGoogle}
								href="#/"
								class="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
							>
								<img
									class="h-6 w-6"
									src="https://www.svgrepo.com/show/506498/google.svg"
									alt="Sign in with Google"
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="col-span-12">
		<Section name="cta">
			<Cta ctatype="heading">
				<svelte:fragment slot="h2">Great, we’ve sent you an email!</svelte:fragment>
				<p>
					Please find it in your <strong>{emailLink || email}</strong> inbox and follow the link there
					to login.
				</p>
			</Cta>
		</Section>
	</div>
{/if}
