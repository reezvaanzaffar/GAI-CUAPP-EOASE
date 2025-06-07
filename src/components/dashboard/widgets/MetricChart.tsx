import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

interface MetricChartProps {
  title: string;
  data: DataPoint[];
  prefix?: string;
  suffix?: string;
}

export const MetricChart: React.FC<MetricChartProps> = ({
  title,
  data,
  prefix = '',
  suffix = '',
}) => {
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${prefix}${(value / 1000000).toFixed(1)}M${suffix}`;
    }
    if (value >= 1000) {
      return `${prefix}${(value / 1000).toFixed(1)}K${suffix}`;
    }
    return `${prefix}${value.toFixed(2)}${suffix}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={value => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <YAxis tickFormatter={value => formatValue(value)} width={80} />
              <Tooltip
                formatter={(value: number) => [formatValue(value), '']}
                labelFormatter={label => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
