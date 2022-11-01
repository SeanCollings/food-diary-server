import { TMealCard } from '@lib/interfaces/meals';
import { setDateMidnightISOString, setDaysFromDate } from '@utils/date-utils';

const TEMP_DATA_DAY_1: TMealCard = {
  breakfast: {
    contents: [
      {
        id: '11',
        emoji: { name: 'Bowl with Spoon', nativeSkin: '🥣' },
        serving: '½',
        measurement: 'cup',
        food: 'Simple Truth muesli',
        description: 'With chocolate and mini marshmellows',
      },
      {
        id: '12',
        emoji: { name: 'Glass of Milk', nativeSkin: '🥛' },
        serving: '1',
        measurement: 'serving',
        food: 'milk for cereal',
      },
      {
        id: '13',
        emoji: { name: 'Hot Beverage', nativeSkin: '☕️' },
        serving: '1',
        measurement: 'serving',
        food: 'milk with espresso coffee',
      },
      {
        id: '14',
        emoji: { name: 'Carrot', nativeSkin: '🥕' },
        serving: '1',
        food: 'carrot',
      },
    ],
  },
  lunch: {
    contents: [
      {
        id: '21',
        emoji: { name: 'Bowl with Spoon', nativeSkin: '🥣' },
        serving: '½',
        measurement: 'cup',
        food: 'Simple Truth muesli',
        description: 'With chocolate and mini marshmellows',
      },
      {
        id: '22',
        emoji: { name: 'Glass of Milk', nativeSkin: '🥛' },
        serving: '1',
        measurement: 'serving',
        food: 'milk for cereal',
      },
      {
        id: '23',
        emoji: { name: 'Green Salad', nativeSkin: '🥗' },
        serving: '0.5',
        measurement: 'plate',
        food: 'Asian styled salad',
        description:
          'Stir fry veg, chicken strips, rice, Asian sesame stir-fry sauce',
      },
    ],
  },
  snack_2: {
    contents: [
      {
        id: '31',
        emoji: { name: 'Banana', nativeSkin: '🍌' },
        serving: '1',
        food: 'banana',
      },
    ],
  },
  dinner: {
    contents: [
      {
        id: '41',
        serving: '1',
        measurement: 'serving',
        food: 'milk with espresso coffee',
      },
      {
        id: '42',
        emoji: { name: 'Banana', nativeSkin: '🍌' },
        serving: '1',
        food: 'banana',
      },
      {
        id: '43',
        emoji: { name: 'Carrot', nativeSkin: '🥕' },
        serving: '1',
        food: 'carrot',
      },
      {
        id: '44',
        emoji: { name: 'Carrot', nativeSkin: '🥓' },
        serving: '3',
        food: 'streaky bacon',
      },
      {
        id: '45',
        emoji: { name: 'Sushi', nativeSkin: '🍣' },
        serving: '1',
        food: 'sushi platter',
      },
      {
        id: '46',
        emoji: { name: 'Soft Ice Cream', nativeSkin: '🍦' },
        food: 'ice cream - dessert',
      },
      {
        id: '47',
        emoji: { name: 'Wine Glass', nativeSkin: '🍷' },
        serving: '3',
        food: 'glasses wine',
      },
      {
        id: '48',
        emoji: { name: 'Grapes', nativeSkin: '🍇' },
        serving: '14',
        food: 'grapes',
      },
      {
        id: '49',
        emoji: { name: 'Avocado', nativeSkin: '🥑' },
        serving: '1',
        food: 'avocado',
      },
    ],
  },
};
const TEMP_DATA_DAY_2: TMealCard = {
  breakfast: {
    contents: [],
  },
  snack_1: {
    contents: [],
  },
  lunch: {
    contents: [
      {
        id: '11',
        emoji: { name: 'Poultry Leg', nativeSkin: '🍗' },
        serving: '4',
        measurement: '',
        food: 'Chicken',
        description: 'with blue cheese sauce',
      },
    ],
  },
  snack_2: {
    contents: [
      {
        id: '21',
        emoji: { name: 'Chocolate Bar', nativeSkin: '🍫' },
        serving: '1',
        food: 'protein bar',
        description: 'USN',
      },
      {
        id: '22',
        emoji: { name: 'Strawberry', nativeSkin: '🍓' },
        serving: '1',
        food: 'protein shake',
        description: 'USN',
      },
      {
        id: '23',
        emoji: { name: 'Peanuts', nativeSkin: '🥜' },
        serving: '2',
        measurement: 'tablespoons',
        food: 'peanut butter',
      },
    ],
  },
  dinner: {
    contents: [
      {
        id: '31',
        emoji: { name: 'Pizza', nativeSkin: '🍕' },
        serving: '1',
        measurement: '',
        food: 'pizza',
        description: 'stuffed crust',
      },
    ],
  },
};

export const diaryMealsMockData: { [date: string]: TMealCard } = {
  '2021-12-30T22:00:00.000Z': {
    breakfast: {
      contents: [
        {
          id: '11',
          food: 'DECEMBER CAKE',
          emoji: { nativeSkin: '🍰', name: 'Cake' },
        },
      ],
    },
  },
  '2021-12-31T22:00:00.000Z': {
    breakfast: {
      contents: [
        {
          id: '11',
          food: 'JANUARY 1 CAKE',
          emoji: { nativeSkin: '🍰', name: 'Cake' },
        },
      ],
    },
  },
  '2022-08-30T22:00:00.000Z': {
    breakfast: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
  },
  '2022-08-19T22:00:00.000Z': TEMP_DATA_DAY_1,
  '2022-08-18T22:00:00.000Z': TEMP_DATA_DAY_2,
  '2022-08-17T22:00:00.000Z': {
    breakfast: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
  },
  '2022-09-29T22:00:00.000Z': TEMP_DATA_DAY_2,
  '2022-09-30T22:00:00.000Z': {
    lunch: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
    snack_2: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
  },
  '2022-10-01T22:00:00.000Z': {
    breakfast: {
      contents: [
        {
          id: '11',
          food: 'mince-pie',
          emoji: { nativeSkin: '🍫', name: 'Cake' },
        },
      ],
    },
    lunch: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
    snack_2: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
  },
  '2022-10-02T22:00:00.000Z': {
    lunch: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
    snack_2: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
  },
  '2022-10-03T22:00:00.000Z': {
    lunch: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
  },
  '2022-10-04T22:00:00.000Z': {
    breakfast: {
      contents: [
        { id: '11', food: 'cake', emoji: { nativeSkin: '🍰', name: 'Cake' } },
      ],
    },
  },
  '2022-10-14T22:00:00.000Z': {
    breakfast: {
      contents: [
        {
          id: '11',
          food: 'mince-pie',
          emoji: { nativeSkin: '🍫', name: 'Cake' },
        },
      ],
    },
  },
  '2022-10-15T22:00:00.000Z': {
    snack_1: {
      contents: [
        {
          id: '11',
          food: 'mince-pie',
          emoji: { nativeSkin: '🍰', name: 'Cake' },
        },
      ],
    },
  },
  '2022-10-16T22:00:00.000Z': {
    lunch: {
      contents: [
        {
          id: '11',
          food: 'mince-pie',
          emoji: { nativeSkin: '🍫', name: 'Cake' },
        },
      ],
    },
  },
  '2022-10-17T22:00:00.000Z': {
    snack_2: {
      contents: [
        {
          id: '11',
          food: 'Fruit salad',
          emoji: { nativeSkin: '🍰', name: 'Cake' },
        },
      ],
    },
  },
  '2022-10-18T22:00:00.000Z': {
    dinner: {
      contents: [
        {
          id: '11',
          food: 'mince-pie',
          emoji: { nativeSkin: '🍫', name: 'Cake' },
        },
      ],
    },
  },
  [setDateMidnightISOString(setDaysFromDate(-1))]: {
    dinner: {
      contents: [
        {
          id: '11',
          serving: '1',
          measurement: 'plate',
          food: 'mince and noodles',
          description: 'with cheese',
          emoji: { nativeSkin: '🍫', name: 'Cake' },
        },
      ],
    },
  },
  [setDateMidnightISOString(setDaysFromDate(0))]: {
    breakfast: {
      contents: [
        {
          id: '10',
          food: 'Breakfast mince-pies',
          measurement: '44',
          emoji: { nativeSkin: '🍫', name: 'Cake' },
        },
      ],
    },
    lunch: {
      contents: [
        {
          id: '11',
          food: 'Today I have mince-pie',
          measurement: '1',
          serving: 'plate',
          description: 'Lunch',
          emoji: { nativeSkin: '🍫', name: 'Cake' },
        },
      ],
    },
  },
};
