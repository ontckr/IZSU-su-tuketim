import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';

const COLORS = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', 
  '#4facfe', '#00f2fe', '#43e97b', '#fa709a', 
  '#fee140', '#30cfd0', '#a8edea', '#fed6e3'
];

const CustomTooltip = ({ active, payload, label, valueFormatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name || 'Değer'}:</span>{' '}
            <span className="font-bold">
              {valueFormatter ? valueFormatter(entry.value) : entry.value.toLocaleString('tr-TR')} m³
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const formatYAxis = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const ChartCard = ({ title, description, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 card-hover ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export const LineChartComponent = ({ data, dataKey, xKey = 'YIL', label = 'Tüketim' }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart 
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tick={{ fill: '#6b7280' }}
          tickFormatter={formatYAxis}
        />
        <Tooltip 
          content={<CustomTooltip valueFormatter={(val) => val.toLocaleString('tr-TR')} />}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke="#667eea" 
          fillOpacity={1} 
          fill="url(#colorGradient)" 
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke="#667eea" 
          strokeWidth={3}
          dot={{ fill: '#667eea', r: 4 }}
          activeDot={{ r: 6 }}
          name={label}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const BarChartComponent = ({ data, dataKey, xKey = 'ILCE', label = 'Tüketim' }) => {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart 
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 80 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#667eea" stopOpacity={1}/>
            <stop offset="100%" stopColor="#764ba2" stopOpacity={1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey={xKey} 
          angle={-45} 
          textAnchor="end" 
          height={100}
          stroke="#6b7280"
          style={{ fontSize: '11px' }}
          tick={{ fill: '#6b7280' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          tick={{ fill: '#6b7280' }}
          tickFormatter={formatYAxis}
        />
        <Tooltip 
          content={<CustomTooltip valueFormatter={(val) => val.toLocaleString('tr-TR')} />}
        />
        <Legend />
        <Bar 
          dataKey={dataKey} 
          fill="url(#barGradient)" 
          radius={[8, 8, 0, 0]}
          name={label}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PieChartComponent = ({ data, dataKey, nameKey }) => {
  const renderCustomLabel = ({ name, percent, value }) => {
    if (percent < 0.05) return null;
    return `${name}: ${(percent * 100).toFixed(1)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip 
          content={<CustomTooltip valueFormatter={(val) => val.toLocaleString('tr-TR')} />}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          wrapperStyle={{ paddingTop: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
