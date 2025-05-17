
import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { MenuItem as MenuItemType, Category } from '../types';

interface MenuListProps {
  items: MenuItemType[];
}

const MenuList = ({ items }: MenuListProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...new Set(items.map(item => item.category))];
  
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 pb-2 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              activeCategory === category ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuList;
