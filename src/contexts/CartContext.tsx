
import React, { createContext, useState, useContext } from 'react';
import { CartItem, MenuItem, Customer } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  customer: Customer;
  discount: number;
  discountCode: string;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer) => void;
  applyDiscount: (code: string) => boolean;
  subtotal: number;
  tax: number;
  total: number;
  generateWhatsAppLink: () => string;
  printReceipt: () => void;
}

interface DiscountCode {
  code: string;
  value: number;
  type: 'percentage' | 'fixed';
}

// Demo discount codes
const availableDiscountCodes: DiscountCode[] = [
  { code: 'WELCOME10', value: 10, type: 'percentage' },
  { code: 'COFFEE5', value: 5, type: 'fixed' },
  { code: 'SUMMER20', value: 20, type: 'percentage' },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '' });
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const { toast } = useToast();

  const taxRate = 0.08; // 8% tax

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = discount;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax;

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
    setDiscountCode('');
    setDiscount(0);
  };

  const applyDiscount = (code: string): boolean => {
    const discountCode = availableDiscountCodes.find(
      dc => dc.code.toUpperCase() === code.toUpperCase()
    );

    if (!discountCode) {
      toast({
        title: "Invalid discount code",
        description: "The discount code you entered is invalid.",
        variant: "destructive",
      });
      return false;
    }

    let discountAmount = 0;
    if (discountCode.type === 'percentage') {
      discountAmount = (discountCode.value / 100) * subtotal;
    } else {
      discountAmount = discountCode.value;
    }

    // Cap discount at subtotal
    discountAmount = Math.min(discountAmount, subtotal);
    
    setDiscountCode(code);
    setDiscount(discountAmount);
    
    toast({
      title: "Discount applied",
      description: `${discountCode.type === 'percentage' ? discountCode.value + '%' : '₹' + discountCode.value} discount applied to your bill.`,
    });
    
    return true;
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
      `${item.quantity}x ${item.name} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const discountLine = discount > 0 ? `Discount (${discountCode}): -₹${discount.toFixed(2)}` : '';
    
    const billMessage = `
*Dine Ease Bill for ${customer.name}*
---------------------------
${billItems}
---------------------------
Subtotal: ₹${subtotal.toFixed(2)}
${discountLine}
${discountLine ? `Subtotal after discount: ₹${(subtotal - discount).toFixed(2)}\n` : ''}Tax (8%): ₹${tax.toFixed(2)}
*Total: ₹${total.toFixed(2)}*

Thank you for visiting!
    `.trim();

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(billMessage)}`;
  };

  const printReceipt = () => {
    if (items.length === 0) {
      toast({
        title: "Cannot print receipt",
        description: "Please add items to the bill first",
        variant: "destructive",
      });
      return;
    }

    const receiptContent = document.createElement('div');
    receiptContent.innerHTML = `
      <div style="font-family: monospace; width: 300px; padding: 20px;">
        <h2 style="text-align: center;">Dine Ease Bill</h2>
        <p style="text-align: center;">Receipt</p>
        <p>Date: ${new Date().toLocaleString()}</p>
        ${customer.name ? `<p>Customer: ${customer.name}</p>` : ''}
        <hr/>
        <table style="width: 100%;">
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td style="text-align: left;">${item.name}</td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                <td style="text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr/>
        <p style="display: flex; justify-content: space-between;">
          <span>Subtotal:</span>
          <span>₹${subtotal.toFixed(2)}</span>
        </p>
        ${discount > 0 ? `
          <p style="display: flex; justify-content: space-between;">
            <span>Discount (${discountCode}):</span>
            <span>-₹${discount.toFixed(2)}</span>
          </p>
        ` : ''}
        <p style="display: flex; justify-content: space-between;">
          <span>Tax (8%):</span>
          <span>₹${tax.toFixed(2)}</span>
        </p>
        <p style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>Total:</span>
          <span>₹${total.toFixed(2)}</span>
        </p>
        <hr/>
        <p style="text-align: center;">Thank you for your visit!</p>
      </div>
    `;
    
    const printWindow = window.open('', '', 'height=600,width=400');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Receipt</title></head><body>');
      printWindow.document.write(receiptContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      toast({
        title: "Receipt printed",
        description: "The receipt has been sent to your printer.",
      });
    } else {
      toast({
        title: "Print failed",
        description: "Please allow pop-ups for this site to print receipts.",
        variant: "destructive",
      });
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      customer,
      discount,
      discountCode,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setCustomer,
      applyDiscount,
      subtotal,
      tax,
      total,
      generateWhatsAppLink,
      printReceipt,
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
