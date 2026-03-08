import { Home, BarChart3, Sparkles, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../../stores/appStore';
import type { Tab } from './BottomNav';

const navItems: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'insights', label: 'Insights', icon: Sparkles },
  { id: 'guide', label: 'Guide', icon: BookOpen },
];

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { profiles, activeProfileId, setActiveProfile } = useAppStore();

  return (
    <aside className="hidden md:flex md:flex-col md:w-52 md:fixed md:inset-y-0 md:left-0 bg-white border-r border-gray-100 z-40">
      {/* Logo */}
      <div className="px-5 py-5">
        <h1 className="text-xl font-bold text-gray-900">Pulse</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              activeTab === id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Profile switcher */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400 font-medium px-3 mb-2">Profiles</p>
        <div className="flex gap-2 px-2">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              className={clsx(
                'w-9 h-9 rounded-full flex items-center justify-center text-base transition-all',
                p.id === activeProfileId
                  ? 'ring-2 ring-blue-500 bg-blue-50 scale-110'
                  : 'bg-gray-100 hover:bg-gray-200',
              )}
              title={p.name}
            >
              {p.avatar}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
