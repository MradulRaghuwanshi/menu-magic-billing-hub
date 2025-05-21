
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  popular?: boolean;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  id?: string;
}

export type Category = 'coffee' | 'tea' | 'pastry' | 'sandwich' | 'other';

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularItems: {
    name: string;
    quantity: number;
  }[];
  salesByCategory: {
    category: string;
    amount: number;
  }[];
  dailySales: {
    date: string;
    amount: number;
  }[];
}

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  whatsapp?: string; // Added WhatsApp number field
}
