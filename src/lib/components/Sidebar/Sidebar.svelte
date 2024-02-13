<script>
	// core components
	import { page } from '$app/stores';
	import NotificationDropdown from '$lib/components/Dropdowns/NotificationDropdown.svelte';
	import UserDropdown from '$lib/components/Dropdowns/UserDropdown.svelte';

	let collapseShow = 'hidden';

	function toggleCollapseShow(classes) {
		collapseShow = classes;
	}

	$: activeUrl = $page.url.pathname;
</script>

<nav
	class="relative z-10 flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-xl md:fixed md:bottom-0 md:left-0 md:top-0 md:block md:w-64 md:flex-row md:flex-nowrap md:overflow-hidden md:overflow-y-auto"
>
	<!-- Brand -->
	<a
		class="text-blueGray-600 mr-0 inline-block whitespace-nowrap p-4 px-0 text-left text-sm font-bold uppercase md:block md:pb-2"
		href="/"
	>
		Notus Sveltey
	</a>
	<!-- User -->
	<ul class="flex list-none flex-wrap items-center md:hidden">
		<li class="relative inline-block">
			<NotificationDropdown />
		</li>
		<li class="relative inline-block">
			<UserDropdown />
		</li>
	</ul>
	<!-- Collapse -->
	<div
		class="absolute left-0 right-0 top-0 z-40 h-auto flex-1 items-center overflow-y-auto overflow-x-hidden rounded shadow md:relative md:mt-4 md:flex md:flex-col md:items-stretch md:opacity-100 md:shadow-none {collapseShow}"
	>
		<!-- Collapse header -->
		<div class="border-blueGray-200 mb-4 block border-b border-solid pb-4 md:hidden md:min-w-full">
			<div class="flex flex-wrap">
				<div class="w-6/12">
					<a
						class="text-blueGray-600 mr-0 inline-block whitespace-nowrap p-4 px-0 text-left text-sm font-bold uppercase md:block md:pb-2"
						href="/"
					>
						Notus Sveltexx
					</a>
				</div>
				<div class="flex w-6/12 justify-end">
					<button
						type="button"
						class="cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none text-black opacity-50 md:hidden"
						on:click={() => toggleCollapseShow('hidden')}
					>
						<i class="fas fa-times"></i>
					</button>
				</div>
			</div>
		</div>
		<!-- Form -->
		<form class="mb-4 mt-6 md:hidden">
			<div class="mb-3 pt-0">
				<input
					type="text"
					placeholder="Search"
					class="border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 h-12 w-full rounded border border-0 border-solid bg-white px-3 py-2 text-base font-normal leading-snug shadow-none outline-none focus:outline-none"
				/>
			</div>
		</form>

		<!-- Divider -->
		<hr class="my-4 md:min-w-full" />
		<!-- Heading -->
		<h6
			class="text-blueGray-500 block pb-4 pt-1 text-xs font-bold uppercase no-underline md:min-w-full"
		>
			Admin Layout Pages
		</h6>
		<!-- Navigation -->

		<ul class="flex list-none flex-col md:min-w-full md:flex-col">
			<li class="items-center">
				<a
					href="/admin/dashboard"
					class="block py-3 text-xs font-bold uppercase {activeUrl.indexOf('/admin/dashboard') !==
					-1
						? 'text-red-500 hover:text-red-600'
						: 'text-blueGray-700 hover:text-blueGray-500'}"
				>
					<i
						class="fas fa-tv mr-2 text-sm {activeUrl.indexOf('/admin/dashboard') !== -1
							? 'opacity-75'
							: 'text-blueGray-300'}"
					></i>
					Dashboard
				</a>
			</li>

			<li class="items-center">
				<a
					href="/admin/settings"
					class="block py-3 text-xs font-bold uppercase {activeUrl.indexOf('/admin/settings') !== -1
						? 'text-red-500 hover:text-red-600'
						: 'text-blueGray-700 hover:text-blueGray-500'}"
				>
					<i
						class="fas fa-tools mr-2 text-sm {activeUrl.indexOf('/admin/settings') !== -1
							? 'opacity-75'
							: 'text-blueGray-300'}"
					></i>
					Settings
				</a>
			</li>

			<li class="items-center">
				<a
					href="/admin/tables"
					class="block py-3 text-xs font-bold uppercase {activeUrl.indexOf('/admin/tables') !== -1
						? 'text-red-500 hover:text-red-600'
						: 'text-blueGray-700 hover:text-blueGray-500'}"
				>
					<i
						class="fas fa-table mr-2 text-sm {activeUrl.indexOf('/admin/tables') !== -1
							? 'opacity-75'
							: 'text-blueGray-300'}"
					></i>
					Tables
				</a>
			</li>

			<li class="items-center">
				<a
					href="/admin/maps"
					class="block py-3 text-xs font-bold uppercase {activeUrl.indexOf('/admin/maps') !== -1
						? 'text-red-500 hover:text-red-600'
						: 'text-blueGray-700 hover:text-blueGray-500'}"
				>
					<i
						class="fas fa-map-marked mr-2 text-sm {activeUrl.indexOf('/admin/maps') !== -1
							? 'opacity-75'
							: 'text-blueGray-300'}"
					></i>
					Maps
				</a>
			</li>
		</ul>

		<!-- Divider -->
		<hr class="my-4 md:min-w-full" />
		<!-- Heading -->
		<h6
			class="text-blueGray-500 block pb-4 pt-1 text-xs font-bold uppercase no-underline md:min-w-full"
		>
			Auth Layout Pages
		</h6>
		<!-- Navigation -->

		<ul class="flex list-none flex-col md:mb-4 md:min-w-full md:flex-col">
			<li class="items-center">
				<a
					class="text-blueGray-700 hover:text-blueGray-500 block py-3 text-xs font-bold uppercase"
					href="/auth/login"
				>
					<i class="fas fa-fingerprint text-blueGray-300 mr-2 text-sm"></i>
					Login
				</a>
			</li>

			<li class="items-center">
				<a
					class="text-blueGray-700 hover:text-blueGray-500 block py-3 text-xs font-bold uppercase"
					href="/auth/register"
				>
					<i class="fas fa-clipboard-list text-blueGray-300 mr-2 text-sm"></i>
					Register
				</a>
			</li>
		</ul>

		<!-- Divider -->
		<hr class="my-4 md:min-w-full" />
		<!-- Heading -->
		<h6
			class="text-blueGray-500 block pb-4 pt-1 text-xs font-bold uppercase no-underline md:min-w-full"
		>
			No Layout Pages
		</h6>
		<!-- Navigation -->

		<ul class="flex list-none flex-col md:mb-4 md:min-w-full md:flex-col">
			<li class="items-center">
				<a
					class="text-blueGray-700 hover:text-blueGray-500 block py-3 text-xs font-bold uppercase"
					href="/landing"
				>
					<i class="fas fa-newspaper text-blueGray-300 mr-2 text-sm"></i>
					Landing Page
				</a>
			</li>

			<li class="items-center">
				<a
					class="text-blueGray-700 hover:text-blueGray-500 block py-3 text-xs font-bold uppercase"
					href="/profile"
				>
					<i class="fas fa-user-circle text-blueGray-300 mr-2 text-sm"></i>
					Profile Page
				</a>
			</li>
		</ul>

		<!-- Divider -->
		<hr class="my-4 md:min-w-full" />
		<!-- Heading -->
		<h6
			class="text-blueGray-500 block pb-4 pt-1 text-xs font-bold uppercase no-underline md:min-w-full"
		>
			Documentation
		</h6>
		<!-- Navigation -->
		<ul class="flex list-none flex-col md:mb-4 md:min-w-full md:flex-col">
			<li class="inline-flex">
				<a
					href="https://www.creative-tim.com/learning-lab/tailwind/svelte/colors/notus"
					target="_blank"
					class="text-blueGray-700 hover:text-blueGray-500 mb-4 block text-sm font-semibold no-underline"
				>
					<i class="fas fa-paint-brush text-blueGray-300 mr-2 text-base"></i>
					Styles
				</a>
			</li>

			<li class="inline-flex">
				<a
					href="https://www.creative-tim.com/learning-lab/tailwind/svelte/alerts/notus"
					target="_blank"
					class="text-blueGray-700 hover:text-blueGray-500 mb-4 block text-sm font-semibold no-underline"
				>
					<i class="fab fa-css3-alt text-blueGray-300 mr-2 text-base"></i>
					CSS Components
				</a>
			</li>

			<li class="inline-flex">
				<a
					href="https://www.creative-tim.com/learning-lab/tailwind/angular/overview/notus"
					target="_blank"
					class="text-blueGray-700 hover:text-blueGray-500 mb-4 block text-sm font-semibold no-underline"
				>
					<i class="fab fa-angular text-blueGray-300 mr-2 text-base"></i>
					Angular
				</a>
			</li>

			<li class="inline-flex">
				<a
					href="https://www.creative-tim.com/learning-lab/tailwind/js/overview/notus"
					target="_blank"
					class="text-blueGray-700 hover:text-blueGray-500 mb-4 block text-sm font-semibold no-underline"
				>
					<i class="fab fa-js-square text-blueGray-300 mr-2 text-base"></i>
					Javascript
				</a>
			</li>

			<li class="inline-flex">
				<a
					href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/overview/notus"
					target="_blank"
					class="text-blueGray-700 hover:text-blueGray-500 mb-4 block text-sm font-semibold no-underline"
				>
					<i class="fab fa-react text-blueGray-300 mr-2 text-base"></i>
					NextJS
				</a>
			</li>

			<li class="inline-flex">
				<a
					href="https://www.creative-tim.com/learning-lab/tailwind/react/overview/notus"
					target="_blank"
					class="text-blueGray-700 hover:text-blueGray-500 mb-4 block text-sm font-semibold no-underline"
				>
					<i class="fab fa-react text-blueGray-300 mr-2 text-base"></i>
					React
				</a>
			</li>

			<li class="inline-flex">
				<a
					href="https://www.creative-tim.com/learning-lab/tailwind/svelte/overview/notus"
					target="_blank"
					class="text-blueGray-700 hover:text-blueGray-500 mb-4 block text-sm font-semibold no-underline"
				>
					<i class="fas fa-link text-blueGray-300 mr-2 text-base"></i>
					Svelte
				</a>
			</li>

			<li class="inline-flex">
				<a
					href="https://www.creative-tim.com/learning-lab/tailwind/vue/overview/notus"
					target="_blank"
					class="text-blueGray-700 hover:text-blueGray-500 mb-4 block text-sm font-semibold no-underline"
				>
					<i class="fab fa-vuejs text-blueGray-300 mr-2 text-base"></i>
					VueJS
				</a>
			</li>
		</ul>
	</div>
</nav>
