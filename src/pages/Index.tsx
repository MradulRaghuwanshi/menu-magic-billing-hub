
import React from 'react';
import { CartProvider } from '../contexts/CartContext';
import MenuList from '../components/MenuList';
import Cart from '../components/Cart';
import { menuItems } from '../data/menu';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <header className="mb-8 text-center relative">
            <div className="absolute right-0 top-0 flex gap-2">
              <ThemeToggle />
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Coffee Shop Billing System</h1>
            <p className="text-muted-foreground">Select items to add to the bill</p>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Menu Items</h2>
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
