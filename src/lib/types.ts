
export interface ShoppingItem {
  id: string;
  name: string;
  purchased: boolean;
}

export interface ShoppingList {
  id:string;
  name: string;
  items: ShoppingItem[];
}
