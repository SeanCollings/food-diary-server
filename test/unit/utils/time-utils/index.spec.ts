import { convertTimeStringToMinutes, getSplitTime } from '@/utils/time-utils';

describe('time-utils', () => {
  describe('getSplitTime', () => {
    it('should convert time format from HH:MM to [HH,MM]', () => {
      const result = getSplitTime('12:15');
      expect(result).toMatchInlineSnapshot(`
        [
          "12",
          "15",
        ]
      `);
    });

    it('should handle input without : symbol', () => {
      const result = getSplitTime('12');
      expect(result).toMatchInlineSnapshot(`
        [
          "12",
          "00",
        ]
      `);
    });

    it('should handle empty hour value', () => {
      const result = getSplitTime(':15');
      expect(result).toMatchInlineSnapshot(`
        [
          "00",
          "15",
        ]
      `);
    });
  });

  describe('convertTimeStringToMinutes', () => {
    it('should convert format HH:MM to minutes', () => {
      const result = convertTimeStringToMinutes('02:15');
      expect(result).toMatchInlineSnapshot(`135`);
    });

    it('should handle null input', () => {
      const result = convertTimeStringToMinutes(null);
      expect(result).toBeNull();
    });

    it('should handle bad hour input', () => {
      const result = convertTimeStringToMinutes('bad:15');
      expect(result).toBeNull();
    });

    it('should handle bad minute input', () => {
      const result = convertTimeStringToMinutes('02:bad');
      expect(result).toBeNull();
    });
  });
});
