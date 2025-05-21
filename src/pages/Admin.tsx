
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuManagement from '@/components/admin/MenuManagement';
import OrderAnalysis from '@/components/admin/OrderAnalysis';
import UserManagement from '@/components/admin/UserManagement';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 relative">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">Dine Ease Bill - Admin</h1>
          <NavigationMenu className="my-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Billing
                  </Button>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="orders">Order Analysis</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="mt-6">
            <MenuManagement />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <OrderAnalysis />
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
