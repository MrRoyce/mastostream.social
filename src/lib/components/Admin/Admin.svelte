<script lang="ts">
	import AdminCard from '$lib/components/UI/AdminCard.svelte';

	export let accounts;
</script>

<div class="flex flex-row sm:flex-row justify-evenly items-stretch .grid-col-4 col-span-12">
	<AdminCard href="/admin/accounts" cardName="Accounts" length={accounts} />
</div>
