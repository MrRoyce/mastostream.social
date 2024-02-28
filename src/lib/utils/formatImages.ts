
export const formatImages = (images: array) => {
  const response = {
    images: [],
    videos: []
  }
  images.map((image: { url: string }) => {
    if (image.type === 'video') {
      response.videos.push({
        alt: 'Not sure',
        description: image.description,
        previewUrl: image.previewUrl,
        language: image.language,
        src: image.url
      })
    } else {
      response.images.push({
        alt: 'Not sure',
        src: image.url
      })
    }
  })

  return response
}