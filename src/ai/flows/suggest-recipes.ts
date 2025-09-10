
'use server';
/**
 * @fileOverview Suggests recipes based on various criteria.
 *
 * - suggestRecipes - A function that suggests recipes.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { RecipeSchema } from '@/lib/types';

const SuggestRecipesInputSchema = z.object({
  currentList: z.array(z.string()).optional().describe('The current shopping list.'),
  pastPurchases: z.array(z.string()).optional().describe('A list of past purchases.'),
  mealType: z.string().optional().describe('The type of meal (e.g., "dinner", "quick lunch").'),
  servings: z.number().optional().describe('The number of servings the user wants to cook.'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z.array(RecipeSchema).describe('A list of suggested recipes.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(
  input: SuggestRecipesInput
): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {
    schema: SuggestRecipesInputSchema,
  },
  output: {
    schema: SuggestRecipesOutputSchema,
  },
  prompt: `You are a helpful culinary assistant. Your task is to suggest a few random, popular recipes.
Suggest 2-3 recipes.

Please consider the following user preferences:
{{#if mealType}}
- The user is looking for {{mealType}} ideas.
{{/if}}
{{#if servings}}
- The user wants to cook for {{servings}} people. Adjust the ingredient amounts accordingly.
{{/if}}

Based on this, suggest a few recipes. For each recipe, provide a name, a short description, the number of servings it makes, a list of ingredients with their required amounts (e.g., "500g", "1 cup", "2 units"), and a list of preparation steps.
The recipes should be varied and appealing.`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
