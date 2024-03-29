<script>
	export let mb = '';
</script>

<div>
	<section class="bg-gray-50 dark:bg-gray-900 flex pt-4 mt-4 mx-4 {mb} h-fit">
		<div class=" px-4 mx-auto lg:px-12 w-full">
			<slot />
		</div>
	</section>
</div>
