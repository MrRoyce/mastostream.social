<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { getAnalytics, logEvent } from 'firebase/analytics';

	import { auth, db } from '$lib/firebase/client';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { doc, setDoc } from 'firebase/firestore';
	import type { PageData } from './$types';

	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	export let data: PageData;

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
			console.log('error in register sign_up', error);
		}
	}

	async function signInWithEmailAndPW() {
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

		goto('/', { invalidateAll: true, replaceState: true });
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

		goto('/', { invalidateAll: true, replaceState: true });
	}
</script>

{#if data.email}
	{#if browser}
		{goto('/')}
	{/if}
{:else}
	<div class="py-20">
		<div class="min-h-min bg-gray-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<img
					class="mx-auto h-10 w-auto"
					src="https://www.svgrepo.com/show/301692/login.svg"
					alt="Workflow"
				/>
				<h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
					Create a new account
				</h2>
				<p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
					Or
					<a
						href="/login"
						class="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
					>
						login to your account
					</a>
				</p>
			</div>

			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
				<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<div class="flex flex-row justify-center divide-x divide-solid py-12 sm:px-6 lg:px-8">
						<div class="w-1/2 p-4">
							<form class="space-y-6" method="POST" action="#">
								<div>
									<label for="username" class="block text-sm font-medium text-gray-700"
										>Username</label
									>
									<div class="mt-1">
										<input
											id="username"
											name="username"
											placeholder="username"
											type="text"
											required
											value=""
											class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										/>
									</div>
								</div>

								<div class="mt-6">
									<label for="email" class="block text-sm font-medium leading-5 text-gray-700">
										Email address
									</label>
									<div class="mt-1 relative rounded-md shadow-sm">
										<input
											id="email"
											name="email"
											bind:value={email}
											placeholder="user@example.com"
											type="email"
											required
											class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-gray-900
                  "
										/>
										<div
											class="hidden absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
										>
											<svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									</div>
								</div>

								<div class="mt-6">
									<label for="password" class="block text-sm font-medium leading-5 text-gray-700">
										Password
									</label>
									<div class="mt-1 rounded-md shadow-sm">
										<input
											id="password"
											name="password"
											bind:value={password}
											type="password"
											required
											class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-gray-900"
										/>
									</div>
								</div>

								<div class="mt-6">
									<label
										for="password_confirmation"
										class="block text-sm font-medium leading-5 text-gray-700"
									>
										Confirm Password
									</label>
									<div class="mt-1 rounded-md shadow-sm">
										<input
											id="password_confirmation"
											name="password_confirmation"
											type="password"
											required
											class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-gray-900"
										/>
									</div>
								</div>

								<div class="mt-6">
									<span class="block w-full rounded-md shadow-sm">
										<button
											type="button"
											class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											on:click={signInWithEmailAndPW}
										>
											Create an Account
										</button>
									</span>
								</div>
							</form>
						</div>
						<div class="w-1/2 p-4">
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
			</div>
		</div>
	</div>
{/if}
