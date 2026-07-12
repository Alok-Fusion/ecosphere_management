'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileBarChart,
  FileCheck2,
  Flag,
  Gift,
  Gauge,
  Handshake,
  Leaf,
  LogOut,
  Menu,
  Moon,
  PackageCheck,
  Settings,
  ShieldAlert,
  Sun,
  Target,
  Trophy,
  UserRound,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  module: string;
};

type NavSection = {
  title: string | null;
  items: NavItem[];
};

type UserSummary = {
  name: string;
  email: string;
  role: string;
};

type Notification = {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const navSections: NavSection[] = [
  {
    title: null,
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: Gauge, module: 'dashboard' },
      { label: 'User Profile', href: '/dashboard/profile', icon: UserRound, module: 'profile' },
    ],
  },
  {
    title: 'Environmental',
    items: [
      { label: 'Emission Factors', href: '/dashboard/environmental/emission-factors', icon: Zap, module: 'environmental' },
      { label: 'Product ESG Profiles', href: '/dashboard/environmental/product-profiles', icon: PackageCheck, module: 'environmental' },
      { label: 'Carbon Transactions', href: '/dashboard/environmental/carbon-transactions', icon: Building2, module: 'environmental' },
      { label: 'Environmental Goals', href: '/dashboard/environmental/goals', icon: Target, module: 'environmental' },
    ],
  },
  {
    title: 'Social',
    items: [
      { label: 'CSR Activities', href: '/dashboard/social/csr-activities', icon: Handshake, module: 'social' },
      { label: 'Employee Participation', href: '/dashboard/social/participation', icon: UsersRound, module: 'social' },
      { label: 'Diversity Dashboard', href: '/dashboard/social/diversity', icon: BarChart3, module: 'social' },
    ],
  },
  {
    title: 'Governance',
    items: [
      { label: 'Policies', href: '/dashboard/governance/policies', icon: ClipboardList, module: 'governance' },
      { label: 'Policy Acknowledgements', href: '/dashboard/governance/acknowledgements', icon: FileCheck2, module: 'governance' },
      { label: 'Audits', href: '/dashboard/governance/audits', icon: ClipboardCheck, module: 'governance' },
      { label: 'Compliance Issues', href: '/dashboard/governance/compliance', icon: ShieldAlert, module: 'governance' },
    ],
  },
  {
    title: 'Gamification',
    items: [
      { label: 'Challenges', href: '/dashboard/gamification/challenges', icon: Trophy, module: 'gamification' },
      { label: 'Challenge Participation', href: '/dashboard/gamification/participation', icon: Flag, module: 'gamification' },
      { label: 'Badges', href: '/dashboard/gamification/badges', icon: Award, module: 'gamification' },
      { label: 'Rewards', href: '/dashboard/gamification/rewards', icon: Gift, module: 'gamification' },
      { label: 'Leaderboard', href: '/dashboard/gamification/leaderboard', icon: BarChart3, module: 'gamification' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Reports', href: '/dashboard/reports', icon: FileBarChart, module: 'reports' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: Settings, module: 'settings' },
    ],
  },
];

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    fetch('/api/notifications')
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(() => {});

    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const markNotificationsRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' }).catch(() => {});
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  };

  return (
    <>
      <div className="mobile-topbar">
        <button className="icon-button" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <Menu size={18} />
        </button>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span className="brand-mark" style={{ width: '34px', height: '34px', borderRadius: '10px' }}>
            <Leaf size={18} />
          </span>
          <span className="brand-title" style={{ fontSize: '15px' }}>EcoSphere</span>
        </Link>
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {mobileOpen && <button className="mobile-scrim" type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <div className="app-toolbar">
        {notificationsOpen && (
          <div className="notification-panel">
            <div className="notification-panel-header">
              <div style={{ fontWeight: 800 }}>Notifications</div>
              <button className="btn btn-secondary btn-sm" type="button" onClick={markNotificationsRead}>
                Mark read
              </button>
            </div>
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="empty-state" style={{ padding: '20px' }}>No notifications yet</div>
              ) : notifications.map((item) => (
                <div key={item.id} className={`notification-item ${item.read ? '' : 'unread'}`}>
                  <p className="notification-message">{item.message}</p>
                  <div className="notification-time">{item.type.replaceAll('_', ' ')} - {formatTime(item.createdAt)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link href="/dashboard/profile" className="user-card-link app-user-pill">
          <span className="avatar">{user?.name?.charAt(0).toUpperCase() || '?'}</span>
          <span className="app-user-copy">
            <span className="user-name">{user?.name || 'Loading...'}</span>
            <span className="user-role">{user?.role || 'Signed in'}</span>
          </span>
        </Link>

        <button className="icon-button" type="button" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Open notifications">
          <Bell size={17} />
          {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
        </button>
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="icon-button" type="button" onClick={handleLogout} aria-label="Sign out">
          <LogOut size={17} />
        </button>
      </div>

      <nav className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-logo">
          <Link href="/dashboard" className="brand-mark" aria-label="EcoSphere dashboard">
            <Leaf size={22} />
          </Link>
          <div style={{ minWidth: 0 }}>
            <span className="brand-title">EcoSphere</span>
            <span className="brand-subtitle">ESG cockpit</span>
          </div>
          <button className="icon-button sidebar-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" style={{ marginLeft: 'auto' }}>
            <X size={16} />
          </button>
        </div>

        <div className="sidebar-scroll">
          {navSections.map((section, index) => {
            const sectionKey = section.title || `root-${index}`;
            const isCollapsed = collapsed[sectionKey];
            return (
              <div key={sectionKey} className="sidebar-section">
                {section.title && (
                  <button className="sidebar-section-title" type="button" onClick={() => toggleSection(sectionKey)}>
                    <span>{section.title}</span>
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}
                {!isCollapsed && section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActiveRoute(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`sidebar-link ${active ? 'active' : ''}`}
                      data-module={item.module}
                    >
                      <span className="nav-mark">
                        <Icon size={16} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
