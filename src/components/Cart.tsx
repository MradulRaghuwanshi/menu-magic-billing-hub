
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '../contexts/CartContext';
import { Trash, Send, Plus, Minus, Printer, Tag } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Customer } from '@/types';

const Cart = () => {
  const { 
    items, 
    customer, 
    setCustomer, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    tax,
    discount,
    total,
    generateWhatsAppLink,
    applyDiscount,
    printReceipt
  } = useCart();

  const [discountInputCode, setDiscountInputCode] = useState('');

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleApplyDiscount = () => {
    if (discountInputCode.trim()) {
      applyDiscount(discountInputCode);
    }
  };

  const handleSendToWhatsApp = () => {
    const whatsappLink = generateWhatsAppLink();
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Current Bill</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500 py-4 text-center">No items added yet</p>
      ) : (
        <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-6 w-6"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center">{item.quantity}</span>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-6 w-6"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 text-red-500"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {items.length > 0 && (
        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <Input
              value={discountInputCode}
              onChange={(e) => setDiscountInputCode(e.target.value)}
              placeholder="Discount code"
              className="flex-1"
            />
            <Button onClick={handleApplyDiscount}>
              <Tag className="mr-2 h-4 w-4" />
              Apply
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name">Customer Name</Label>
          <Input
            id="name"
            name="name"
            value={customer.name}
            onChange={handleCustomerChange}
            placeholder="Enter customer name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (with country code)</Label>
          <Input
            id="phone"
            name="phone"
            value={customer.phone}
            onChange={handleCustomerChange}
            placeholder="e.g., +11234567890"
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleSendToWhatsApp}
          disabled={items.length === 0 || !customer.phone}
        >
          <Send className="mr-2 h-4 w-4" />
          Send to WhatsApp
        </Button>

        <Button 
          variant="secondary" 
          className="w-full" 
          onClick={printReceipt}
          disabled={items.length === 0}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default Cart;
