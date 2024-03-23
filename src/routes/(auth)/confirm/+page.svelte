<script lang="ts">
	import { isMagicLink, signInWithMagicLink } from '$lib/firebase/client';
	import { clearMagicEmail, getMagicEmail } from '$lib/localStorage/magicEmail';
	import { authUser } from '$lib/stores/authStore';
	import { getAuth, linkWithCredential, EmailAuthProvider } from 'firebase/auth';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	type State = 'validating' | 'idle' | 'submitting' | Error;
	let state: State = 'idle';

	const toastStore = getToastStore();
	const analytics = typeof window !== 'undefined' ? getAnalytics() : null;

	let email: string | null = null;

	const login = async (magicEmail: string) => {
		state = 'submitting';
		email = magicEmail;
		try {
			const auth = getAuth();
			const credential = await signInWithMagicLink(email, window.location.href);

			// Add the user to the store so the cart icon gets updated!
			// Looks like the onAuthChange hook is not firing on a login
			// from magic email??
			let dataToSetToStore = {
				email: credential.user.email,
				displayName: credential.user.displayName,
				uid: credential.user.uid
			};

			authUser.update((curr: any) => {
				return { ...curr, ...dataToSetToStore };
			});

			const idToken = await credential.user.getIdToken();
			await fetch('/api/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					// 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
				},
				body: JSON.stringify({ idToken })
			});

			clearMagicEmail();

			try {
				const linkCredential = EmailAuthProvider.credentialWithLink(email, window.location.href);
				if (auth.currentUser) {
					const userCred = await linkWithCredential(auth.currentUser, linkCredential);
				}
			} catch (error) {
				console.error('Error linkWithCredential', error);
			}

			if (analytics) {
				logEvent(analytics, 'login');
			}

			goto('/', { invalidateAll: true, replaceState: true });
		} catch (error) {
			const t: ToastSettings = {
				background: 'variant-filled-error',
				message: 'An error occurred with your login.  Please try again'
			};
			toastStore.trigger(t);
			console.error('Error logging in', error);
			state = new Error('Error in login!');
		}
	};

	const handleSubmit = async ({ currentTarget }) => {
		login(new FormData(currentTarget).get('email') as string);
	};

	onMount(async () => {
		if (!isMagicLink(window.location.href)) {
			state = new Error('Invalid magic link: How did you get here?!');
			return;
		}

		const magicEmail = getMagicEmail();

		if (!magicEmail) {
			state = 'idle';
			return;
		}

		await login(magicEmail).catch(() => {
			state = new Error('We had a problem signing you in... Please try again? 😬');
		});
	});
</script>

{#if state instanceof Error}
	<p>{state.message}</p>
{:else if state === 'validating'}
	<p>🪄 Validating magic link 🪄</p>
{:else if state === 'submitting'}
	<p>🪄 We are signing you in as {email} 🪄</p>
{:else}
	<div class="min-h-min bg-gray-300 py-12 sm:px-6 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<h2 class="mt-6 text-center text-3xl font-extrabold text-green-600">
				Confirm your email to login
			</h2>
		</div>

		<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
			<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
				<div class="col-span-12 lg:col-span-5">
					<P class="mb-2" color="text-green-600">
						We know you just clicked a magic link, but maybe you’re logging in from a different
						device to where you requested the login?
					</P>
					<P class="mb-4" color="text-green-600">
						In any case, please fill in your email address and submit this form!
					</P>
				</div>

				<form class="space-y-6" action="#" on:submit|preventDefault={handleSubmit} method="POST">
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
							Confirm Your email address!
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
