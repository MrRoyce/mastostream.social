<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, sendMagicLink } from '$lib/firebase/client';
	import { isUserAdmin } from '$lib/firebase/isUserAdmin';

	import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
	import { getAnalytics, logEvent } from 'firebase/analytics';

	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { Cta, Section } from 'flowbite-svelte-blocks';
	import { setMagicEmail } from '$lib/localStorage/magicEmail';
	import { Button, Heading } from 'flowbite-svelte';
	import { t } from '$lib/translations';

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

			try {
				window.location.assign('/');
				// await goto('/', { invalidateAll: true });
			} catch (error) {
				console.error('window.location.assign', error);
			}
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
			console.error('error in signin in login', error);
		}
	}
</script>

{#if state !== 'success'}
	<Section class="bg-gray-50 dark:bg-gray-900">
		<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
			<!-- CTA -->
			<div class="flex flex-col justify-center">
				<Heading class="mb-4  text-gray-900  dark:text-gray-200">U Toots</Heading>
				<Heading tag="h4" class="mb-4   text-gray-900  dark:text-gray-200">
					User supported discovery for the Fediverse!
				</Heading>
				<p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-300">
					{$t('general.vision')}
				</p>
				<a
					href="/tac"
					target="_blank"
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
			<div>
				<div class="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white shadow-xl dark:bg-gray-800">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-200">Sign in to U Toots</h2>
					<form class="mt-8 space-y-6" action="#">
						<div>
							<label
								for="email"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
								>Your email</label
							>
							<input
								type="email"
								name="email"
								bind:value={email}
								id="email"
								autocomplete="email"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-green-500 dark:focus:border-green-500"
								placeholder={$t('general.enterEmailAddress')}
								required
							/>
						</div>
						<div>
							<label
								for="password"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
								>Your password</label
							>
							<input
								type="password"
								name="password"
								id="password"
								bind:value={password}
								placeholder={$t('general.enterPassword')}
								autocomplete="current-password"
								class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-green-500 dark:focus:border-green-500"
								required
							/>
						</div>
						<div class="flex items-start">
							<div class="flex items-center h-5">
								<input
									id="remember"
									aria-describedby="remember"
									name="remember"
									type="checkbox"
									class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300 dark:focus:ring-green-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
									required
								/>
							</div>
							<div class="ms-3 text-sm">
								<label for="remember" class="font-medium text-gray-500 dark:text-gray-400"
									>Remember this device</label
								>
							</div>
							<a
								href="/#"
								class="ms-auto text-sm font-medium text-green-600 hover:underline dark:text-green-500"
								>Lost Password?</a
							>
						</div>
						<Button
							type="button"
							class="w-full px-5 py-3 text-base font-medium text-center text-gray-200 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 sm:w-auto dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
							on:click={signInWithEmailAndPW}>Login to your account</Button
						>
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
						<div class="text-sm font-medium text-gray-900 dark:text-gray-200">
							Not registered yet? <a
								href="/register"
								target="_blank"
								class="text-green-600 hover:underline dark:text-green-500">Create account</a
							>
						</div>
					</form>
				</div>
			</div>
		</div>
	</Section>
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
