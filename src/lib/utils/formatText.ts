export const formatText = (inputString: any, classToAdd: string) => {
  let modifiedString;
  modifiedString = inputString;

  // Regular expression to match an anchor tag
  const anchorTagRegex = /<a\b[^>]*>(.*?)<\/a>/;

  // Check if the input string contains an anchor tag
  if (modifiedString && anchorTagRegex.test(modifiedString)) {
    // Extract the anchor tag
    const anchorTag = modifiedString.match(anchorTagRegex)[0];

    // Check if the anchor tag already has a class attribute
    if (anchorTag.indexOf('class=') === -1) {
      // If no class attribute exists, add it with the provided class value
      const updatedAnchorTag = anchorTag.replace('<a ', '<a class="' + classToAdd + '" ');
      return modifiedString.replace(anchorTagRegex, updatedAnchorTag);
    } else {
      // If class attribute exists, add the passed-in class value to it
      const updatedAnchorTag = anchorTag.replace(
        /class="([^"]*)"/,
        'class="$1 ' + classToAdd + '"'
      );
      return modifiedString.replace(anchorTagRegex, updatedAnchorTag);
    }
  } else {
    // If no anchor tag is found, return the original string
    return modifiedString;
  }
}