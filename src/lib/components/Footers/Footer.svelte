<script>
	import logo from '$lib/assets/logo.svg';
	import { t } from '$lib/translations';
	import {
		Footer,
		FooterBrand,
		FooterLinkGroup,
		FooterLink,
		FooterCopyright,
		A,
		P
	} from 'flowbite-svelte';
	import { TableWrap } from '$lib/components';
	const mb = 'mb-4';
</script>

<TableWrap {mb} divContainerPadding="px-4">
	<div
		class="dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4 p-4"
	>
		<div class="dark:bg-gray-900 pt-4 px-4">
			<!--  Mission Statement-->
			<div>
				<FooterBrand
					href="https://utoots.com"
					src={logo}
					alt="U Toots Logo"
					name="U Toots"
					aClass="flex mb-4"
					classSpan="dark:text-green-400"
					classImg="w-0"
				/>
				<P class="text-gray-600 dark:text-gray-400">
					{$t('general.vision')}
					We are a tiny team with a huge vision for a user focused community on the internet.
				</P>
				<P class="text-gray-600 dark:text-gray-400 pt-4">
					Please, if you are able, consider supporting us: <A
						color="dark:text-green-400"
						href="https://patreon.com/UToots"
						target="_blank">patreon.com/UToots</A
					>
				</P>
			</div>
			<Footer class="dark:bg-gray-900" footerType="socialmedia">
				<div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-3 lg:gap-12">
					<!-- Resources -->
					<div>
						<h2 class="mb-4 text-sm font-semibold dark:text-gray-200 uppercase">Resources</h2>
						<FooterLinkGroup>
							<FooterLink liClass="mb-2" href="https://utoots.com/">UToots</FooterLink>
							<FooterLink liClass="mb-2" href="/contact">Contact Us</FooterLink>
						</FooterLinkGroup>
					</div>

					<!-- Policies -->
					<div>
						<h2 class="mb-6 text-sm font-semibold dark:text-gray-200 uppercase">Policies</h2>
						<FooterLinkGroup>
							<FooterLink liClass="mb-2" href="/tac">Terms and Conditions</FooterLink>
							<FooterLink liClass="mb-2" href="/privacy">Privacy</FooterLink>
							<FooterLink liClass="mb-2" href="/cookies">Cookies</FooterLink>
						</FooterLinkGroup>
					</div>

					<!-- legal -->
					<div>
						<h2 class="mb-6 text-sm font-semibold dark:text-gray-200 uppercase">Legal</h2>
						<FooterLinkGroup>
							<FooterLink liClass="mb-2" href="/tac#copyrightyes">TAC DMCA</FooterLink>
							<FooterLink liClass="mb-2" href="https://www.copyright.gov/legislation/dmca.pdf"
								>U.S. DMCA</FooterLink
							>
							<FooterLink liClass="mb-2" href="https://www.missingkids.org/home">CMEC</FooterLink>
						</FooterLinkGroup>
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
