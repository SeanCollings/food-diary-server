export enum EMealType {
  BREAKFAST = 'breakfast',
  SNACK_1 = 'snack_1',
  LUNCH = 'lunch',
  SNACK_2 = 'snack_2',
  DINNER = 'dinner',
}
export type TMealType = `${EMealType}`;

export type TSelectedEmoji = {
  name: string;
  nativeSkin: string;
} | null;

export interface IMealContent {
  id: string;
  emoji?: TSelectedEmoji;
  serving?: string;
  measurement?: string;
  food: string;
  description?: string;
}

export interface IMealTypeContent {
  contents: IMealContent[];
}

export type TMealCard = {
  [key in TMealType]?: IMealTypeContent;
};
