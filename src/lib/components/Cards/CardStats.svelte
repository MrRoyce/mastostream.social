<script>
	export let statEntity;
	export let statValue;
	// The value must match one of these strings
	// "up" or "down"
	export let statArrow;
	export let statPercent;
	export let statsCount;
	// can be any of the text color utilities
	// from tailwindcss
	export let statPercentColor;
	export let statDescription;
	export let statIconName;
	// can be any of the background color utilities
	// from tailwindcss
	export let statIconColor;
</script>

<div class="relative flex flex-col min-w-0 break-words mb-6 xl:mb-0 shadow-lg">
	<div class="flex-auto p-4">
		<div class="flex flex-wrap">
			<div class="relative w-full pr-4 max-w-full flex-grow flex-1">
				<h5 class=" uppercase font-bold text-xs dark:text-gray-200">
					{statEntity}
				</h5>
				<span class="font-semibold text-xl dark:text-gray-200">
					{statValue}
				</span>
			</div>
			<div class="relative w-auto pl-4 flex-initial">
				<div
					class=" p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full {statIconColor}"
				>
					<i class={statIconName}></i>
				</div>
			</div>
		</div>
		<p class="text-sm mt-4">
			<span class="mr-2 {statPercentColor}">
				{statsCount}
				{statDescription}
			</span>
		</p>
		<p>
			<span class={statPercent < 0 ? 'text-red-700' : 'text-green-400'}
				><i class={statArrow === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}></i></span
			>
			<span class={statPercent < 0 ? 'text-red-700' : 'text-green-400'}>{statPercent}%</span>

			<span></span>
		</p>
	</div>
</div>
