
'use client';
import type { ShoppingList, Ingredient, ShoppingItem, Recipe } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingListItem } from './shopping-list-item';
import { RecipeHelper } from './recipe-helper';
import { MyRecipes } from './my-recipes';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { consolidateList } from '@/ai/flows/consolidate-list-flow';
import { useToast } from '@/hooks/use-toast';

interface ShoppingListPanelProps {
  list: ShoppingList;
  allPurchasedItems: string[];
  savedRecipes: Recipe[];
  onAddItem: (listId: string, itemName: string, itemAmount: string | null) => void;
  onAddItems: (listId: string, items: Ingredient[]) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
  onClearCompleted: (listId: string) => void;
  onUpdateListItems: (listId: string, items: ShoppingItem[]) => void;
  onAddRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeName: string) => void;
}

export function ShoppingListPanel({
  list,
  allPurchasedItems,
  savedRecipes,
  onAddItem,
  onAddItems,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
  onUpdateListItems,
  onAddRecipe,
  onDeleteRecipe,
}: ShoppingListPanelProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [isConsolidating, setIsConsolidating] = useState(false);
  const { toast } = useToast();

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(list.id, newItemName.trim(), newItemAmount.trim() || null);
      setNewItemName('');
      setNewItemAmount('');
    }
  };

  const handleAddItemsFromRecipe = (items: Ingredient[]) => {
    onAddItems(list.id, items);
    toast({
        title: 'Ingredients Added',
        description: `Added ${items.length} ingredients to your list.`
    });
  }

  const handleConsolidateList = async () => {
    setIsConsolidating(true);
    try {
      const result = await consolidateList({ items: list.items });
      onUpdateListItems(list.id, result.items);
      toast({
        title: 'List Consolidated',
        description: 'Your shopping list has been consolidated.',
      });
    } catch (error) {
      console.error('Failed to consolidate list:', error);
      toast({
        title: 'Error',
        description: 'Could not consolidate the list. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConsolidating(false);
    }
  };
  
  const unpurchasedItems = list.items.filter(item => !item.purchased);
  const purchasedItems = list.items.filter(item => item.purchased);

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6">
      <Card className="flex-shrink-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl">{list.name}</CardTitle>
          <div className="flex items-center gap-2">
            {unpurchasedItems.length > 1 && (
              <Button variant="outline" size="sm" onClick={handleConsolidateList} disabled={isConsolidating}>
                {isConsolidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Consolidate
              </Button>
            )}
            {purchasedItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => onClearCompleted(list.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Completed
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add an item, e.g., 'Apples'"
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              className="text-base flex-grow"
            />
             <Input
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              placeholder="Amount (e.g. 1kg)"
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              className="text-base w-32"
            />
            <Button onClick={handleAddItem} aria-label="Add item">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-550px)] pr-4 -mr-4">
            {list.items.length === 0 ? (
                 <div className="text-center text-muted-foreground py-10">
                    <p>Your list is empty.</p>
                    <p>Add some items to get started!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {unpurchasedItems.map(item => (
                        <ShoppingListItem
                            key={item.id}
                            item={item}
                            onToggle={() => onToggleItem(list.id, item.id)}
                            onDelete={() => onDeleteItem(list.id, item.id)}
                        />
                    ))}
                    {purchasedItems.length > 0 && unpurchasedItems.length > 0 && <Separator className="my-4"/>}
                    {purchasedItems.map(item => (
                        <ShoppingListItem
                            key={item.id}
                            item={item}
                            onToggle={() => onToggleItem(list.id, item.id)}
                            onDelete={() => onDeleteItem(list.id, item.id)}
                        />
                    ))}
                </div>
            )}
           </ScrollArea>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecipeHelper 
          list={list}
          allPurchasedItems={allPurchasedItems}
          onAddIngredients={(items) => onAddItems(list.id, items)}
          onAddRecipe={onAddRecipe}
        />
        <MyRecipes
            recipes={savedRecipes}
            onDeleteRecipe={onDeleteRecipe}
            onAddIngredients={handleAddItemsFromRecipe}
        />
      </div>
    </div>
  );
}
