
'use client';

import type { ShoppingList } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { List, Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface ListManagerProps {
  lists: ShoppingList[];
  activeListId: string | null;
  onSelectList: (id: string) => void;
  onAddList: (name: string) => void;
  onDeleteList: (id:string) => void;
}

export function ListManager({
  lists,
  activeListId,
  onSelectList,
  onAddList,
  onDeleteList,
}: ListManagerProps) {
  const [newListName, setNewListName] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddList = () => {
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-semibold font-headline">My Lists</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {lists.map((list) => (
            <SidebarMenuItem key={list.id} className="group/menu-item">
              <SidebarMenuButton
                onClick={() => onSelectList(list.id)}
                isActive={list.id === activeListId}
                className="justify-between"
              >
                <div className="flex items-center gap-2">
                   <List className="w-4 h-4" />
                   <span>{list.name}</span>
                </div>
              </SidebarMenuButton>
               <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/menu-item:opacity-100" onClick={(e) => {e.stopPropagation(); onDeleteList(list.id)}}>
                    <Trash2 className="w-4 h-4 text-destructive" />
               </Button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New List
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new shopping list</DialogTitle>
              <DialogDescription>
                What's this shopping list for? e.g., "Weekly Groceries", "Birthday Party".
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddList}>Create List</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
