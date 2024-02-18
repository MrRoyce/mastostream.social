<script lang="ts">
	import CardStats from '$lib/components/Cards/CardStats.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const accounts: string = data.accounts;
	const languages: string = data.languages;
	const tags: string = data.tags;
	const toots: string = data.toots;
	const domains: string = data.domains;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600">
		<div class=" transform transition duration-500 hover:scale-110">
			<a href="/toots">
				<CardStats
					statSubtitle="TOOTS"
					statTitle={toots}
					statArrow="up"
					statPercent="3.48"
					statPercentColor="text-emerald-500"
					statDescripiron="Since last month"
					statIconName="far fa-chart-bar"
					statIconColor="bg-red-500"
				/>
			</a>
		</div>
	</div>
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600">
		<div class=" transform transition duration-500 hover:scale-110">
			<a href="/websites">
				<CardStats
					statSubtitle="WEB SITES"
					statTitle={domains}
					statArrow="up"
					statPercent="3.48"
					statPercentColor="text-emerald-500"
					statDescripiron="Since last month"
					statIconName="far fa-chart-bar"
					statIconColor="bg-red-500"
				/>
			</a>
		</div>
	</div>
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600">
		<div class=" transform transition duration-500 hover:scale-110">
			<a href="/tags">
				<CardStats
					statSubtitle="TAGS"
					statTitle={tags}
					statArrow="down"
					statPercent="3.48"
					statPercentColor="text-red-500"
					statDescripiron="Since last week"
					statIconName="fas fa-chart-pie"
					statIconColor="bg-orange-500"
				/>
			</a>
		</div>
	</div>
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600">
		<div class=" transform transition duration-500 hover:scale-110">
			<a href="/languages">
				<CardStats
					statSubtitle="LANGUAGES"
					statTitle={languages}
					statArrow="down"
					statPercent="1.10"
					statPercentColor="text-orange-500"
					statDescripiron="Since yesterday"
					statIconName="fas fa-users"
					statIconColor="bg-pink-500"
				/></a
			>
		</div>
	</div>
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600">
		<div class=" transform transition duration-500 hover:scale-110">
			<a href="/accounts">
				<CardStats
					statSubtitle="ACCOUNTS"
					statTitle={accounts}
					statArrow="up"
					statPercent="12"
					statPercentColor="text-emerald-500"
					statDescripiron="Since last month"
					statIconName="fas fa-percent"
					statIconColor="bg-emerald-500"
				/>
			</a>
		</div>
	</div>
</div>
