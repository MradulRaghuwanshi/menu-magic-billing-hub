
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { OrderStats } from '@/types';

// Mock data for demonstration
const mockOrderStats: OrderStats = {
  totalOrders: 250,
  totalRevenue: 1850.75,
  averageOrderValue: 7.40,
  popularItems: [
    { name: "Cappuccino", quantity: 120 },
    { name: "Latte", quantity: 95 },
    { name: "Croissant", quantity: 85 },
    { name: "Espresso", quantity: 70 },
    { name: "Chocolate Muffin", quantity: 65 }
  ],
  salesByCategory: [
    { category: "Coffee", amount: 950.5 },
    { category: "Tea", amount: 320.25 },
    { category: "Pastry", amount: 425.75 },
    { category: "Sandwich", amount: 154.25 }
  ],
  dailySales: [
    { date: "Mon", amount: 250.75 },
    { date: "Tue", amount: 320.50 },
    { date: "Wed", amount: 275.25 },
    { date: "Thu", amount: 350.00 },
    { date: "Fri", amount: 410.75 },
    { date: "Sat", amount: 150.50 },
    { date: "Sun", amount: 93.00 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const OrderAnalysis = () => {
  const [period, setPeriod] = useState('weekly');
  const stats = mockOrderStats; // Would come from backend

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.averageOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList>
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="popular">Popular Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
              <CardDescription>Sales performance over the last week</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{ blue: { color: '#4F46E5' } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="amount" name="Sales (₹)" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="popular" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Items</CardTitle>
              <CardDescription>Items with highest sales volume</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={stats.popularItems} 
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip content={<CustomTooltip nameKey="name" valueLabel="Orders" />} />
                    <Bar dataKey="quantity" name="Orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Revenue distribution across categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="flex h-full items-center justify-center">
                <ChartContainer config={{}}>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={stats.salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                      label={renderCustomizedLabel}
                    >
                      {stats.salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip content={<CustomTooltip nameKey="category" valueLabel="Revenue" />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, nameKey = "date", valueLabel = "Sales" }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const name = data[nameKey];
    const value = payload[0].value;
    
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{name}</p>
        <p>{valueLabel}: {valueLabel === "Orders" ? value : `₹${typeof value === 'number' ? value.toFixed(2) : value}`}</p>
      </div>
    );
  }
  return null;
};

export default OrderAnalysis;
