<script>
	export let mb = '';
	export let spacing = 'mx-4'; // mx-4
	export let divContianerPadding = 'px-4';
</script>

<div>
	<section class="bg-gray-50 dark:bg-gray-900 flex pt-4 mt-4 {spacing} {mb} h-fit">
		<div class=" {divContianerPadding} mx-auto w-full">
			<slot />
		</div>
	</section>
</div>
