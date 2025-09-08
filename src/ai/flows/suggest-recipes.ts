
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
  prompt: `You are a helpful culinary assistant. Your task is to suggest recipes based on the user's context.
Suggest 2-3 recipes.

Please consider the following information:
{{#if currentList}}
- Items in the current shopping list: {{#each currentList}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
{{#if pastPurchases}}
- User's past purchases: {{#each pastPurchases}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
{{#if mealType}}
- The user is looking for {{mealType}} ideas.
{{/if}}

Based on this, suggest a few recipes. For each recipe, provide a name, a short description, a list of ingredients with their required amounts (e.g., "500g", "1 cup", "2 units"), and a list of preparation steps.
Prioritize recipes that use items from the current list or past purchases.
Do not suggest ingredients that are already in the current shopping list.`,
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
