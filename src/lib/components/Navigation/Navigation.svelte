<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a on:click={drawerClose} href="/"><span class="dark:text-white">Dashboard</span></a></li>
		<li>
			<a on:click={drawerClose} href="/accounts"><span class="dark:text-white">Accounts</span></a>
		</li>
		<li><a on:click={drawerClose} href="/toots"><span class="dark:text-white">Toots</span></a></li>
		<li>
			<a on:click={drawerClose} href="/websites"><span class="dark:text-white">Web Sites</span></a>
		</li>
		<li><a on:click={drawerClose} href="/tags"><span class="dark:text-white">Tags</span></a></li>
		<li>
			<a on:click={drawerClose} href="/languages"><span class="dark:text-white">Languages</span></a>
		</li>
		<li>
			<a on:click={drawerClose} href="/search"
				><span class="dark:text-white">Full Text Search</span></a
			>
		</li>
	</ul>
</nav>
