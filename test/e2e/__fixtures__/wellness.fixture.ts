import { WellnessEntry } from '@/wellness/dtos/wellness-entry.dto';
import { todayDate_fixture } from './today.date.fixture';

export const wellnessSingle_fixture: WellnessEntry[] = [
  {
    date: todayDate_fixture,
    water: { value: 4 },
    tea_coffee: { value: 2 },
    alcohol: { value: 1 },
    excercise: { time: '01:15', details: 'Run and walk' },
  },
];

export const wellnessSingleEmpty_fixture: WellnessEntry[] = [
  {
    date: todayDate_fixture,
  },
];

export const wellnessMultiple_fixture: WellnessEntry[] = [
  wellnessSingle_fixture[0],
  {
    date: todayDate_fixture,
    water: { value: 1 },
    alcohol: { value: 0 },
    excercise: { time: '01:15' },
  },
  {
    date: todayDate_fixture,
    water: { value: 1 },
    tea_coffee: { value: 2 },
    alcohol: { value: 0 },
  },
];
