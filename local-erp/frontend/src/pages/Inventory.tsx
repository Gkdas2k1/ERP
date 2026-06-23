import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const fetchItems = () => {
    api.get('/api/inventory/items').then(res => setItems(res.data)).catch(err => console.error(err));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/api/inventory/items', { 
      sku, name, category: 'General', unit: 'PCS', 
      standard_cost: 0, selling_price: parseFloat(price) 
    });
    setSku(''); setName(''); setPrice('');
    fetchItems();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h2>
      
      {/* Add Item Form */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow mb-6 flex gap-4">
        <input type="text" placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} className="border p-2 rounded flex-1" required />
        <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded flex-1" required />
        <input type="number" placeholder="Selling Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 rounded w-32" required />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Add Item</button>
      </form>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.selling_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}