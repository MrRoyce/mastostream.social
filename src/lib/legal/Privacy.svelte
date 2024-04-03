<script>
	import { Section, BlogTemplate } from 'flowbite-svelte-blocks';
	const blog = {
		id: 'blog-2',
		title: 'PRIVACY NOTICE',
		lead: 'U PRIVACY NOTICE is only available in English.  You may use a translation of this to your native language, to get a general idea, but the official document is shown here.',
		author: {
			name: 'U Toots, LLC',
			title: ''
		},
		date: 'April 2024',
		content: `

<P weight="light" class="mb-3 text-gray-500 dark:text-gray-400"
	>This privacy notice for U Toots, LLC ("we," "us," or "our " ), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:</P
>

<P weight="light" class="mb-3 text-gray-500 dark:text-gray-400"
	>Questions or concerns?&nbsp;Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services.</P
>

<P class="my-3 md:text-xl" weight="light" size="lg" cxolor="text-gray-500 dark:text-gray-400"
	>SUMMARY OF KEY POINTS.</P
>

<P weight="light" class="mb-3 text-gray-500 dark:text-gray-400"
	></P
>
`
	};
</script>

<div class="border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
	<Section
		name="blog"
		classSection="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 overflow-y-auto "
	>
		<BlogTemplate {blog} />
	</Section>
</div>
