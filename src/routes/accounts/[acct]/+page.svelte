<script lang="ts">
	import { browser } from '$app/environment';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import type { PageData } from '../$types';
	import { Section } from 'flowbite-svelte-blocks';
	import TootTable from '$lib/components/UI/TootTable.svelte';
	import { Li, List } from 'flowbite-svelte';

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
		tableHead: ['Created At', 'Safe', 'Content', 'Link']
	};

	function fixNoteText(inputString: string, classToAdd: string) {
		let modifiedString;
		modifiedString = inputString;

		// Regular expression to match an anchor tag
		const anchorTagRegex = /<a\b[^>]*>(.*?)<\/a>/;

		// Check if the input string contains an anchor tag
		if (modifiedString && anchorTagRegex.test(modifiedString)) {
			// Extract the anchor tag
			let anchorTag = modifiedString.match(anchorTagRegex)[0];

			// Check if the anchor tag already has a class attribute
			if (anchorTag.indexOf('class=') === -1) {
				// If no class attribute exists, add it with the provided class value
				const updatedAnchorTag = anchorTag.replace('<a ', '<a class="' + classToAdd + '" ');
				return modifiedString.replace(anchorTagRegex, updatedAnchorTag);
			} else {
				// If class attribute exists, add the passed-in class value to it
				const updatedAnchorTag = anchorTag.replace(
					/class="([^"]*)"/,
					'class="$1 ' + classToAdd + '"'
				);
				return modifiedString.replace(anchorTagRegex, updatedAnchorTag);
			}
		} else {
			// If no anchor tag is found, return the original string
			return modifiedString;
		}
	}
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
						<span class="ml-auto"
							><span
								class="{entity.locked
									? 'bg-red-500'
									: 'bg-green-500'} py-1 px-2 rounded text-white text-sm"
								>{entity.locked ? 'Locked' : 'Public'}</span
							></span
						>
						<span class=" ml-3 text-gray-200 font-bold text-xl leading-8 my-1"
							>{entity.username}</span
						>
						<h3 class="text-white font-lg text-semibold leading-6 pt-5">
							<a target="_blank" href={entity.url} class="inline-flex items-center hover:underline">
								{domain}
								<ArrowUpRightFromSquareOutline class="w-3 h-3 ms-2.5" />
							</a>
						</h3>
						<List list="none">
							<Li class="ml-auto text-gray-300 my-1"
								>Started: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.createdAt.split('T')[0]}</span
								></Li
							>
							<Li class="ml-auto text-gray-300 my-1"
								># Toots: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.statusesCount}</span
								></Li
							>
							<Li class="ml-auto text-gray-300 my-1"
								>Following: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.followingCount}</span
								></Li
							>
							<Li class="ml-auto text-gray-300 my-1"
								>Followers: <span class="mr-3 bg-green-500 px-1 rounded text-white text-sm"
									>{entity.followersCount}</span
								></Li
							>
						</List>
					</div>
				</div>
				<!-- Right Side -->
				<div class="w-full md:w-9/12 mx-2">
					<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
						<div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
							<div class="text-gray-700">
								<img src={entity.header} alt="User" />
							</div>
						</div>
						<h3 class="mt-5">
							<span class="pt-10 ml-auto text-gray-200 my-1">@{entity.acct}</span>
						</h3>
						<div class="mt-7 text-gray-200">
							<p>
								{@html fixNoteText(
									entity.note
										.replaceAll('</p><p>', '</p><br /><p>')
										.replaceAll('class="invisible"', ''),
									'underline text-green-200'
								)}
							</p>
						</div>

						<List list="none">
							{#each entity.fields as field}
								<Li><span class="text-gray-200 mr-3">{field.name.toUpperCase()}:</span></Li><Li
									class=" pl-4 mb-4"
								>
									<span class="text-gray-200 mr-3"
										>{@html fixNoteText(
											field.value.replaceAll('class="invisible"', ''),
											'underline text-green-200'
										)}</span
									></Li
								>
							{/each}
						</List>
					</div>
				</div>
			</div>
			<div class="my-4 text-white">
				<h2 class="text-gray-200 font-bold text-xl leading-8 my-1">
					Latest toots from {entity.username}
				</h2>

				<TootTable
					{tableData}
					sourceData={toots}
					getData={() => {}}
					entity={`Toots from ${entity.username}`}
				/>
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