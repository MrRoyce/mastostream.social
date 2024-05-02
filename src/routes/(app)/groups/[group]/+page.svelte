<script lang="ts">
	import { TableWrap } from '$lib/components';
	import { Heading } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { group } = data;
</script>

<TableWrap divContainerPadding="px-4">
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class="dark:bg-gray-900 p-4">
			<div class="grid grid-cols-2 gap-4">
				<Heading tag="h3">{group} Group</Heading>
			</div>
		</div>
	</div>
</TableWrap>
