<script lang="ts">
	import emailjs from '@emailjs/browser';
	import { onMount } from 'svelte';
	import { PUBLIC_EMAILJS_USER_ID } from '$env/static/public';

	onMount(async () => {
		await emailjs.init({
			publicKey: PUBLIC_EMAILJS_USER_ID,
			// Do not allow headless browsers
			blockHeadless: true,
			blockList: {
				// Block the suspended emails
				list: ['foo@emailjs.com', 'bar@emailjs.com'],
				// The variable contains the email address
				watchVariable: 'userEmail'
			},
			limitRate: {
				// Set the limit rate for the application
				id: 'app',
				// Allow 1 request per 10s
				throttle: 10000
			}
		});
	});
</script>

<slot><!-- optional fallback --></slot>
