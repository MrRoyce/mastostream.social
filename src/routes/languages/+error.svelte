<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="text-cyan-50">{$page.status}: {$page.error?.message}</h1>
