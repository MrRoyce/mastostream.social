import Autolinker from 'autolinker';

const options = {
  newWindow: true,
  truncate: 25,

  replaceFn: (match: any) => {
    return `<a style="color: green; text-decoration: underline;" target="_blank" href="${match.getAnchorHref()}">${match.getAnchorText()}</a>`;
  }
};

const autolinkerInstance = new Autolinker(options);

export const autolinker = (text: string) => {
  return autolinkerInstance.link(text);
};