import { extractEmails } from './extractEmails';

describe('extractEmails', () => {
  it('should extract emails from a string with multiple emails', () => {
    const text =
      'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com';
    const expectedEmails = ['studentagnes@gmail.com', 'studentmiche@gmail.com'];
    const result = extractEmails(text);
    expect(result).toEqual(expectedEmails);
  });

  it('should extract a single email from a string', () => {
    const text = 'Contact us at @support@example.com for more info.';
    const expectedEmails = ['support@example.com'];
    const result = extractEmails(text);
    expect(result).toEqual(expectedEmails);
  });

  it('should return an empty array if no emails are present', () => {
    const text = 'Hello students!';
    const expectedEmails = [];
    const result = extractEmails(text);
    expect(result).toEqual(expectedEmails);
  });

  it('should handle an empty string', () => {
    const text = '';
    const expectedEmails = [];
    const result = extractEmails(text);
    expect(result).toEqual(expectedEmails);
  });

  it('should not include invalid email patterns', () => {
    const text = 'Invalid emails: @invalid-email @another-invalid-email';
    const expectedEmails = [];
    const result = extractEmails(text);
    expect(result).toEqual(expectedEmails);
  });
});
