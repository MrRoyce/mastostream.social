<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>Yikes!!</h1>

<p>An error occurred in the dashboard</p>

<h1>{$page.status}: {$page.error?.message}</h1>

<pre>
  {JSON.stringify($page, null, 2)}
</pre>
