
import React from 'react';
import { Button } from '@/components/ui/button';
import { MenuItem as MenuItemType } from '../types';
import { useCart } from '../contexts/CartContext';
import { Plus, Check } from 'lucide-react';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem = ({ item }: MenuItemProps) => {
  const { addToCart, items } = useCart();
  
  // Check if this item is in the cart
  const isInCart = items.some(cartItem => cartItem.id === item.id);

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg shadow-sm transition-colors ${
      isInCart ? 'bg-primary/10 border-primary/30' : 'bg-card'
    }`}>
      <div>
        <h3 className="font-medium text-foreground">{item.name}</h3>
        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
      </div>
      <Button
        size="sm"
        variant={isInCart ? "secondary" : "outline"}
        className="flex items-center gap-1"
        onClick={() => addToCart(item)}
      >
        {isInCart ? (
          <>
            <Check className="h-4 w-4" />
            Added
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add
          </>
        )}
      </Button>
    </div>
  );
};

export default MenuItem;
