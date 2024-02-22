import { browser } from "$app/environment";

export const truncateHTML = (htmlString: string, maxLength: number) => {
  if (browser) {
    // Create a temporary div element
    const tempDiv = document.createElement('div');

    // Set the HTML content of the div with the input HTML string
    tempDiv.innerHTML = htmlString;

    // Get the text content of the div (strips HTML tags)
    const textContent = tempDiv.textContent || tempDiv.innerText;

    // Truncate the text content to the specified maxLength
    const truncatedText =
      textContent.length > maxLength
        ? textContent.substring(0, maxLength - 3) + '...'
        : textContent;

    return truncatedText;
  } else {
    return htmlString
  }
};