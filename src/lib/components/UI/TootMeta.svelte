<script lang="ts">
	export let counts;
	const { totalPictures, totalVideos, totalAudio } = counts
		? counts
		: { totalPictures: 0, totalVideos: 0, totalAudio: 0 };
</script>

<div class="grid grid-cols-3 pb-4">
	<div class="grid col-span-1 grid-rows-1 grid-flow-col gap-4">
		<div>
			<span class="sr-only">Count of pictures</span>
			<i class="fa-regular fa-image" style="color: #31c48d;" />
			<span class="pl-1">{totalPictures} </span>
		</div>
		<div>
			<span class="sr-only">Count of Videos</span>
			<i class="fa-solid fa-play" style="color: #31c28d;" />
			<span class="pl-1">{totalVideos}</span>
		</div>
		<div>
			<span class="sr-only">Count of Audio</span>
			<i class="fa-solid fa-microphone" style="color: #31c48d;" />
			<span class="pl-1">{totalAudio}</span>
		</div>
	</div>
</div>
