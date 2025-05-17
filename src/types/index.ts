
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Customer {
  name: string;
  phone: string;
}

export interface Bill {
  items: CartItem[];
  customer: Customer;
  subtotal: number;
  tax: number;
  total: number;
  isPaid: boolean;
  timestamp: string;
}

export type Category = 'coffee' | 'tea' | 'pastry' | 'sandwich' | 'other';
