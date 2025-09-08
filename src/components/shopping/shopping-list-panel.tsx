
'use client';
import type { ShoppingList, Ingredient } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingListItem } from './shopping-list-item';
import { SmartSuggestions } from './smart-suggestions';
import { RecipeHelper } from './recipe-helper';
import { Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ShoppingListPanelProps {
  list: ShoppingList;
  allPurchasedItems: string[];
  onAddItem: (listId: string, itemName: string, itemAmount: string | null) => void;
  onAddItems: (listId: string, items: Ingredient[]) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
  onClearCompleted: (listId: string) => void;
}

export function ShoppingListPanel({
  list,
  allPurchasedItems,
  onAddItem,
  onAddItems,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
}: ShoppingListPanelProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(list.id, newItemName.trim(), newItemAmount.trim() || null);
      setNewItemName('');
      setNewItemAmount('');
    }
  };
  
  const unpurchasedItems = list.items.filter(item => !item.purchased);
  const purchasedItems = list.items.filter(item => item.purchased);

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6">
      <Card className="flex-shrink-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl">{list.name}</CardTitle>
          {purchasedItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => onClearCompleted(list.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Completed
            </Button>
          )}
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
          
          <ScrollArea className="h-[calc(100vh-480px)] pr-4 -mr-4">
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
      
      <div className="grid md:grid-cols-2 gap-6">
        <SmartSuggestions 
          list={list} 
          allPurchasedItems={allPurchasedItems} 
          onAddSuggestion={(itemName) => onAddItem(list.id, itemName, null)}
        />
        <RecipeHelper 
          list={list}
          allPurchasedItems={allPurchasedItems}
          onAddIngredients={(items) => onAddItems(list.id, items)}
        />
      </div>
    </div>
  );
}
