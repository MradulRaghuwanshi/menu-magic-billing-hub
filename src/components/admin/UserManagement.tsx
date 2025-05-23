
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { User, UserRole } from '@/types';
import { Edit, Trash, UserPlus, Percent } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock initial users data
const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@coffeeshop.com', role: 'admin', whatsapp: '+919876543210' },
  { id: '2', name: 'Staff Member 1', email: 'staff1@coffeeshop.com', role: 'staff', whatsapp: '+919876543211' },
  { id: '3', name: 'Staff Member 2', email: 'staff2@coffeeshop.com', role: 'staff', whatsapp: '+919876543212' },
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [taxRate, setTaxRate] = useState<number>(8); // Default tax rate (8%)
  const [isTaxDialogOpen, setIsTaxDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    role: 'staff',
    whatsapp: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    setCurrentUser({
      ...currentUser,
      role: value as UserRole,
    });
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTaxRate(value);
    }
  };

  const saveTaxRate = () => {
    // In a real app, save to backend or localStorage
    localStorage.setItem('taxRate', taxRate.toString());
    setIsTaxDialogOpen(false);
    toast({
      title: "Tax Rate Updated",
      description: `Tax rate has been set to ${taxRate}%.`,
    });
  };

  const handleAddUser = () => {
    const newUser: User = {
      ...currentUser,
      id: Date.now().toString(),
    };
    
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "User Added",
      description: `${newUser.name} has been added as ${newUser.role}.`,
    });
  };

  const handleEditUser = () => {
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? currentUser : user
    );
    
    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    resetForm();
    toast({
      title: "User Updated",
      description: `${currentUser.name}'s details have been updated.`,
    });
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(user => user.id === id);
    if (users.filter(user => user.role === 'admin').length <= 1 && userToDelete?.role === 'admin') {
      toast({
        title: "Cannot Delete User",
        description: "You must keep at least one admin user.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    toast({
      title: "User Deleted",
      description: `${userToDelete?.name} has been removed.`,
    });
  };

  const resetForm = () => {
    setCurrentUser({
      id: '',
      name: '',
      email: '',
      role: 'staff',
      whatsapp: '',
    });
  };

  const startEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>User Management</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsTaxDialogOpen(true)}>
              <Percent className="h-4 w-4 mr-2" /> Set Tax Rate
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" /> Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Add a new user with appropriate access level.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={currentUser.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={currentUser.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="e.g., +919876543210"
                      value={currentUser.whatsapp}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">Include country code (e.g., +91 for India)</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={currentUser.role} 
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
        <CardDescription>
          Manage user accounts and access permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.whatsapp || '-'}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => startEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1}
                  >
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
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentUser.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-whatsapp">WhatsApp Number</Label>
                <Input
                  id="edit-whatsapp"
                  name="whatsapp"
                  placeholder="e.g., +919876543210"
                  value={currentUser.whatsapp || ''}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Include country code (e.g., +91 for India)</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={currentUser.role} 
                  onValueChange={handleRoleChange}
                  disabled={
                    currentUser.role === 'admin' && 
                    users.filter(u => u.role === 'admin').length <= 1
                  }
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isTaxDialogOpen} onOpenChange={setIsTaxDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Tax Rate</DialogTitle>
              <DialogDescription>
                Configure the tax percentage applied to all orders
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  value={taxRate}
                  onChange={handleTaxRateChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTaxDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveTaxRate}>Save Tax Rate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
