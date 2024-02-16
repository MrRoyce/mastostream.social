<script lang="ts">
	import { browser } from '$app/environment';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import { Section } from 'flowbite-svelte-blocks';
	import TootTable from '$lib/components/UI/TootTable.svelte';

	export let data: PageData;
	const entity = data.entity;
	const toots = data.toots;

	let domain: string;

	try {
		domain = new URL(entity?.url).hostname;
	} catch (error) {
		if (browser) {
			goto('/accounts/notfound');
		}
	}

	const tableData = {
		color: 'blue',
		hoverable: true,
		striped: true,
		tableHead: ['Created At', 'Safe', 'Content']
	};
</script>

<Section class="bg-white dark:bg-gray-700">
	<div class="dark:bg-gray-800">
		<div class="container mx-auto my-5 p-5">
			<div class="md:flex no-wrap md:-mx-2">
				<!-- Left Side -->
				<div class="w-full md:w-3/12 md:mx-2">
					<!-- Profile Card -->
					<div class="bg-grey-900 p-3 border-t-4 border-green-400">
						<div class="image overflow-hidden">
							<img class="h-auto w-full mx-auto" src={entity.avatar} alt="" />
						</div>
						<h1 class=" text-white font-bold text-xl leading-8 my-1">{entity.username}</h1>
						<h3 class="text-white font-lg text-semibold leading-6">
							<a
								target="_blank"
								href={entity.url}
								class="inline-flex items-center text-primary-600 hover:underline"
							>
								View at {domain}
								<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
							</a>
						</h3>
						<ul
							class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm"
						>
							<li class="flex items-center py-3">
								<span>Status</span>
								<span class="ml-auto"
									><span class="bg-green-500 py-1 px-2 rounded text-white text-sm">Active</span
									></span
								>
							</li>
							<li class="flex items-center py-3">
								<span>Member since</span>
								<span class="ml-auto">Nov 07, 2016</span>
							</li>
						</ul>
					</div>
					<!-- End of profile card -->
					<div class="my-4"></div>
					<!-- Friends card -->
					<div class="bg-grey-900 p-3 hover:shadow">
						<div class="flex items-center space-x-3 font-semibold text-gray-900 text-xl leading-8">
							<span class="text-green-500">
								<svg
									class="h-5 fill-current"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
							</span>
							<span>Similar Profiles</span>
						</div>
						<div class="grid grid-cols-3">
							<div class="text-center my-2">
								<img
									class="h-16 w-16 rounded-full mx-auto"
									src="https://cdn.australianageingagenda.com.au/wp-content/uploads/2015/06/28085920/Phil-Beckett-2-e1435107243361.jpg"
									alt=""
								/>
								<a href="#" class="text-main-color">Kojstantin</a>
							</div>
							<div class="text-center my-2">
								<img
									class="h-16 w-16 rounded-full mx-auto"
									src="https://avatars2.githubusercontent.com/u/24622175?s=60&amp;v=4"
									alt=""
								/>
								<a href="#" class="text-main-color">James</a>
							</div>
							<div class="text-center my-2">
								<img
									class="h-16 w-16 rounded-full mx-auto"
									src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
									alt=""
								/>
								<a href="#" class="text-main-color">Natie</a>
							</div>
							<div class="text-center my-2">
								<img
									class="h-16 w-16 rounded-full mx-auto"
									src="https://bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com/public/images/f04b52da-12f2-449f-b90c-5e4d5e2b1469_361x361.png"
									alt=""
								/>
								<a href="#" class="text-main-color">Casey</a>
							</div>
						</div>
					</div>
					<!-- End of friends card -->
				</div>
				<!-- Right Side -->
				<div class="w-full md:w-9/12 mx-2 h-64">
					<!-- Profile tab -->
					<!-- About Section -->
					<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
						<div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
							<span clas="text-green-500">
								<svg
									class="h-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
							</span>
							<span class="tracking-wide">About</span>
						</div>
						<div class="text-gray-700"></div>
						<button
							class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4"
							>Show Full Information</button
						>
					</div>
					<!-- End of about section -->

					<div class="my-4 text-white"><h2>Latest toots from {entity.username}</h2></div>

					<!-- Experience and education -->
					<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
						<TootTable
							{tableData}
							sourceData={toots}
							getData={() => {}}
							entity={`Toots from ${entity.username}`}
						/>
					</div>
					<!-- End of profile tab -->
				</div>
			</div>
		</div>
	</div>
</Section>

<!-- component -->
<style>
	:root {
		--main-color: #4a76a8;
	}

	.bg-main-color {
		background-color: var(--main-color);
	}

	.text-main-color {
		color: var(--main-color);
	}

	.border-main-color {
		border-color: var(--main-color);
	}
</style>
