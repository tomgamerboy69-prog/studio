
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, ChefHat, Plus } from 'lucide-react';
import { suggestRecipes } from '@/ai/flows/suggest-recipes';
import { useToast } from '@/hooks/use-toast';
import type { ShoppingList, Recipe, Ingredient } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface RecipeHelperProps {
  list: ShoppingList;
  allPurchasedItems: string[];
  onAddIngredients: (ingredients: Ingredient[]) => void;
}

export function RecipeHelper({ list, allPurchasedItems, onAddIngredients }: RecipeHelperProps) {
  const [loadingMealType, setLoadingMealType] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { toast } = useToast();

  const handleGetRecipes = async (mealType: string) => {
    setLoadingMealType(mealType);
    setRecipes([]);
    try {
      const result = await suggestRecipes({
        pastPurchases: allPurchasedItems,
        currentList: list.items.map((item) => item.name),
        mealType,
      });
      setRecipes(result.recipes);
    } catch (error) {
      console.error('Failed to get recipes:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch recipe suggestions. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoadingMealType(null);
    }
  };

  const handleAddAll = (recipe: Recipe) => {
    const itemsToAdd = recipe.ingredients.filter(
      (ingredient) => !list.items.some((item) => item.name.toLowerCase() === ingredient.name.toLowerCase())
    );
    if(itemsToAdd.length > 0) {
        onAddIngredients(itemsToAdd);
    }
    toast({
      title: 'Ingredients Added',
      description: `Added ${itemsToAdd.length} ingredients from ${recipe.name} to your list.`,
    });
  };

  return (
    <Card className="bg-secondary/50 border-secondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <ChefHat className="w-5 h-5 text-secondary-foreground" />
          Recipe Helper
        </CardTitle>
        <CardDescription>
          Get recipe ideas and add ingredients to your list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleGetRecipes('Breakfast')} disabled={!!loadingMealType}>
                {loadingMealType === 'Breakfast' ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ) : ( <ChefHat className="mr-2 h-4 w-4" /> )}
                Breakfast
            </Button>
            <Button onClick={() => handleGetRecipes('Lunch')} disabled={!!loadingMealType}>
                {loadingMealType === 'Lunch' ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ) : ( <ChefHat className="mr-2 h-4 w-4" /> )}
                Lunch
            </Button>
            <Button onClick={() => handleGetRecipes('Dinner')} disabled={!!loadingMealType}>
                {loadingMealType === 'Dinner' ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ) : ( <ChefHat className="mr-2 h-4 w-4" /> )}
                Dinner
            </Button>
        </div>

        {recipes.length > 0 && (
          <div className="mt-4 space-y-2 animate-in fade-in">
            <h4 className="font-semibold">Here are some ideas:</h4>
            <Accordion type="single" collapsible className="w-full">
              {recipes.map((recipe, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{recipe.name}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{recipe.description}</p>
                        <div className="flex flex-wrap gap-1">
                            {recipe.ingredients.map((ing, i) => (
                                <Badge key={i} variant="outline">{ing.name} ({ing.amount})</Badge>
                            ))}
                        </div>
                        <Button size="sm" onClick={() => handleAddAll(recipe)}>
                            <Plus className="mr-2 h-4 w-4"/>
                            Add all ingredients to list
                        </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
