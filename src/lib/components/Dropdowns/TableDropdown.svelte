<script>
	// library for creating dropdown menu appear on click

	// core components
</script>

<div>
	<a class="text-blueGray-500 px-3 py-1" href="#pablo">
		<i class="fas fa-ellipsis-v"></i>
	</a>
	<div
		class="z-50 float-left min-w-48 list-none rounded bg-white py-2 text-left text-base shadow-lg {dropdownPopoverShow
			? 'block'
			: 'hidden'}"
	>
		<a
			href="#pablo"
			on:click={(e) => e.preventDefault()}
			class="text-blueGray-700 block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal"
		>
			Action
		</a>
		<a
			href="#pablo"
			on:click={(e) => e.preventDefault()}
			class="text-blueGray-700 block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal"
		>
			Another action
		</a>
		<a
			href="#pablo"
			on:click={(e) => e.preventDefault()}
			class="text-blueGray-700 block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal"
		>
			Something else here
		</a>
	</div>
</div>
