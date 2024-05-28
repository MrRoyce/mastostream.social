<script lang="ts">
	import { Popover, Button, Avatar } from 'flowbite-svelte';

	export let userIndex;
	export let acct;
	export let sendMessage: () => {};
	let placement: string;
</script>

<Button id={`placement-${userIndex}`} on:mouseenter={() => (placement = 'left')}
	><i class="fa-sharp fa-solid fa-ellipsis" style="color: #31c48d;" /></Button
>
<Popover
	triggeredBy="[id^='placement-']"
	{placement}
	class="w-64 text-sm font-light text-gray-500 bg-white dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
>
	<div class="p-3">
		<div class="flex justify-between items-center mb-2">
			<Avatar href="/accounts/{acct}" src="/images/profile-picture-1.webp" alt={`${acct}`} />
			<Button size="xs">Follow</Button>
		</div>

		<ul class="flex text-sm font-light">
			<li class="me-2">
				<a href="/messages/{acct}" class="hover:underline">
					<span>Start chat</span>
				</a>
			</li>
		</ul>
	</div>
</Popover>
