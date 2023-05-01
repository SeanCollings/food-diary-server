import { transformToEntryDB } from '@/utils/modules/wellness-utils';
import { WellnessEntry } from '@/wellness/dtos/wellness-entry.dto';

describe('wellness-utils', () => {
  describe('transformToEntryDB', () => {
    const wellnessEntry: WellnessEntry = {
      date: '2023-04-27T22:00:00.000Z',
      water: { value: 4 },
      tea_coffee: { value: 2 },
      alcohol: { value: 1 },
      excercise: { time: '01:15', details: 'Run and walk' },
    };

    it('should transform wellness-entry to wellness-db entry', () => {
      const result = transformToEntryDB(wellnessEntry);
      expect(result).toMatchInlineSnapshot(`
        {
          "hasWellnessExcercise": true,
          "wellnessAlcohol": 1,
          "wellnessExcercise": "01:15",
          "wellnessExcerciseDetails": "Run and walk",
          "wellnessTeaCoffee": 2,
          "wellnessWater": 4,
        }
      `);
    });

    it('should transform empty wellness-entry', () => {
      const result = transformToEntryDB({
        date: '2023-04-27T22:00:00.000Z',
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "hasWellnessExcercise": false,
          "wellnessAlcohol": null,
          "wellnessExcercise": "",
          "wellnessExcerciseDetails": "",
          "wellnessTeaCoffee": null,
          "wellnessWater": null,
        }
      `);
    });

    it('should transform excercise without time', () => {
      const result = transformToEntryDB({
        date: '2023-04-27T22:00:00.000Z',
        excercise: { time: '00:00', details: '' },
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "hasWellnessExcercise": false,
          "wellnessAlcohol": null,
          "wellnessExcercise": "00:00",
          "wellnessExcerciseDetails": "",
          "wellnessTeaCoffee": null,
          "wellnessWater": null,
        }
      `);
    });

    it('should transform excercise with only details', () => {
      const result = transformToEntryDB({
        date: '2023-04-27T22:00:00.000Z',
        excercise: { time: undefined, details: 'Run and walk' } as any,
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "hasWellnessExcercise": true,
          "wellnessAlcohol": null,
          "wellnessExcercise": "",
          "wellnessExcerciseDetails": "Run and walk",
          "wellnessTeaCoffee": null,
          "wellnessWater": null,
        }
      `);
    });

    it('should handle empty excercise', () => {
      const result = transformToEntryDB({
        date: '2023-04-27T22:00:00.000Z',
        excercise: {} as any,
      });
      expect(result).toMatchInlineSnapshot(`
        {
          "hasWellnessExcercise": false,
          "wellnessAlcohol": null,
          "wellnessExcercise": "",
          "wellnessExcerciseDetails": "",
          "wellnessTeaCoffee": null,
          "wellnessWater": null,
        }
      `);
    });
  });
});
