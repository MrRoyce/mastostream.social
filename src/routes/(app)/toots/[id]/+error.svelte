<script>
	import { Section, Page500 } from 'flowbite-svelte-blocks';
	import { page } from '$app/stores';
	import { getAnalytics, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';

	if (browser) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Route_Toots_[id]_Error'
		});
	}
</script>

<Section name="page500">
	<Page500>
		<svelte:fragment slot="h1">500</svelte:fragment>
		<svelte:fragment slot="paragraph">
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
				Internal Server Error.
			</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
				We are already working to solve the problem.
			</p>
			<p>{$page.status}</p>
			<p>{$page.error?.message}</p>
		</svelte:fragment>
	</Page500>
</Section>
