<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="text-gray-200">Yikes!!</h1>

<p class="text-gray-200">An error occurred in the search route!</p>

<h1 class="text-gray-200">{$page.status}: {$page.error?.message}</h1>

<pre class="text-gray-200">
  {JSON.stringify($page, null, 2)}
</pre>
