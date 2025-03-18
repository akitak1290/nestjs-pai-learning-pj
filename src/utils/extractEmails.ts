export const extractEmails = (text: string): string[] => {
  const emailRegex = /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,6}/g;
  const emails = text.match(emailRegex);
  return emails || [];
};
