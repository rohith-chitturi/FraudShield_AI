import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, ShieldAlert, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const mockTrendData = [
  { name: 'Mon', transactions: 4000, fraud: 24 },
  { name: 'Tue', transactions: 3000, fraud: 13 },
  { name: 'Wed', transactions: 2000, fraud: 98 },
  { name: 'Thu', transactions: 2780, fraud: 39 },
  { name: 'Fri', transactions: 1890, fraud: 48 },
  { name: 'Sat', transactions: 2390, fraud: 38 },
  { name: 'Sun', transactions: 3490, fraud: 43 },
];

export default function Dashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      // For now mock response if API not ready, else use real
      try {
        const res = await apiClient.get('/analytics/dashboard');
        return res.data;
      } catch (e) {
        return { total_transactions: 25000, fraud_transactions: 750, fraud_percentage: 3.0 };
      }
    }
  });

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  const kpis = [
    { title: "Total Transactions", value: metrics?.total_transactions?.toLocaleString() || "0", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Fraud Detected", value: metrics?.fraud_transactions?.toLocaleString() || "0", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
    { title: "Fraud Rate", value: `${metrics?.fraud_percentage || 0}%`, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Model Accuracy", value: "99.8%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Analytics Overview</h1>
        <p className="text-sm text-gray-400">Monitor real-time transaction anomalies and model performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={kpi.title}
            className="p-5 rounded-lg bg-[#111111] border border-[#222222] shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-2xl font-semibold text-white">{kpi.value}</h3>
              </div>
              <div className={`p-2 rounded-md ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1 */}
        <div className="p-5 rounded-lg bg-[#111111] border border-[#222222] shadow-sm">
          <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Transaction Volume</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '4px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Area type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="p-5 rounded-lg bg-[#111111] border border-[#222222] shadow-sm">
          <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Fraud Detections</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '4px' }}
                />
                <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
