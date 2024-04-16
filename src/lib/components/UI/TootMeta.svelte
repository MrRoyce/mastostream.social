<script lang="ts">
	export let counts;
	export let karmaCounts;

	const { totalPictures, totalVideos, totalAudio } = counts
		? counts
		: { totalPictures: 0, totalVideos: 0, totalAudio: 0 };

	const { upCount, downCount, commentsCount } = karmaCounts
		? karmaCounts
		: { upCount: 0, downCount: 0, commentsCount: 0 };
</script>

<div class="grid grid-cols-2 pb-4">
	<!-- mediaAttachmentCounts -->
	<div class="grid col-span-1 grid-rows-1 grid-flow-col">
		<div>
			<span class="sr-only">Count of pictures</span>
			<i class="fa-regular fa-image" style="color: #31c48d;" />
			{#if totalPictures}
				<span class="pl-1">{totalPictures} </span>
			{/if}
		</div>
		<div>
			<span class="sr-only">Count of Videos</span>
			<i class="fa-solid fa-play" style="color: #31c48d;" />
			{#if totalVideos}
				<span class="pl-1">{totalVideos}</span>
			{/if}
		</div>
		<div>
			<span class="sr-only">Count of Audio</span>
			<i class="fa-solid fa-microphone" style="color: #31c48d;" />
			{#if totalAudio}
				<span class="pl-1">{totalAudio}</span>
			{/if}
		</div>
	</div>

	<!-- Karma counts -->
	<div class="grid col-span-1 grid-rows-1 grid-flow-col">
		<div>
			<span class="sr-only">Count of up votes</span>
			<i class="fa-solid fa-thumbs-up" style="color: #31c48d;"></i>
			{#if upCount}
				<span class="pl-1">{upCount} </span>
			{/if}
		</div>
		<div>
			<span class="sr-only">Count of down votes</span>
			<i class="fa-solid fa-thumbs-down" style="color: #ea0000;" />
			{#if downCount}
				<span class="pl-1">{downCount}</span>
			{/if}
		</div>
		<div>
			<span class="sr-only">Count of Comments</span>
			<i class="fa-solid fa-comment" style="color: #31c48d;" />
			{#if commentsCount}
				<span class="pl-1">{commentsCount}</span>
			{/if}
		</div>
	</div>
</div>
