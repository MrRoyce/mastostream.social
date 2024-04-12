export const shortenLongWords = (str: string, maxLength: number) => {
  return str.replace(/\b\w+\b/g, function (word) {
    return word.length > maxLength ? word.slice(0, maxLength) + '...' : word;
  });
}