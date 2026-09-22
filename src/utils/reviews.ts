export const reviewTextToPlainText = (text: string) =>
  text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();