import React from 'react';
import Link from 'next/link';

interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  changeLabel?: string;
  as?: typeof Link;
  href?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  prefix = '',
  suffix = '',
  change,
  changeLabel,
  as: Component = 'div',
  href,
  className = '',
}: MetricCardProps) {
  const formattedValue =
    value >= 1000
      ? `${prefix}${(value / 1000).toFixed(1)}k${suffix}`
      : `${prefix}${value.toFixed(1)}${suffix}`;

  const props = {
    className: `p-6 bg-white rounded-lg shadow ${className}`,
    ...(href && { href }),
  };

  return (
    <Component {...props}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{formattedValue}</p>
        {change !== undefined && (
          <p
            className={`ml-2 flex items-baseline text-sm font-semibold ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? '↑' : '↓'}
            {Math.abs(change).toFixed(1)}%
          </p>
        )}
      </div>
      {changeLabel && <p className="mt-1 text-sm text-gray-500">{changeLabel}</p>}
    </Component>
  );
}
