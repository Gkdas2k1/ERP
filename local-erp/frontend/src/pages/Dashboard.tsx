import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, ArrowUpRight, DollarSign, FileText, Sparkles, TrendingUp } from 'lucide-react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';

interface DashboardKpis {
  total_revenue: number;
  pending_invoices: number;
  low_stock_items: number;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKpis>({ total_revenue: 0, pending_invoices: 0, low_stock_items: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/analytics/dashboard')
      .then((res) => {
        setKpis(res.data.kpis);

        const historical = res.data.historical_sales.map((d: any) => ({ date: d.date, Actual: d.actual_sales, Forecast: null }));
        const forecast = res.data.forecast_sales.map((d: any) => ({ date: d.date, Actual: null, Forecast: d.predicted_sales }));

        const combined = [...historical, ...forecast].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setChartData(combined);
      })
      .catch((err) => console.error('Dashboard fetch error', err))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${kpis.total_revenue.toLocaleString()}`,
      icon: DollarSign,
      accent: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trend: '+12.4%',
    },
    {
      title: 'Pending Invoices',
      value: kpis.pending_invoices,
      icon: FileText,
      accent: 'from-blue-500 to-sky-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '2 awaiting review',
    },
    {
      title: 'Low Stock Items',
      value: kpis.low_stock_items,
      icon: AlertTriangle,
      accent: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      trend: 'Monitor closely',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-100 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-powered operations snapshot
            </div>
            <h2 className="mt-4 text-3xl font-semibold">Executive Dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Track revenue, invoices, and stock health in one polished view designed for faster decision-making.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Activity className="h-4 w-4" />
              Live updates enabled
            </div>
            <div className="mt-2 text-2xl font-semibold">{loading ? 'Syncing…' : 'Ready'}</div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accent}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">{stat.value}</p>
                </div>
                <div className={`rounded-2xl p-3 ${stat.iconBg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500">
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                <span>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            <TrendingUp className="h-4 w-4" />
            Focus this week
          </div>
          <h3 className="mt-3 text-xl font-semibold text-slate-800">Healthy momentum across the business</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Revenue is trending above last week’s pace.
            </li>
            <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
              Invoice approvals are moving quickly with low backlog.
            </li>
            <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
              Stock balance remains stable and well managed.
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              <TrendingUp className="h-4 w-4" />
              Sales forecast
            </div>
            <h3 className="mt-2 text-xl font-semibold text-slate-800">Trend and 7-day outlook</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" /> Actual
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" /> Forecast
            </div>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: '#93c5fd', strokeDasharray: '4 4' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.98)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                  }}
                  formatter={(value: any) => [value ? `$${value}` : '—', 'Sales']}
                />
                <Legend />
                <Line type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Forecast" stroke="#10b981" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Not enough historical sales data to generate a forecast. Create a few invoices to see the ML predictions.
          </div>
        )}
      </div>
    </div>
  );
}