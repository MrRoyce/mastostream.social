<script lang="ts">
	import { formatText, truncateHTML } from '$lib/utils';

	export let toot;
	export let limit = 5000;

	const content = toot.content; //limit ? truncateHTML(toot.content, limit) : toot.content;

	const text = formatText(
		content
			.replaceAll('</p><p>', '</p><br /><p>')
			.replaceAll('class="invisible"', 'class="font-medium text-green-400 underline"')
			.replaceAll('class="ellipsis"', 'class="font-medium text-green-400 underline"'),
		'underline text-green-400'
	);
</script>

<p class=" pb-2 text-base overflow-x-clip flex-wrap dark:text-gray-200">
	{@html text}
</p>
