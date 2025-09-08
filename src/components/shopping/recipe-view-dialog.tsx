
'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Recipe } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface RecipeViewDialogProps {
  recipe: Recipe;
  onOpenChange: (isOpen: boolean) => void;
  onAddIngredients: () => void;
}

export function RecipeViewDialog({ recipe, onOpenChange, onAddIngredients }: RecipeViewDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{recipe.name}</DialogTitle>
          <DialogDescription>{recipe.description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="font-semibold mb-2 text-lg">Ingredients</h3>
                    <ul className="space-y-1">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between">
                                <span>{ing.name}</span>
                                <Badge variant="secondary">{ing.amount}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-2">
                     <h3 className="font-semibold mb-2 text-lg">Instructions</h3>
                     <div className="space-y-4">
                        {recipe.steps.map((step, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                    {i+1}
                                </div>
                                <p className="flex-1 pt-0.5">{step}</p>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </ScrollArea>
        <DialogFooter>
            <Button onClick={onAddIngredients}>
                <Plus className="mr-2 h-4 w-4"/>
                Add ingredients to list
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
