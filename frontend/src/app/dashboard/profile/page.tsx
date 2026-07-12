'use client';

import { useEffect, useState } from 'react';
import { Award, CheckCircle2, Flag, KeyRound, Leaf, Save, ShieldAlert, Trophy, UserRound } from 'lucide-react';

interface Department {
  id: number;
  name: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlockRuleType?: string;
  unlockThreshold?: number;
}

interface UserBadge {
  id: number;
  unlockedAt?: string;
  badge: Badge;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  xp: number;
  difficulty: string;
  evidenceRequired: boolean;
}

interface ChallengeParticipation {
  id: number;
  progressPct: number;
  proofFileName: string;
  approvalStatus: string;
  xpAwarded: number;
  challenge: Challenge;
}

interface CSRActivity {
  id: number;
  title: string;
  description: string;
}

interface EmployeeParticipation {
  id: number;
  completionDate: string;
  pointsEarned: number;
  approvalStatus: string;
  proofFileName: string;
  activity: CSRActivity | null;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  xpTotal: number;
  pointsBalance: number;
  departmentId?: number | null;
  department?: Department;
  badges?: UserBadge[];
  challengeParticipations?: ChallengeParticipation[];
  employeeParticipations?: EmployeeParticipation[];
}

const statusClass: Record<string, string> = {
  Approved: 'badge-green',
  Pending: 'badge-yellow',
  Rejected: 'badge-red',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [proofFiles, setProofFiles] = useState<Record<number, string>>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [password, setPassword] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (!response.ok) {
        setError('Failed to load profile details.');
        return;
      }

      const data = await response.json();
      setProfile(data);
      setName(data.name || '');
      setEmail(data.email || '');
      setDepartmentId(data.departmentId ? String(data.departmentId) : '');
    } catch {
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetch('/api/departments')
      .then((response) => response.json())
      .then(setDepartments)
      .catch(() => {});
  }, []);

  const handleCompleteChallenge = async (participationId: number) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/challenge-participations/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: participationId,
          proofFileName: proofFiles[participationId] || '',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to submit challenge proof.');
        return;
      }

      setSuccess('Challenge submitted for review.');
      fetchProfile();
    } catch {
      setError('Connection failed. Please try again.');
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          departmentId: departmentId ? parseInt(departmentId) : null,
          ...(password && { password }),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update profile.');
        return;
      }

      setSuccess('Profile updated successfully.');
      setPassword('');
      fetchProfile();
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">User Profile</h1>
            <p className="page-subtitle">Loading user profile...</p>
          </div>
        </div>
        <div className="kpi-grid">
          {[1, 2, 3].map((item) => <div key={item} className="kpi-tile"><div className="skeleton" style={{ height: '70px' }} /></div>)}
        </div>
      </div>
    );
  }

  const currentXP = profile?.xpTotal || 0;
  const level = Math.floor(currentXP / 100) + 1;
  const xpInCurrentLevel = currentXP % 100;
  const progressPercent = Math.min(Math.max(xpInCurrentLevel, 0), 100);
  const isAdmin = profile?.role === 'Admin';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Manage personal info, challenge submissions, awards, and EcoPoints.</p>
        </div>
      </div>

      {(error || success) && (
        <div className={`alert ${error ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '18px' }}>
          {error || success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.85fr) minmax(0, 2fr)', gap: '22px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <section className="card">
            <div style={{ textAlign: 'center' }}>
              <div className="avatar" style={{ width: '86px', height: '86px', margin: '0 auto 16px', borderRadius: '24px', fontSize: '34px' }}>
                {profile?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <h2 style={{ margin: '0 0 5px', fontSize: '21px', fontWeight: 850 }}>{profile?.name}</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{profile?.role} / {profile?.department?.name || 'No department'}</p>
            </div>

            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800 }}>Level {level}</span>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>{xpInCurrentLevel} / 100 XP</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '18px' }}>
              <div className="card" style={{ padding: '14px', boxShadow: 'none', background: 'var(--bg-tertiary)' }}>
                <div style={{ color: 'var(--accent-green)', fontSize: '24px', fontWeight: 850 }}>{profile?.pointsBalance || 0}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 800 }}>EcoPoints</div>
              </div>
              <div className="card" style={{ padding: '14px', boxShadow: 'none', background: 'var(--bg-tertiary)' }}>
                <div style={{ color: 'var(--accent-blue)', fontSize: '24px', fontWeight: 850 }}>{profile?.badges?.length || 0}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 800 }}>Badges</div>
              </div>
            </div>
          </section>

          <section className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserRound size={17} />
              Edit Information
            </h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <input id="profile-name" className="form-input" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-email">Email Address {!isAdmin && '(Locked)'}</label>
                <input id="profile-email" type="email" className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} disabled={!isAdmin} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-department">Department {!isAdmin && '(Locked)'}</label>
                <select id="profile-department" className="form-select" value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} disabled={!isAdmin}>
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>{department.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-password">Update Password</label>
                <input id="profile-password" type="password" className="form-input" placeholder="Leave blank to keep current" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={updating} style={{ width: '100%' }}>
                {updating ? <KeyRound size={16} /> : <Save size={16} />}
                {updating ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <section className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={17} />
              Earned Badges
              <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>{profile?.badges?.length || 0} earned</span>
            </h3>
            {!profile?.badges?.length ? (
              <div className="empty-state">No badges unlocked yet. Join challenges and CSR activities to build momentum.</div>
            ) : (
              <div className="card-grid">
                {profile.badges.map((userBadge) => (
                  <div key={userBadge.id} className="card card-orange" style={{ boxShadow: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span className="nav-mark" style={{ width: '38px', height: '38px', color: 'var(--accent-orange)' }}>
                        <Award size={19} />
                      </span>
                      <div>
                        <h4 style={{ margin: '0 0 5px', fontSize: '14px', fontWeight: 850 }}>{userBadge.badge.name}</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>{userBadge.badge.description}</p>
                        {userBadge.unlockedAt && (
                          <div style={{ marginTop: '9px' }} className="badge badge-green">
                            Unlocked {new Date(userBadge.unlockedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
            <section className="card">
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={17} />
                Challenge Track
              </h3>
              {!profile?.challengeParticipations?.length ? (
                <div className="empty-state">Not enrolled in any challenges.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profile.challengeParticipations.map((participation) => (
                    <article key={participation.id} className="card" style={{ padding: '14px', boxShadow: 'none', background: 'var(--bg-tertiary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                        <strong>{participation.challenge.title}</strong>
                        <span className={`badge ${statusClass[participation.approvalStatus] || 'badge-gray'}`}>{participation.approvalStatus}</span>
                      </div>
                      <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
                        {participation.challenge.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${participation.progressPct}%`, background: 'var(--accent-orange)' }} />
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800 }}>{participation.progressPct}%</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                        <span className="badge badge-orange">{participation.challenge.xp} XP</span>
                        {participation.proofFileName && <span className="badge badge-green">{participation.proofFileName}</span>}
                      </div>
                      {participation.progressPct < 100 && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-default)' }}>
                          {participation.challenge.evidenceRequired && (
                            <div className="form-group" style={{ marginBottom: '10px' }}>
                              <label className="form-label">Completion Evidence</label>
                              <input
                                className="form-input"
                                placeholder="receipt.pdf or short reference"
                                value={proofFiles[participation.id] || ''}
                                onChange={(event) => setProofFiles({ ...proofFiles, [participation.id]: event.target.value })}
                              />
                            </div>
                          )}
                          <button className="btn btn-orange btn-sm" type="button" onClick={() => handleCompleteChallenge(participation.id)} style={{ width: '100%' }}>
                            <Flag size={14} />
                            {participation.challenge.evidenceRequired ? 'Submit for Review' : 'Complete Challenge'}
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="card">
              <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Leaf size={17} />
                CSR Participation
              </h3>
              {!profile?.employeeParticipations?.length ? (
                <div className="empty-state">No CSR activities submitted yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {profile.employeeParticipations.map((participation) => (
                    <article key={participation.id} className="card" style={{ padding: '14px', boxShadow: 'none', background: 'var(--bg-tertiary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                        <strong>{participation.activity?.title || 'CSR activity'}</strong>
                        <span className={`badge ${statusClass[participation.approvalStatus] || 'badge-gray'}`}>{participation.approvalStatus}</span>
                      </div>
                      <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5 }}>
                        {participation.activity?.description || 'No description available.'}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge badge-blue">{participation.pointsEarned} pts</span>
                        <span className="badge badge-gray">{new Date(participation.completionDate).toLocaleDateString()}</span>
                        {participation.proofFileName ? (
                          <span className="badge badge-green"><CheckCircle2 size={12} /> {participation.proofFileName}</span>
                        ) : (
                          <span className="badge badge-gray"><ShieldAlert size={12} /> No proof</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
