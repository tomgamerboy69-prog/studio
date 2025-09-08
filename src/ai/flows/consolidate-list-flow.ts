
'use server';
/**
 * @fileOverview Consolidates a shopping list using AI.
 *
 * - consolidateList - A function that consolidates a shopping list.
 * - ConsolidateListInput - The input type for the consolidateList function.
 * - ConsolidateListOutput - The return type for the consolidateList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ShoppingItemSchema } from '@/lib/types';

const ConsolidateListInputSchema = z.object({
  items: z.array(ShoppingItemSchema).describe('The list of shopping items to consolidate.'),
});
export type ConsolidateListInput = z.infer<typeof ConsolidateListInputSchema>;

const ConsolidateListOutputSchema = z.object({
    items: z.array(ShoppingItemSchema).describe('The consolidated list of shopping items.'),
});
export type ConsolidateListOutput = z.infer<typeof ConsolidateListOutputSchema>;

export async function consolidateList(
  input: ConsolidateListInput
): Promise<ConsolidateListOutput> {
  return consolidateListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'consolidateListPrompt',
  input: {
    schema: ConsolidateListInputSchema,
  },
  output: {
    schema: ConsolidateListOutputSchema,
  },
  prompt: `You are an intelligent shopping list assistant. Your task is to consolidate a list of grocery items.
Combine items that refer to the same grocery but might have different names (e.g., 'Eggs' and 'Large Eggs').
When combining items, sum their amounts. You must handle different units and formats (e.g., '1 dozen' + '6' = '18 units', '1 kg' + '500g' = '1.5 kg').
If an item has no amount, treat it as '1 unit' when combining with an item that has an amount. If multiple items have no amount, the combined item should also have no amount.
Normalize the item names to a standard, generic name (e.g., 'Large Free-Range Eggs' becomes 'Eggs').
The final output should be a single, rationalized amount string (e.g., '1.5 kg' instead of '1 kg + 500g').
Return only the consolidated list of items.

Here is the list to consolidate:
{{#each items}}
- {{name}}{{#if amount}} ({{amount}}){{/if}}
{{/each}}`,
});


const consolidateListFlow = ai.defineFlow(
  {
    name: 'consolidateListFlow',
    inputSchema: ConsolidateListInputSchema,
    outputSchema: ConsolidateListOutputSchema,
  },
  async (input) => {
    // Filter out purchased items before sending to the AI
    const unpurchasedItems = input.items.filter(item => !item.purchased);
    
    if (unpurchasedItems.length < 2) {
      return { items: input.items };
    }

    const {output} = await prompt({ items: unpurchasedItems });
    
    if (!output?.items) {
      return { items: input.items };
    }

    const purchasedItems = input.items.filter(item => item.purchased);
    
    const consolidatedItems = output.items.map(item => ({
        ...item,
        id: `${Date.now()}-${Math.random()}`, // Generate a new ID
        purchased: false,
    }));

    return { items: [...consolidatedItems, ...purchasedItems] };
  }
);
