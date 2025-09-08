
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
import type { Recipe, Ingredient } from '@/lib/types';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Plus, Users } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState, useEffect } from 'react';
import { parseAmount, formatAmount } from '@/lib/utils';

interface RecipeViewDialogProps {
  recipe: Recipe;
  onOpenChange: (isOpen: boolean) => void;
  onAddIngredients: (ingredients: Ingredient[]) => void;
}

export function RecipeViewDialog({ recipe, onOpenChange, onAddIngredients }: RecipeViewDialogProps) {
    const [servings, setServings] = useState(recipe.servings > 0 ? recipe.servings : 1);
    const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients);
  
    useEffect(() => {
        if (recipe.servings > 0 && servings > 0) {
            const ratio = servings / recipe.servings;
            const scaledIngredients = recipe.ingredients.map(ing => {
                const { value, unit } = parseAmount(ing.amount);
                if(value > 0) {
                    const scaledValue = Math.round(value * ratio * 100) / 100; // round to 2 decimal places
                    return { ...ing, amount: formatAmount(scaledValue, unit) };
                }
                return ing;
            });
            setIngredients(scaledIngredients);
        } else {
            setIngredients(recipe.ingredients);
        }

    }, [servings, recipe]);

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{recipe.name}</DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
            <p className='flex-1'>{recipe.description}</p>
            {recipe.servings > 0 && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Label htmlFor="servings-dialog" className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>Servings</span>
                    </Label>
                    <Input 
                        id="servings-dialog"
                        type="number" 
                        value={servings}
                        onChange={(e) => setServings(Math.max(1, parseInt(e.target.value, 10)))}
                        min="1"
                        className="h-8 w-16"
                    />
                </div>
            )}
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="font-semibold mb-2 text-lg">Ingredients</h3>
                    <ul className="space-y-1">
                        {ingredients.map((ing, i) => (
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
            <Button onClick={() => onAddIngredients(ingredients)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add ingredients to list
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
