
export const formatImages = (images: array) => {
  const response = {
    audio: [],
    pictures: [],
    videos: []
  }
  images.map((image: { url: string }) => {
    if (image.type === 'video' || image.type === 'gifv') {
      response.videos.push({
        ...image,
        alt: image.description || '',
        src: image.url
      })
    } else if (image.type === 'audio') {
      response.audio.push({
        ...image,
        alt: image.description || '',
        src: image.url
      })
    } else {
      response.pictures.push({
        ...image,
        alt: image.description || '',
        src: image.url
      })
    }
  })

  return response
}