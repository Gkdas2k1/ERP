import { useEffect, useState } from 'react';
import { DollarSign, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

export default function Dashboard() {
  const [kpis, setKpis] = useState({ total_revenue: 0, pending_invoices: 0, low_stock_items: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    api.get('/api/analytics/dashboard').then((res) => {
      setKpis(res.data.kpis);
      
      // Merge historical and forecast data for the chart
      const historical = res.data.historical_sales.map((d: any) => ({ date: d.date, Actual: d.actual_sales, Forecast: null }));
      const forecast = res.data.forecast_sales.map((d: any) => ({ date: d.date, Actual: null, Forecast: d.predicted_sales }));
      
      // Combine and sort by date
      const combined = [...historical, ...forecast].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setChartData(combined);
    }).catch(err => console.error("Dashboard fetch error", err));
  }, []);

  const stats = [
    { title: 'Total Revenue', value: `$${kpis.total_revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Pending Invoices', value: kpis.pending_invoices, icon: FileText, color: 'bg-blue-500' },
    { title: 'Low Stock Items', value: kpis.low_stock_items, icon: AlertTriangle, color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Executive Dashboard</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className={`p-4 rounded-full ${stat.color} bg-opacity-10 mr-4`}>
              <stat.icon className={`h-8 w-8 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Forecasting Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Sales Trend & 7-Day Forecast</h3>
        </div>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} 
              />
              <Legend />
              <Line type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
            Not enough historical sales data to generate a forecast. Create a few invoices to see the ML predictions!
          </div>
        )}
      </div>
    </div>
  );
}