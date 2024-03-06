<script>
	import { Section } from 'flowbite-svelte-blocks';
	//import { Facebook, Instagram, Github, Twitter } from '../utils';
	import {
		Footer,
		FooterBrand,
		FooterLinkGroup,
		FooterLink,
		FooterCopyright,
		FooterIcon
	} from 'flowbite-svelte';
	let year = new Date().getFullYear();
</script>

<main class="container mx-auto">
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<Footer footerType="socialmedia">
			<div class="grid gap-12 lg:grid-cols-6 lg:gap-24">
				<div class="col-span-2">
					<FooterBrand
						href="https://yourtoots.com"
						src="/images/logo.svg"
						alt="YourToots Logo"
						name="YourToots"
						aClass="flex mb-6"
					/>
					<p class="text-gray-600 dark:text-gray-400">
						YourToots is an ecosystem built on top of Tailwind CSS including a component library,
						block sections, a Figma design system and other resources.
					</p>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">
						Resources
					</h2>
					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="https://flowbite.com/">YourToots</FooterLink>
						<FooterLink liClass="mb-4" href="https://tailwindcss.com/">Tailwind CSS</FooterLink>
						<FooterLink liClass="mb-4" href="https://flowbite-svelte.com/"
							>YourToots-Svelte</FooterLink
						>
					</FooterLinkGroup>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">
						HELP & SUPPORT
					</h2>
					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="https://discord.gg/4eeurUVvTy">Discord</FooterLink>
						<FooterLink liClass="mb-4" href="https://github.com/themesberg/flowbite-svelte-blocks"
							>GitHub</FooterLink
						>
					</FooterLinkGroup>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">
						Follow us
					</h2>
					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="https://github.com/shinokada/flowbite-svelte-blocks"
							>Gihub</FooterLink
						>
						<FooterLink liClass="mb-4" href="https://discord.gg/4eeurUVvTy">Discord</FooterLink>
					</FooterLinkGroup>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">Legal</h2>
					<FooterLinkGroup>
						<FooterLink
							liClass="mb-4"
							href="https://github.com/themesberg/flowbite-svelte-blocks/blob/main/License"
							>LICENSE</FooterLink
						>
					</FooterLinkGroup>
				</div>
			</div>
			<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<div class="sm:flex sm:items-center sm:justify-between">
				<FooterCopyright href="/" by="Your Toots™" {year} />
				<div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
					<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" />
					<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" />
					<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" />
					<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" />
				</div>
			</div>
		</Footer>
	</div>
</main>
