
import React from 'react';
import { CartProvider } from '../contexts/CartContext';
import MenuList from '../components/MenuList';
import Cart from '../components/Cart';
import { menuItems } from '../data/menu';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Coffee Shop Billing System</h1>
            <p className="text-gray-500">Select items to add to the bill</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
              <MenuList items={menuItems} />
            </div>
            
            <div>
              <Cart />
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </CartProvider>
  );
};

export default Index;
