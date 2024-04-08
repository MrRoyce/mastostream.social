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
	<div class="grid col-span-1 grid-rows-1 grid-flow-col gap-4">
		<div>
			<span class="sr-only">Count of pictures</span>
			<i class="fa-regular fa-image" style="color: #31c48d;" />
			<span class="pl-1">{totalPictures} </span>
		</div>
		<div>
			<span class="sr-only">Count of Videos</span>
			<i class="fa-solid fa-play" style="color: #31c48d;" />
			<span class="pl-1">{totalVideos}</span>
		</div>
		<div>
			<span class="sr-only">Count of Audio</span>
			<i class="fa-solid fa-microphone" style="color: #31c48d;" />
			<span class="pl-1">{totalAudio}</span>
		</div>
	</div>

	<!-- Karma counts -->
	<div class="grid col-span-1 grid-rows-1 grid-flow-col gap-4">
		<div>
			<span class="sr-only">Count of up votes</span>
			<i class="fa-solid fa-thumbs-up" style="color: #31c48d;"></i>
			<span class="pl-1">{upCount} </span>
		</div>
		<div>
			<span class="sr-only">Count of down votes</span>
			<i class="fa-solid fa-thumbs-down" style="color: #ea0000;" />
			<span class="pl-1">{downCount}</span>
		</div>
		<div>
			<span class="sr-only">Count of Comments</span>
			<i class="fa-solid fa-comment" style="color: #31c48d;" />

			<span class="pl-1">{commentsCount}</span>
		</div>
	</div>
</div>
