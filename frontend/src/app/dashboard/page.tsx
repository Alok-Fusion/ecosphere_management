'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  BarChart3,
  Bot,
  Building2,
  FileBarChart,
  Leaf,
  ListChecks,
  RefreshCw,
  Sparkles,
  Trophy,
  UsersRound,
} from 'lucide-react';

interface DashboardData {
  kpis: { environmental: number; social: number; governance: number; overall: number };
  emissionsTrend: { month: string; emissions: number }[];
  departmentRanking: { name: string; score: number; environmental: number; social: number; governance: number }[];
  recentActivity: { type: string; text: string; status: string; time: string }[];
}

const statusClass: Record<string, string> = {
  Approved: 'badge-green',
  Pending: 'badge-yellow',
  Rejected: 'badge-red',
  Open: 'badge-red',
  Resolved: 'badge-green',
  Completed: 'badge-blue',
};

function monthLabel(value: string) {
  const [, month] = value.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[Number(month) - 1] || value;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((response) => response.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const generateInsight = async () => {
    setInsightLoading(true);
    try {
      const response = await fetch('/api/insights/generate', { method: 'POST' });
      const result = await response.json();
      setInsight(result.insight || result.error || 'Unable to generate insight.');
    } catch {
      setInsight('Failed to connect to the AI insight service.');
    } finally {
      setInsightLoading(false);
    }
  };

  if (!data) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">ESG performance overview</p>
          </div>
        </div>
        <div className="kpi-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="kpi-tile">
              <div className="skeleton" style={{ height: '18px', width: '110px', marginBottom: '18px' }} />
              <div className="skeleton" style={{ height: '42px', width: '86px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { kpis, emissionsTrend, departmentRanking, recentActivity } = data;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">ESG performance overview across environment, social, governance, and engagement.</p>
        </div>
        <div className="page-actions">
          <Link href="/dashboard/environmental/carbon-transactions" className="btn btn-primary">
            <Leaf size={16} />
            Log Carbon Data
          </Link>
          <Link href="/dashboard/gamification/challenges" className="btn btn-orange">
            <Trophy size={16} />
            Start Challenge
          </Link>
          <Link href="/dashboard/reports" className="btn btn-secondary">
            <FileBarChart size={16} />
            View Reports
          </Link>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-tile green">
          <div className="kpi-label">Environmental</div>
          <div className="kpi-value">{kpis.environmental}<span className="unit">/100</span></div>
        </div>
        <div className="kpi-tile blue">
          <div className="kpi-label">Social</div>
          <div className="kpi-value">{kpis.social}<span className="unit">/100</span></div>
        </div>
        <div className="kpi-tile purple">
          <div className="kpi-label">Governance</div>
          <div className="kpi-value">{kpis.governance}<span className="unit">/100</span></div>
        </div>
        <div className="kpi-tile overall">
          <div className="kpi-label">Overall ESG</div>
          <div className="kpi-value">{kpis.overall}<span className="unit">/100</span></div>
        </div>
      </div>

      <div className="insight-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <Bot size={18} />
          AI ESG Insight
        </h3>
        {insight ? (
          <div>
            <p className="insight-text">{insight}</p>
            <button className="btn btn-secondary btn-sm" type="button" onClick={generateInsight} disabled={insightLoading} style={{ marginTop: '16px' }}>
              <RefreshCw size={14} />
              {insightLoading ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        ) : (
          <div>
            <p className="insight-text">
              Generate a concise analysis of current ESG health, weakest dimension, and one recommended action.
            </p>
            <button className="btn btn-primary btn-sm" type="button" onClick={generateInsight} disabled={insightLoading} style={{ marginTop: '16px' }}>
              <Sparkles size={14} />
              {insightLoading ? 'Generating...' : 'Generate Insight'}
            </button>
          </div>
        )}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Activity size={17} />
            Emissions Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={emissionsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={monthLabel} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)' }}
                labelStyle={{ color: 'var(--text-secondary)' }}
              />
              <Line type="monotone" dataKey="emissions" stroke="var(--accent-green)" strokeWidth={3} dot={{ fill: 'var(--accent-green)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <BarChart3 size={17} />
            Department ESG Ranking
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentRanking} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} width={104} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              <Bar dataKey="score" fill="var(--accent-blue)" radius={[0, 8, 8, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <ListChecks size={17} />
          Recent Activity
        </h3>
        <div className="activity-feed">
          {recentActivity.length === 0 ? (
            <div className="empty-state">No recent activity</div>
          ) : recentActivity.map((item, index) => {
            const isParticipation = item.type === 'participation';
            return (
              <div key={`${item.time}-${index}`} className="activity-item">
                <div
                  className="activity-icon"
                  style={{ background: isParticipation ? 'var(--accent-blue-dim)' : 'var(--accent-purple-dim)' }}
                >
                  {isParticipation ? <UsersRound size={17} /> : <Building2 size={17} />}
                </div>
                <div>
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">
                    <span className={`badge ${statusClass[item.status] || 'badge-gray'}`}>{item.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
