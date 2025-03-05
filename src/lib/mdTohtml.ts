import { marked } from 'marked';

export function convertMarkdownArrayToHTML(markdownArray: string[]): string[] {
  if (!Array.isArray(markdownArray)) {
    throw new Error('Input must be an array of strings');
  }
  
  return markdownArray.map((md: string) => {
    const html: string = marked(md, {async : false});
    return `${html}`;
  });
}
