import { z } from 'zod';

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string | null;
  purchased: boolean;
}

export interface ShoppingList {
  id:string;
  name: string;
  items: ShoppingItem[];
}

export const IngredientSchema = z.object({
  name: z.string().describe('The name of the ingredient.'),
  amount: z.string().describe('The amount of the ingredient needed (e.g., "500g", "2 cups").'),
});
export type Ingredient = z.infer<typeof IngredientSchema>;

export const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  description: z.string().describe('A brief description of the recipe.'),
  ingredients: z.array(IngredientSchema).describe('A list of ingredients for the recipe, including amounts.'),
});
export type Recipe = z.infer<typeof RecipeSchema>;
