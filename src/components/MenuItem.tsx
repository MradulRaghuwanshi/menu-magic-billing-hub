
import React from 'react';
import { Button } from '@/components/ui/button';
import { MenuItem as MenuItemType } from '../types';
import { useCart } from '../contexts/CartContext';
import { Plus } from 'lucide-react';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem = ({ item }: MenuItemProps) => {
  const { addToCart } = useCart();

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-card">
      <div>
        <h3 className="font-medium text-foreground">{item.name}</h3>
        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
        onClick={() => addToCart(item)}
      >
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </div>
  );
};

export default MenuItem;
