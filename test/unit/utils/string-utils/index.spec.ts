import { createGuid, trim } from '@/utils/string-utils';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock_guid_value'),
}));

describe('string-utils', () => {
  describe('createGuid', () => {
    it('should return guid', () => {
      const result = createGuid();
      expect(result).toMatchInlineSnapshot(`"mock_guid_value"`);
    });
  });

  describe('trim', () => {
    it('should trim string', () => {
      const result = trim('     blank space     ');
      expect(result).toMatchInlineSnapshot(`"blank space"`);
    });

    it('should handle null value', () => {
      const result = trim(null as any);
      expect(result).toMatchInlineSnapshot(`undefined`);
    });
  });
});
