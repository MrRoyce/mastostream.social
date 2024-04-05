

function getAttachmentCounts(mediaAttachments) {
	let audio = 0;
	let pictures = 0;
	let videos = 0

	mediaAttachments.map((image) => {
		if (image.type === 'video' || image.type === 'gifv') {
			videos++
		} else if (image.type === 'audio') {
			audio++
		} else {
			pictures++
		}
	})

	return ({
		totalAttachments: mediaAttachments.length,
		totalAudio: audio,
		totalPictures: pictures,
		totalVideos: videos
	});
}

export const addMediaAttachmentCounts = (toots) => {
	let response = toots;

	try {
		response = toots.map((toot) => {

			const mediaAttachementCounts = {
				totalAttachments: 0,
				totalVideos: 0,
				totalAudio: 0,
				totalPictures: 0
			};

			toot.mediaAttachementCounts = mediaAttachementCounts;

			if (
				toot.mediaAttachments &&
				Array.isArray(toot.mediaAttachments) &&
				toot.mediaAttachments.length > 0
			) {
				console.log('length after', toot.mediaAttachments.length);
				const { totalAttachments, totalAudio, totalPictures, totalVideos } = getAttachmentCounts(
					toot.mediaAttachments
				);

				toot.mediaAttachementCounts.totalAttachments = totalAttachments;
				toot.mediaAttachementCounts.totalVideos = totalVideos;
				toot.mediaAttachementCounts.totalAudio = totalAudio;
				toot.mediaAttachementCounts.totalPictures = totalPictures;
			}

			return toot;
		});
	} catch (error) {
		console.warn('Error getting mediaattchment counts', error);
	}

	return response;
};
