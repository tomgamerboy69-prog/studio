
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ShoppingList, ShoppingItem, Ingredient } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { ListManager } from '@/components/layout/list-manager';
import { ShoppingListPanel } from '@/components/shopping/shopping-list-panel';
import { Loader2, PackageOpen } from 'lucide-react';

const initialData: ShoppingList[] = [
  {
    id: '1',
    name: 'Weekly Groceries',
    items: [
      { id: '1-1', name: 'Milk', amount: '1 Gallon', purchased: false },
      { id: '1-2', name: 'Bread', amount: '1 Loaf', purchased: false },
      { id: '1-3', name: 'Eggs', amount: '1 Dozen', purchased: true },
    ],
  },
  {
    id: '2',
    name: 'Weekend BBQ',
    items: [
      { id: '2-1', name: 'Sausages', amount: '1 pack', purchased: false },
      { id: '2-2', name: 'Buns', amount: '8-pack', purchased: false },
    ],
  },
];

export default function Home() {
  const [lists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>('active-list-id', null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const item = window.localStorage.getItem('shopping-lists');
    if (!item || JSON.parse(item).length === 0) {
      setLists(initialData);
      if(!activeListId) {
        setActiveListId(initialData[0]?.id || null);
      }
    }
    setIsInitialLoad(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeList = useMemo(() => {
    return lists.find((list) => list.id === activeListId);
  }, [lists, activeListId]);

  const allPurchasedItems = useMemo(() => {
    return lists.flatMap(list => list.items.filter(item => item.purchased).map(item => item.name));
  }, [lists]);
  
  const handleSelectList = (id: string) => {
    setActiveListId(id);
  };

  const handleAddList = (name: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
    };
    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    setActiveListId(newList.id);
  };
  
  const handleDeleteList = (id: string) => {
    const updatedLists = lists.filter(list => list.id !== id);
    setLists(updatedLists);
    if(activeListId === id) {
        setActiveListId(updatedLists[0]?.id || null);
    }
  }

  const handleAddItem = (listId: string, itemName: string, itemAmount: string | null) => {
    const newItem: ShoppingItem = {
      id: `${listId}-${Date.now()}`,
      name: itemName,
      amount: itemAmount,
      purchased: false,
    };
    const updatedLists = lists.map((list) =>
      list.id === listId ? { ...list, items: [newItem, ...list.items] } : list
    );
    setLists(updatedLists);
  };

  const handleAddItems = useCallback((listId: string, itemsToAdd: Ingredient[]) => {
    const newItems: ShoppingItem[] = itemsToAdd.map(ingredient => ({
      id: `${listId}-${Date.now()}-${Math.random()}`,
      name: ingredient.name,
      amount: ingredient.amount,
      purchased: false,
    }));
    const updatedLists = lists.map((list) =>
      list.id === listId ? { ...list, items: [...newItems, ...list.items] } : list
    );
    setLists(updatedLists);
  }, [lists, setLists]);
  
  const handleToggleItem = (listId: string, itemId: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, purchased: !item.purchased } : item
          ),
        };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const handleDeleteItem = (listId: string, itemId: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter((item) => item.id !== itemId),
        };
      }
      return list;
    });
    setLists(updatedLists);
  };
  
  const handleClearCompleted = (listId: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter((item) => !item.purchased),
        };
      }
      return list;
    });
    setLists(updatedLists);
  };
  
  if (isInitialLoad) {
      return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Header />
        <div className="flex flex-1">
          <ListManager
            lists={lists}
            activeListId={activeListId}
            onSelectList={handleSelectList}
            onAddList={handleAddList}
            onDeleteList={handleDeleteList}
          />
          <SidebarInset>
            {activeList ? (
              <ShoppingListPanel
                list={activeList}
                allPurchasedItems={allPurchasedItems}
                onAddItem={handleAddItem}
                onAddItems={handleAddItems}
                onToggleItem={handleToggleItem}
                onDeleteItem={handleDeleteItem}
                onClearCompleted={handleClearCompleted}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <PackageOpen className="h-16 w-16 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold">No list selected</h2>
                  <p className="text-muted-foreground">
                    Create a new list or select one from the sidebar to get started.
                  </p>
              </div>
            )}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
