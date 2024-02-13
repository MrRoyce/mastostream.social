<script>
	// core components
	import UserDropdown from '$lib/components/Dropdowns/UserDropdown.svelte';

	const image = '';
</script>

<!-- Navbar -->
<nav
	class="absolute left-0 top-0 z-10 flex w-full items-center bg-transparent p-4 md:flex-row md:flex-nowrap md:justify-start"
>
	<div
		class="mx-autp flex w-full flex-wrap items-center justify-between px-4 md:flex-nowrap md:px-10"
	>
		<!-- Brand -->
		<a
			class="hidden text-sm font-semibold uppercase text-white lg:inline-block"
			href="#pablo"
			on:click={(e) => e.preventDefault()}
		>
			Dashboard
		</a>
		<!-- Form -->
		<form class="mr-3 hidden flex-row flex-wrap items-center md:flex lg:ml-auto">
			<div class="relative flex w-full flex-wrap items-stretch">
				<span
					class="text-blueGray-300 absolute absolute z-10 h-full w-8 items-center justify-center rounded bg-transparent py-3 pl-3 text-center text-base font-normal leading-snug"
				>
					<i class="fas fa-search"></i>
				</span>
				<input
					type="text"
					placeholder="Search here..."
					class="placeholder-blueGray-300 text-blueGray-600 relative w-full rounded border-0 bg-white bg-white px-3 py-3 pl-10 text-sm shadow outline-none focus:outline-none focus:ring"
				/>
			</div>
		</form>
		<!-- User -->
		<ul class="hidden list-none flex-col items-center md:flex md:flex-row">
			<UserDropdown />
		</ul>
	</div>
</nav>
<!-- End Navbar -->
