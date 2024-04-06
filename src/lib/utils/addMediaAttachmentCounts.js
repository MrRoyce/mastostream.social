

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

			const myToot = toot
			const mediaAttachementCounts = {
				totalAttachments: 0,
				totalVideos: 0,
				totalAudio: 0,
				totalPictures: 0
			};

			myToot.mediaAttachementCounts = mediaAttachementCounts;

			if (
				myToot.mediaAttachments &&
				Array.isArray(myToot.mediaAttachments) &&
				myToot.mediaAttachments.length > 0
			) {
				const { totalAttachments, totalAudio, totalPictures, totalVideos } = getAttachmentCounts(
					myToot.mediaAttachments
				);

				myToot.mediaAttachementCounts.totalAttachments = totalAttachments;
				myToot.mediaAttachementCounts.totalVideos = totalVideos;
				myToot.mediaAttachementCounts.totalAudio = totalAudio;
				myToot.mediaAttachementCounts.totalPictures = totalPictures;
			}

			return myToot;
		});
	} catch (error) {
		console.warn('Error getting mediaattchment counts', error);
	}

	return response;
};
