export async function getPerformanceMetrics() {
  const res = await fetch('/api/analytics/performance');
  if (!res.ok) throw new Error('Failed to fetch performance metrics');
  return res.json();
}

export async function getFunnelAnalytics() {
  const res = await fetch('/api/analytics/funnel');
  if (!res.ok) throw new Error('Failed to fetch funnel analytics');
  return res.json();
}

export async function getRevenueAnalytics() {
  const res = await fetch('/api/analytics/revenue');
  if (!res.ok) throw new Error('Failed to fetch revenue analytics');
  return res.json();
}

export async function getAlertsAndRecommendations() {
  const res = await fetch('/api/analytics/alerts-recommendations');
  if (!res.ok) throw new Error('Failed to fetch alerts and recommendations');
  return res.json();
}

export async function getContentAnalytics() {
  const res = await fetch('/api/analytics/content');
  if (!res.ok) throw new Error('Failed to fetch content analytics');
  return res.json();
} 