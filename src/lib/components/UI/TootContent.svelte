<script lang="ts">
	import { formatText } from '$lib/utils';

	export let toot;
</script>

<p class="pt-8 pb-8 text-2xl overflow-x-clip flex-wrap dark:text-gray-200">
	{@html formatText(
		toot.content
			.replaceAll('</p><p>', '</p><br /><p>')
			.replaceAll('class="invisible"', 'class="font-medium text-green-400 underline"')
			.replaceAll('class="ellipsis"', 'class="font-medium text-green-400 underline"'),
		'underline text-green-400'
	)}
</p>
