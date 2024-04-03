<script>
	export let mb = '';
</script>

<div>
	<section class="bg-gray-50 dark:bg-gray-900 flex pt-4 mt-4 mx-4 {mb} h-fit">
		<div class="max-w-screen-xl px-4 mx-auto w-full mb-4">
			<slot />
		</div>
	</section>
</div>
