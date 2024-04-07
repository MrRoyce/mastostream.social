<script>
	import logo from '$lib/assets/logo.svg';
	import { t } from '$lib/translations';
	import {
		Footer,
		FooterBrand,
		FooterLinkGroup,
		FooterLink,
		FooterCopyright
	} from 'flowbite-svelte';
	import { TableWrap } from '..';
	const mb = 'mb-4';
</script>

<TableWrap {mb}>
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class="dark:bg-gray-900 p-4">
			<!--  Mission Statement-->
			<div>
				<FooterBrand
					href="https://utoots.com"
					src={logo}
					alt="U Toots Logo"
					name="U Toots"
					aClass="flex mb-6"
				/>
				<p class="text-gray-600 dark:text-gray-400">
					{$t('general.vision')}
				</p>
			</div>
			<Footer class="dark:bg-gray-900" footerType="socialmedia">
				<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-3 lg:gap-12">
					<!-- Resources -->
					<div>
						<h2 class="mb-6 text-sm font-semibold dark:text-gray-200 uppercase">Resources</h2>
						<FooterLinkGroup>
							<FooterLink liClass="mb-4" href="https://utoots.com/">UToots</FooterLink>
							<FooterLink liClass="mb-4" href="/contact">Contact Us</FooterLink>
						</FooterLinkGroup>
					</div>

					<!-- Policies -->
					<div>
						<h2 class="mb-6 text-sm font-semibold dark:text-gray-200 uppercase">Policies</h2>
						<FooterLinkGroup>
							<FooterLink liClass="mb-4" href="/tac">Terms and Conditions</FooterLink>
							<FooterLink liClass="mb-4" href="/privacy">Privacy</FooterLink>
							<FooterLink liClass="mb-4" href="/cookies">Cookies</FooterLink>
						</FooterLinkGroup>
					</div>

					<!-- Policies -->
					<div>
						<h2 class="mb-6 text-sm font-semibold dark:text-gray-200 uppercase">Legal</h2>
					</div>
				</div>
				<hr class="my-4 border-gray-200 sm:mx-auto dark:border-gray-700" />
				<div class="sm:flex sm:items-center sm:justify-between">
					<FooterCopyright href="/" by="U Toots™" />
				</div>
			</Footer>
		</div>
	</div></TableWrap
>
