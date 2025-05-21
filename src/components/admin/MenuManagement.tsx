import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuItem, Category } from '@/types';
import { menuItems as initialMenuItems } from '@/data/menu';
import { Edit, Trash, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem>({
    id: '',
    name: '',
    price: 0,
    category: 'coffee',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setCurrentItem({
      ...currentItem,
      category: value,
    });
  };

  const handleAddItem = () => {
    const newItem: MenuItem = {
      ...currentItem,
      id: Date.now().toString(),
    };
    
    setMenuItems([...menuItems, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Menu Item Added",
      description: `${newItem.name} has been added to the menu.`,
    });
  };

  const handleEditItem = () => {
    const updatedItems = menuItems.map(item => 
      item.id === currentItem.id ? currentItem : item
    );
    
    setMenuItems(updatedItems);
    setIsEditDialogOpen(false);
    resetForm();
    toast({
      title: "Menu Item Updated",
      description: `${currentItem.name} has been updated.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = menuItems.find(item => item.id === id);
    const updatedItems = menuItems.filter(item => item.id !== id);
    
    setMenuItems(updatedItems);
    toast({
      title: "Menu Item Deleted",
      description: `${itemToDelete?.name} has been removed from the menu.`,
    });
  };

  const resetForm = () => {
    setCurrentItem({
      id: '',
      name: '',
      price: 0,
      category: 'coffee',
    });
  };

  const startEditItem = (item: MenuItem) => {
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };

  const categories: Category[] = ['coffee', 'tea', 'pastry', 'sandwich', 'other'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Menu Management</span>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Menu Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your coffee shop menu.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentItem.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={currentItem.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={currentItem.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    value={currentItem.description || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Manage your menu items, categories, and prices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</TableCell>
                <TableCell>₹{item.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => startEditItem(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentItem.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={currentItem.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={currentItem.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={currentItem.description || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditItem}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MenuManagement;
