import React from 'react';
import { TrendingUp, Activity, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

export default function Statistics({ transactions = [] }) {
  const total = transactions.length;
  const successful = transactions.filter(t => t.success).length;
  const failed = total - successful;
  const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : 0;
  const avgTime = total > 0 
    ? (transactions.reduce((sum, t) => sum + (t.time || 0), 0) / total).toFixed(2)
    : 0;

  const stats = [
    {
      label: 'کل تراکنش‌ها',
      value: total,
      icon: Activity,
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      label: 'تراکنش موفق',
      value: successful,
      icon: CheckCircle,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
    },
    {
      label: 'تراکنش ناموفق',
      value: failed,
      icon: XCircle,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      label: 'نرخ موفقیت',
      value: `${successRate}%`,
      icon: TrendingUp,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="card fade-in"
          style={{
            padding: '20px',
            background: `linear-gradient(135deg, ${stat.bgColor} 0%, transparent 100%)`,
            border: `1px solid ${stat.color}20`,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: stat.bgColor,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <stat.icon size={24} color={stat.color} />
            </div>
          </div>

          <div style={{
            fontSize: '32px',
            fontWeight: 800,
            color: stat.color,
            marginBottom: '4px',
          }}>
            {stat.value}
          </div>

          <div style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontWeight: 600,
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
