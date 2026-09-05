"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DeviceIntakeChart({ data }: { data: any[] }) {
  // Expected data format: { name: 'Jan', count: 12 }
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111827', 
              borderColor: '#374151',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#f9fafb'
            }}
            itemStyle={{ color: '#818cf8' }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#6366f1" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
