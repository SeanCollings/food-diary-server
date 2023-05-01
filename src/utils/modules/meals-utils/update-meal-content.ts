import { HasMealColumnKeys, MealColumnKeys } from '@/diary/types';
import { MealContent } from '@/meals/dtos/create-meal-item.dto';

export interface UpdateContentParams {
  content: MealContent;
  currentMealColumnName: MealColumnKeys;
  newMealColumnName: MealColumnKeys;
  currentHasMealContentColumn: HasMealColumnKeys;
  newHasMealContentColumn: HasMealColumnKeys;
  currentMealContents: MealContent[] | null;
  newMealContents: MealContent[] | null;
}

export const updateMealContent = ({
  content,
  currentMealColumnName,
  newMealColumnName,
  currentHasMealContentColumn,
  newHasMealContentColumn,
  currentMealContents,
  newMealContents,
}: UpdateContentParams) => {
  const contentId = content.id;
  const contentIndex = (currentMealContents || []).findIndex(
    (meal) => meal.id === contentId,
  );

  if (
    currentMealContents?.length &&
    newMealColumnName === currentMealColumnName
  ) {
    const updatedMealContents = [...currentMealContents];
    updatedMealContents[contentIndex] = content;

    return { [currentMealColumnName]: updatedMealContents };
  }

  const updatedOldMealContents = (currentMealContents || []).filter(
    (content) => content.id !== contentId,
  );
  const updatedNewMealContents = [...(newMealContents || []), content];

  return {
    [currentMealColumnName]: updatedOldMealContents,
    [currentHasMealContentColumn]: !!updatedOldMealContents.length,
    [newMealColumnName]: updatedNewMealContents,
    [newHasMealContentColumn]: !!updatedNewMealContents.length,
  };
};
