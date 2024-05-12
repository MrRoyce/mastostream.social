<script>
	import { t } from '$lib/translations';
	import { Section, Page500, Page404 } from 'flowbite-svelte-blocks';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { redirectPage } from '$lib/utils/redirectPage';
	import { TableWrap } from '$lib/components';
	import { Button } from 'flowbite-svelte';

	function redirectToPage() {
		redirectPage(5, ``);
	}

	if (browser) {
		redirectToPage();
	}
</script>

{#if $page.status === 404}
	<TableWrap divContainerPadding="px-4">
		<Page404>
			<svelte:fragment slot="h1">404</svelte:fragment>
			<svelte:fragment slot="paragraph">
				<p class="mb-4 text-3xl tracking-tight font-bold text-gray-200 md:text-4xl">
					Something's missing.
				</p>
				<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-200">
					Sorry, we can't find that page. You'll find lots to explore on the dashboard page. Please
					click here if you are not redirected
				</p>
				<Button href={`/`} size="lg" color="red">Back to the dashboard</Button>
			</svelte:fragment>
		</Page404>
	</TableWrap>
{:else}
	<!-- else content here -->

	<Section name="page500">
		<Page500>
			<svelte:fragment slot="h1">500</svelte:fragment>
			<svelte:fragment slot="paragraph">
				<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
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
{/if}
