<script lang="ts">
	import { redirectPage } from '$lib/utils/redirectPage';
	import { Button } from 'flowbite-svelte';
	import { Page404 } from 'flowbite-svelte-blocks';

	export let route: string;

	function redirectToPage() {
		redirectPage(5, `/${route}`);
	}

	redirectToPage();
</script>

<Page404>
	<svelte:fragment slot="h1">404</svelte:fragment>
	<svelte:fragment slot="paragraph">
		<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
			Something's missing.
		</p>
		<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
			Sorry, we can't find that page. You'll find lots to explore on the /{route} page. Please click
			here if you are not redirected
		</p>
		<Button href={`/${route}`} size="lg" color="red">Back to /{route}</Button>
	</svelte:fragment>
</Page404>
