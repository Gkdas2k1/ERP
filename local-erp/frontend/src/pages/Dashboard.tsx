import React from 'react';
import { DollarSign, TrendingUp, Package, AlertCircle } from 'lucide-react';

const stats = [
  { title: 'Total Revenue', value: '$124,500', change: '+12.5%', icon: DollarSign, color: 'bg-green-500' },
  { title: 'Pending Invoices', value: '14', change: '-2.0%', icon: TrendingUp, color: 'bg-blue-500' },
  { title: 'Low Stock Items', value: '8', change: '+4.0%', icon: Package, color: 'bg-yellow-500' },
  { title: 'Overdue Payments', value: '$3,200', change: '+1.2%', icon: AlertCircle, color: 'bg-red-500' },
];

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80 flex items-center justify-center text-gray-400">
          Sales Forecast Chart (Coming in Phase 6)
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80 flex items-center justify-center text-gray-400">
          Inventory Analytics (Coming in Phase 6)
        </div>
      </div>
    </div>
  );
}