<script lang="ts">
	import type { PageData } from '../$types';
	import { formatText } from '$lib/utils/formatText';

	export let data: PageData;
	const entity = data.entity;
	console.log('entity', entity);
</script>

<div class="dark:bg-gray-800">
	<div class="container mx-auto my-5 p-5">
		<div class="md:flex no-wrap md:-mx-2">
			<!-- Right Side -->
			<div class="w-full mx-2">
				<div class="bg-grey-900 p-3 shadow-sm rounded-sm">
					<div class="mt-7 text-gray-200">
						<p>
							{@html formatText(
								entity.content
									.replaceAll('</p><p>', '</p><br /><p>')
									.replaceAll('class="invisible"', ''),
								'underline text-green-200'
							)}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- component -->
<style>
	:root {
		--main-color: #4a76a8;
	}

	.bg-main-color {
		background-color: var(--main-color);
	}

	.text-main-color {
		color: var(--main-color);
	}

	.border-main-color {
		border-color: var(--main-color);
	}
</style>
