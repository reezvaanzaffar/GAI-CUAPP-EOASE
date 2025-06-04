import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { TimeRangeSelector, TimeRange } from '../shared/TimeRangeSelector';
import { MetricsCard } from '../shared/MetricsCard';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';

export const AnalyticsOverview: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('week');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalContent: 0,
    averagePerformance: 0,
    conversionRate: 0,
  });
  const [trends, setTrends] = useState({
    totalUsers: 0,
    totalContent: 0,
    averagePerformance: 0,
    conversionRate: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/analytics/dashboard');
        const data = res.data;
        setMetrics({
          totalUsers: data.analytics.visitors || 0,
          totalContent: data.analytics.pageViews || 0,
          averagePerformance: data.analytics.bounceRate || 0,
          conversionRate: data.analytics.conversionRate || 0,
        });
        setTrends({
          totalUsers: 0, // You can add trend logic if available
          totalContent: 0,
          averagePerformance: 0,
          conversionRate: 0,
        });
        setChartData([
          { date: 'Now', users: data.analytics.visitors, content: data.analytics.pageViews },
        ]);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    const now = new Date();
    let start = new Date();

    switch (range) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      default:
        break;
    }

    setStartDate(start);
    setEndDate(now);
  };

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedRange('custom');
  };

  // Helper to format metric values
  const formatValue = (value: number, type: 'int' | 'percent') => {
    if (type === 'percent') {
      return `${value.toFixed(2)}%`;
    }
    return Math.round(value).toLocaleString();
  };

  return (
    <Box>
      <TimeRangeSelector
        selectedRange={selectedRange}
        startDate={startDate}
        endDate={endDate}
        onRangeChange={handleRangeChange}
        onDateChange={handleDateChange}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total Users"
            value={formatValue(metrics.totalUsers, 'int')}
            change={trends.totalUsers}
            icon={<PeopleIcon />}
            loading={loading}
            tooltip="Total number of unique users"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Total Content"
            value={formatValue(metrics.totalContent, 'int')}
            change={trends.totalContent}
            icon={<ArticleIcon />}
            loading={loading}
            tooltip="Total number of content pieces"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Average Performance"
            value={formatValue(metrics.averagePerformance, 'percent')}
            change={trends.averagePerformance}
            icon={<SpeedIcon />}
            loading={loading}
            tooltip="Average performance score"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricsCard
            title="Conversion Rate"
            value={formatValue(metrics.conversionRate, 'percent')}
            change={trends.conversionRate}
            icon={<TrendingUpIcon />}
            loading={loading}
            tooltip="Overall conversion rate"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ height: 400 }}>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    name="Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="content"
                    stroke="#82ca9d"
                    name="Content"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}; 