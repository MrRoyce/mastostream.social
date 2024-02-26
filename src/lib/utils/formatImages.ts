export const formatImages = (images: array) => {
  const response = images.map((image: { url: string }) => {
    return {
      alt: 'Not sure',
      src: image.url
    }
  })

  return response
}