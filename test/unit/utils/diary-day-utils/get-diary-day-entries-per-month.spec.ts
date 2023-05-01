import { getDiaryDayEntriesPerMonth } from '@/utils/diary-day-utils';
import { DiaryDay } from '@prisma/client';

describe('getDiaryDayEntriesPerMonth', () => {
  const diaryDays: Partial<DiaryDay>[] = [
    { date: '2023-01-23' },
    { date: '2023-01-21' },
    { date: '2023-01-12' },
    { date: '2023-01-01' },
    { date: '2023-02-23' },
    { date: '2023-05-23' },
    { date: '2023-04-23' },
    { date: '2023-02-12' },
    { date: '2023-02-12' },
    { date: '2023-01-30' },
    { date: '2023-02-04' },
    { date: '2022-01-23' },
    { date: '2023-02-16' },
    { date: '2023-05-18' },
    { date: '2023-01-11' },
    { date: '2023-02-19' },
    { date: '2023-02-02' },
    { date: '2023-01-01' },
  ];

  it('should the days per a month for every diary-day entry', () => {
    const result = getDiaryDayEntriesPerMonth(diaryDays as any);
    expect(result).toMatchInlineSnapshot(`
      {
        "0-2022": [
          23,
        ],
        "0-2023": [
          23,
          21,
          12,
          1,
          30,
          11,
          1,
        ],
        "1-2023": [
          23,
          12,
          12,
          4,
          16,
          19,
          2,
        ],
        "3-2023": [
          23,
        ],
        "4-2023": [
          23,
          18,
        ],
      }
    `);
  });
});
