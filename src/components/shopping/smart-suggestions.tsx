
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Plus } from 'lucide-react';
import { suggestItemsBasedOnPastPurchases } from '@/ai/flows/suggest-items-based-on-past-purchases';
import { useToast } from '@/hooks/use-toast';
import type { ShoppingItem, ShoppingList } from '@/lib/types';

interface SmartSuggestionsProps {
  list: ShoppingList;
  allPurchasedItems: string[];
  onAddSuggestion: (itemName: string) => void;
}

export function SmartSuggestions({ list, allPurchasedItems, onAddSuggestion }: SmartSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestItemsBasedOnPastPurchases({
        pastPurchases: allPurchasedItems,
        currentList: list.items.map((item) => item.name),
        occasion: list.name,
      });
      const newSuggestions = result.suggestedItems.filter(
        (item) => !list.items.some((li) => li.name.toLowerCase() === item.toLowerCase())
      );
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch smart suggestions. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-accent/20 border-accent/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
          Smart Suggestions
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions based on your shopping habits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGetSuggestions} disabled={isLoading} variant="secondary">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Thinking...' : 'Get Suggestions'}
        </Button>

        {suggestions.length > 0 && (
          <div className="mt-4 space-y-2 animate-in fade-in">
            <h4 className="font-semibold">Recommended for you:</h4>
            <ul className="space-y-2">
              {suggestions.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md bg-background/70">
                  <span>{item}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onAddSuggestion(item);
                        setSuggestions(current => current.filter(s => s !== item));
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
