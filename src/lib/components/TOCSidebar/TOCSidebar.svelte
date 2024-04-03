<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/translations';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Tooltip } from 'flowbite-svelte';
	import { Section } from 'flowbite-svelte-blocks';

	import { ArrowRightOutline, ChartSolid } from 'flowbite-svelte-icons';
	$: activeUrl = $page.url.pathname;
</script>

<Section
	name="tableheader"
	sectionClass="bg-gray-50 dark:bg-gray-900 flex py-4 ml-4 mt-4 mb-4 h-fit"
>
	<Sidebar {activeUrl} asideClass="w-80">
		<SidebarWrapper>
			<SidebarGroup class="pb-6">Terms and Conditions</SidebarGroup>
			<SidebarGroup>
				<SidebarItem label="1. OUR SERVICES" href="#services" active={activeUrl === '#services'}
				></SidebarItem>

				<SidebarItem label="2. INTELLECTUAL PROPERTY RIGHTS" href="#ip" active={activeUrl === '#ip'}
				></SidebarItem>

				<SidebarItem
					label="3. USER REPRESENTATIONS"
					href="#userreps"
					active={activeUrl === '#userreps'}
				></SidebarItem>

				<SidebarItem label="4. USER REGISTRATION" href="#userreg" active={activeUrl === '#userreg'}
				></SidebarItem>

				<SidebarItem
					label="5. PROHIBITED ACTIVITIES"
					href="#prohibited"
					active={activeUrl === '#prohibited'}
				></SidebarItem>

				<SidebarItem
					label="6. USER GENERATED CONTRIBUTIONS"
					href="#ugc"
					active={activeUrl === '#ugc'}
				></SidebarItem>

				<SidebarItem
					label="7. CONTRIBUTION LICENSE"
					href="#license"
					active={activeUrl === '#license'}
				></SidebarItem>

				<SidebarItem
					label="8. SOCIAL MEDIA"
					href="#socialmedia"
					active={activeUrl === '#socialmedia'}
				></SidebarItem>

				<SidebarItem
					label="9. THIRD-PARTY WEBSITES AND CONTENT"
					href="#thirdparty"
					active={activeUrl === '#thirdparty'}
				></SidebarItem>

				<SidebarItem
					label="10. ADVERTISERS"
					href="#advertisers"
					active={activeUrl === '#advertisers'}
				></SidebarItem>

				<SidebarItem
					label="11. SERVICES MANAGEMENT"
					href="#sitemanage"
					active={activeUrl === '#sitemanage'}
				></SidebarItem>

				<SidebarItem label="12. PRIVACY POLICY" href="#ppno" active={activeUrl === '#ppno'}
				></SidebarItem>

				<SidebarItem
					label="13. COPYRIGHT INFRINGEMENTS"
					href="#copyrightyes"
					active={activeUrl === '#copyrightyes'}
				></SidebarItem>

				<SidebarItem label="14. TERM AND TERMINATION" href="#terms" active={activeUrl === '#terms'}
				></SidebarItem>

				<SidebarItem
					label="15. MODIFICATIONS AND INTERRUPTIONS"
					href="#modifications"
					active={activeUrl === '#modifications'}
				></SidebarItem>

				<SidebarItem label="18. CORRECTIONS" href="#law" active={activeUrl === '#law'}
				></SidebarItem>

				<SidebarItem label="19. DISCLAIMER" href="#disclaimer" active={activeUrl === '#disclaimer'}
				></SidebarItem>

				<SidebarItem
					label="20. LIMITATIONS OF LIABILITY"
					href="#liability"
					active={activeUrl === '#liability'}
				></SidebarItem>

				<SidebarItem
					label="21. INDEMNIFICATION"
					href="#indemnification"
					active={activeUrl === '#indemnification'}
				></SidebarItem>

				<SidebarItem label="22. USER DATA" href="#userdata" active={activeUrl === '#userdata'}
				></SidebarItem>

				<SidebarItem
					label="23. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES"
					href="#electronic"
					active={activeUrl === '#electronic'}
				></SidebarItem>

				<SidebarItem
					label="24. CALIFORNIA USERS AND RESIDENTS"
					href="#california"
					active={activeUrl === '#california'}
				></SidebarItem>

				<SidebarItem label="25. MISCELLANEOUS" href="#misc" active={activeUrl === '#misc'}
				></SidebarItem>

				<SidebarItem label="26. CONTACT US" href="#contact" active={activeUrl === '#contact'}
				></SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
</Section>
