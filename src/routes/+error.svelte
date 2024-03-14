<script>
	import { getClientApp } from '$lib/firebase/client';
	import { t } from '$lib/translations';
	import { Section, Page500 } from 'flowbite-svelte-blocks';
	import { page } from '$app/stores';
	import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';
	import { browser } from '$app/environment';

	if (browser && isSupported()) {
		const analytics = getAnalytics();
		logEvent(analytics, 'screen_view', {
			firebase_screen: 'Route_Error'
		});
	}
</script>

<Section name="page500">
	<Page500>
		<svelte:fragment slot="h1">500</svelte:fragment>
		<svelte:fragment slot="paragraph">
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
				{$t('error.internal')}
			</p>
			<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
				{$t('error.aware')}
			</p>
			<p>{$page.status}</p>
			<p>{$page.error?.message}</p>
		</svelte:fragment>
	</Page500>
</Section>
