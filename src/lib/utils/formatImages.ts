
export const formatImages = (images: array) => {
  const response = {
    images: [],
    videos: []
  }
  images.map((image: { url: string }) => {
    if (image.type === 'video' || image.type === 'gifv') {
      response.videos.push({
        alt: 'Not sure video',
        description: image.description,
        previewUrl: image.previewUrl,
        language: image.language,
        src: image.url
      })
    } else {
      response.images.push({
        alt: 'Not sure other',
        src: image.url
      })
    }
  })

  return response
}