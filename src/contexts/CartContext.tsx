
import React, { createContext, useState, useContext } from 'react';
import { CartItem, MenuItem, Customer } from '../types';
import { useToast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';

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
  printKOT: () => void;
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

  const createBillElement = (isKOT = false) => {
    const element = document.createElement('div');
    element.style.fontFamily = 'monospace';
    element.style.width = '300px';
    element.style.padding = '20px';
    element.style.background = 'white';
    element.style.color = 'black';

    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 10px;">
        <h2 style="margin: 0;">${isKOT ? 'Kitchen Order Ticket' : 'Dine Ease Bill'}</h2>
        <p style="margin: 5px 0;">${isKOT ? 'KOT' : 'Receipt'}</p>
        <p style="margin: 5px 0;">Date: ${new Date().toLocaleString()}</p>
        ${customer.name ? `<p style="margin: 5px 0;">Customer: ${customer.name}</p>` : ''}
      </div>
      <hr style="border: 1px dashed #000; margin: 10px 0;"/>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left;">Item</th>
            <th style="text-align: right;">Qty</th>
            ${!isKOT ? `
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Total</th>
            ` : ''}
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="text-align: left; padding: 3px 0;">${item.name}</td>
              <td style="text-align: right; padding: 3px 0;">${item.quantity}</td>
              ${!isKOT ? `
              <td style="text-align: right; padding: 3px 0;">₹${item.price.toFixed(2)}</td>
              <td style="text-align: right; padding: 3px 0;">₹${(item.price * item.quantity).toFixed(2)}</td>
              ` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${!isKOT ? `
      <hr style="border: 1px dashed #000; margin: 10px 0;"/>
      <div style="display: flex; justify-content: space-between; margin: 5px 0;">
        <span>Subtotal:</span>
        <span>₹${subtotal.toFixed(2)}</span>
      </div>
      ${discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
          <span>Discount (${discountCode}):</span>
          <span>-₹${discount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; margin: 5px 0;">
        <span>Tax (8%):</span>
        <span>₹${tax.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0;">
        <span>Total:</span>
        <span>₹${total.toFixed(2)}</span>
      </div>
      <hr style="border: 1px dashed #000; margin: 10px 0;"/>
      <p style="text-align: center; margin-top: 10px;">Thank you for your visit!</p>
      ` : ''}
    `;

    return element;
  };

  const generateWhatsAppLink = async () => {
    if (!customer.phone || items.length === 0) {
      toast({
        title: "Cannot generate bill",
        description: "Please enter customer phone number and add items to the bill",
        variant: "destructive",
      });
      return "";
    }

    try {
      // Create bill element
      const billElement = createBillElement(false);
      document.body.appendChild(billElement);
      
      // Convert to image
      const canvas = await html2canvas(billElement, {
        backgroundColor: 'white',
        scale: 2,
      });
      document.body.removeChild(billElement);
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else {
            toast({
              title: "Error",
              description: "Could not generate bill image",
              variant: "destructive",
            });
            resolve(new Blob());
          }
        }, 'image/png');
      });
      
      // Check if Web Share API is supported and can share files
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'bill.png', { type: 'image/png' })] })) {
        try {
          await navigator.share({
            title: `Dine Ease Bill for ${customer.name || 'Customer'}`,
            text: 'Your bill from Dine Ease',
            files: [new File([blob], 'bill.png', { type: 'image/png' })],
          });
          toast({
            title: "Bill shared",
            description: "The bill has been shared successfully",
          });
          return "";
        } catch (error) {
          console.error("Error sharing bill:", error);
          // Fall back to WhatsApp link if Web Share API fails
        }
      }
      
      // Create WhatsApp link with the bill image
      let formattedPhone = customer.phone.replace(/\D/g, '');
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }
      
      // Convert blob to base64 data URL
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      return new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          // Open image in new tab - user can then save and share manually
          const imageTab = window.open();
          if (imageTab) {
            imageTab.document.write(`
              <html>
                <head>
                  <title>Dine Ease Bill</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f5f5f5; }
                    img { max-width: 100%; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                    .instructions { margin-top: 20px; font-family: sans-serif; text-align: center; padding: 0 20px; }
                    .whatsapp-button { background-color: #25D366; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-size: 16px; margin-top: 15px; cursor: pointer; display: flex; align-items: center; gap: 8px; text-decoration: none; }
                    .whatsapp-button:hover { background-color: #128C7E; }
                  </style>
                </head>
                <body>
                  <img src="${dataUrl}" alt="Bill Image">
                  <div class="instructions">
                    <p>Your bill is ready. Click below to share it via WhatsApp.</p>
                    <a href="https://wa.me/${formattedPhone}?text=Here's your bill from Dine Ease" class="whatsapp-button" target="_blank">
                      Share via WhatsApp
                    </a>
                  </div>
                </body>
              </html>
            `);
            imageTab.document.close();
          }
          resolve("");
        };
      });
    } catch (error) {
      console.error("Error generating bill image:", error);
      toast({
        title: "Error",
        description: "Failed to generate bill image",
        variant: "destructive",
      });
      return "";
    }
  };

  const printBill = (isKOT = false) => {
    if (items.length === 0) {
      toast({
        title: `Cannot print ${isKOT ? 'KOT' : 'receipt'}`,
        description: "Please add items to the bill first",
        variant: "destructive",
      });
      return;
    }

    const billElement = createBillElement(isKOT);
    
    const printWindow = window.open('', '', 'height=600,width=400');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write(billElement.outerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      toast({
        title: `${isKOT ? 'KOT' : 'Receipt'} printed`,
        description: `The ${isKOT ? 'kitchen order ticket' : 'receipt'} has been sent to your printer.`,
      });
    } else {
      toast({
        title: "Print failed",
        description: "Please allow pop-ups for this site to print.",
        variant: "destructive",
      });
    }
  };

  const printReceipt = () => printBill(false);
  const printKOT = () => printBill(true);

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
      printKOT,
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
