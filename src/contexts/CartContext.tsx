
import React, { createContext, useState, useContext } from 'react';
import { CartItem, MenuItem, Customer } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  customer: Customer;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer) => void;
  subtotal: number;
  tax: number;
  total: number;
  generateWhatsAppLink: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '' });
  const { toast } = useToast();

  const taxRate = 0.08; // 8% tax

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const addToCart = (item: MenuItem) => {
    setItems(prevItems => {
      const exists = prevItems.find(i => i.id === item.id);
      
      if (exists) {
        return prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        toast({
          title: "Added to bill",
          description: `${item.name} added to your bill`,
        });
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const generateWhatsAppLink = () => {
    if (!customer.phone || items.length === 0) {
      toast({
        title: "Cannot generate bill",
        description: "Please enter customer phone number and add items to the bill",
        variant: "destructive",
      });
      return "";
    }

    let formattedPhone = customer.phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    const billItems = items.map(item => 
      `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const billMessage = `
*Coffee Shop Bill for ${customer.name}*
---------------------------
${billItems}
---------------------------
Subtotal: $${subtotal.toFixed(2)}
Tax (8%): $${tax.toFixed(2)}
*Total: $${total.toFixed(2)}*

Thank you for visiting our coffee shop!
    `.trim();

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(billMessage)}`;
  };

  return (
    <CartContext.Provider value={{
      items,
      customer,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setCustomer,
      subtotal,
      tax,
      total,
      generateWhatsAppLink,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
