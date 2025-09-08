
import { z } from 'zod';

export interface ShoppingItem {
  id: string;
  name: string;
  purchased: boolean;
}

export interface ShoppingList {
  id:string;
  name: string;
  items: ShoppingItem[];
}

export const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  description: z.string().describe('A brief description of the recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients for the recipe.'),
});
export type Recipe = z.infer<typeof RecipeSchema>;
