
export const formatCreatedAt = (createdAt: string) => {
  const createdAtArray = createdAt.toLocaleString().split('T')
  const response = `${createdAtArray[0]} ${createdAtArray[1].split('.')[0]}`

  return response
}