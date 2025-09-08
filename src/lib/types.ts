import { z } from 'zod';

export const ShoppingItemSchema = z.object({
  id: z.string().describe('Unique identifier for the shopping item.'),
  name: z.string().describe('The name of the shopping item.'),
  amount: z.string().nullable().describe('The amount of the item (e.g., "1kg", "2 units").'),
  purchased: z.boolean().describe('Whether the item has been purchased.'),
});
export type ShoppingItem = z.infer<typeof ShoppingItemSchema>;


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
