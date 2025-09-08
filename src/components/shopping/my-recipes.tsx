
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookMarked, Trash2 } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { RecipeViewDialog } from './recipe-view-dialog';
import { ScrollArea } from '../ui/scroll-area';

interface MyRecipesProps {
  recipes: Recipe[];
  onDeleteRecipe: (recipeName: string) => void;
}

export function MyRecipes({ recipes, onDeleteRecipe }: MyRecipesProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <>
    <Card className="bg-secondary/50 border-secondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <BookMarked className="w-5 h-5 text-secondary-foreground" />
          My Recipes
        </CardTitle>
        <CardDescription>
          Your saved recipes for quick access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[140px] pr-4 -mr-4">
            {recipes.length > 0 ? (
            <div className="space-y-2">
                {recipes.map((recipe, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-background/50 group">
                        <span className="font-medium">{recipe.name}</span>
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => setSelectedRecipe(recipe)}>Open</Button>
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                onClick={() => onDeleteRecipe(recipe.name)}
                            >
                                <Trash2 className="w-4 h-4 text-destructive"/>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            ) : (
            <div className="text-center text-muted-foreground py-6">
                <p>You have no saved recipes.</p>
                <p>Save recipes from the helper to see them here.</p>
            </div>
            )}
        </ScrollArea>
      </CardContent>
    </Card>
    {selectedRecipe && (
        <RecipeViewDialog 
            recipe={selectedRecipe} 
            onOpenChange={(isOpen) => !isOpen && setSelectedRecipe(null)}
        />
    )}
    </>
  );
}
