
'use client';
import type { ShoppingItem } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShoppingListItemProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ShoppingListItem({ item, onToggle, onDelete }: ShoppingListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg transition-all duration-300 animate-in fade-in',
        item.purchased ? 'bg-muted/50' : 'hover:bg-muted/50'
      )}
    >
      <Checkbox
        id={`item-${item.id}`}
        checked={item.purchased}
        onCheckedChange={() => onToggle(item.id)}
        aria-label={`Mark ${item.name} as purchased`}
        className="h-5 w-5 rounded-md"
      />
      <label
        htmlFor={`item-${item.id}`}
        className={cn(
          'flex-1 text-base transition-all cursor-pointer',
          item.purchased ? 'line-through text-muted-foreground' : 'text-foreground'
        )}
      >
        {item.name}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full opacity-50 hover:opacity-100"
        onClick={() => onDelete(item.id)}
        aria-label={`Delete ${item.name}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
