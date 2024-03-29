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
	import { TableWrap } from '..';
	let year = new Date().getFullYear();
	const mb = 'mb-4';
</script>

<TableWrap {mb}>
	<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
		<Footer footerType="socialmedia">
			<div class="grid gap-12 lg:grid-cols-6 lg:gap-24">
				<div class="col-span-2">
					<FooterBrand
						href="https://utoots.com"
						src="/images/logo.svg"
						alt="UToots Logo"
						name="UToots"
						aClass="flex mb-6"
					/>
					<p class="text-gray-600 dark:text-gray-400">
						U Toots is a discovery site for Mastodon toots. It respects users privacy (private toots
						are not searchable) and the standard Mastodon code regarding lawful content.
					</p>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">
						Resources
					</h2>
					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="https://utoots.com/">UToots</FooterLink>
						<FooterLink liClass="mb-4" href="/contact">Contact Us</FooterLink>
					</FooterLinkGroup>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">
						HELP & SUPPORT
					</h2>
					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="https://utoots.com">Discord</FooterLink>
						<FooterLink liClass="mb-4" href="https://utoots.com">GitHub</FooterLink>
					</FooterLinkGroup>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">
						Follow us
					</h2>
					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="https://utoots.com">Gihub</FooterLink>
						<FooterLink liClass="mb-4" href="https://utoots.com">Discord</FooterLink>
					</FooterLinkGroup>
				</div>
				<div>
					<h2 class="mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white">Legal</h2>
					<FooterLinkGroup>
						<FooterLink liClass="mb-4" href="https://utoots/com">LICENSE</FooterLink>
					</FooterLinkGroup>
				</div>
			</div>
			<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<div class="sm:flex sm:items-center sm:justify-between">
				<FooterCopyright href="/" by="U Toots™" {year} />
				<div class="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
					<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" />
					<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" />
					<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" />
					<FooterIcon href="/" class="text-gray-400 hover:text-gray-900" />
				</div>
			</div>
		</Footer>
	</div></TableWrap
>
