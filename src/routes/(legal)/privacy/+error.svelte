<script lang="ts">
  import { page } from '$app/stores';
  import { Page500, Section } from 'flowbite-svelte-blocks';
</script>

<h1>Yikes!!</h1>

<p>An error occurred in login confirmation!</p>

<h1>{$page.status}: {$page.error?.message}</h1>

<pre>
  {JSON.stringify($page, null, 2)}
</pre>

<Section name="page500">
  <Page500>
    <svelte:fragment slot="h1">500</svelte:fragment>
    <svelte:fragment slot="paragraph">
      <p
        class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white"
      >
        Internal Server Error in confirm
      </p>
      <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
        We are already working to solve the problem.
      </p>
      <h1>{$page.status}: {$page.error?.message}</h1>

      <pre>
        {JSON.stringify($page, null, 2)}
      </pre>
    </svelte:fragment>
  </Page500>
</Section>
