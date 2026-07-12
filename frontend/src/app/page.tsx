'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Leaf, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@ecosphere.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignup ? { name, email, password } : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Connection failed. Please confirm the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <section className="login-visual">
        <div>
          <div className="brand-mark">
            <Leaf size={22} />
          </div>
        </div>

        <div className="login-hero">
          <div className="login-kicker">
            <Sparkles size={15} />
            ESG operations platform
          </div>
          <h1>Turn sustainability work into measurable momentum.</h1>
          <p>
            EcoSphere brings carbon logs, policy compliance, CSR participation,
            gamified challenges, rewards, and executive ESG reporting into one
            focused workspace.
          </p>
        </div>

        <div className="login-metrics">
          <div className="login-metric">
            <strong>4</strong>
            <span>ESG score dimensions tracked in real time</span>
          </div>
          <div className="login-metric">
            <strong>22</strong>
            <span>Connected data models across environment, social, governance, and rewards</span>
          </div>
          <div className="login-metric">
            <strong>AI</strong>
            <span>Generated insight summaries for organizational ESG health</span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
            <span className="brand-mark" style={{ width: '40px', height: '40px' }}>
              <ShieldCheck size={21} />
            </span>
            <div>
              <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
              <p className="subtitle">Sign in to manage ESG programs, approvals, and reporting.</p>
            </div>
          </div>

          <div className="tab-pills" style={{ marginBottom: '24px' }}>
            <button
              type="button"
              className={`tab-pill ${!isSignup ? 'active' : ''}`}
              onClick={() => setIsSignup(false)}
              style={{ flex: 1 }}
            >
              <LockKeyhole size={15} />
              Sign In
            </button>
            <button
              type="button"
              className={`tab-pill ${isSignup ? 'active' : ''}`}
              onClick={() => setIsSignup(true)}
              style={{ flex: 1 }}
            >
              <BarChart3 size={15} />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  required={isSignup}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="card" style={{ marginTop: '18px', padding: '14px', boxShadow: 'none' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              Demo access
            </div>
            <div style={{ marginTop: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              admin@ecosphere.com / password123
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
