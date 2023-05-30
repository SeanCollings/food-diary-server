import { getAllDatesForType } from '@/utils/modules/trends-utils';

describe('trend-utils', () => {
  describe('getAllDatesForType', () => {
    it('should get all dates for week', () => {
      const result = getAllDatesForType('week');
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-04-24",
          "2023-04-25",
          "2023-04-26",
          "2023-04-27",
          "2023-04-28",
        ]
      `);
    });

    it('should get all dates for month', () => {
      const result = getAllDatesForType('month');
      expect(result).toMatchInlineSnapshot(`
        [
          "2023-04-01",
          "2023-04-02",
          "2023-04-03",
          "2023-04-04",
          "2023-04-05",
          "2023-04-06",
          "2023-04-07",
          "2023-04-08",
          "2023-04-09",
          "2023-04-10",
          "2023-04-11",
          "2023-04-12",
          "2023-04-13",
          "2023-04-14",
          "2023-04-15",
          "2023-04-16",
          "2023-04-17",
          "2023-04-18",
          "2023-04-19",
          "2023-04-20",
          "2023-04-21",
          "2023-04-22",
          "2023-04-23",
          "2023-04-24",
          "2023-04-25",
          "2023-04-26",
          "2023-04-27",
          "2023-04-28",
          "2023-04-29",
          "2023-04-30",
        ]
      `);
    });
  });
});
