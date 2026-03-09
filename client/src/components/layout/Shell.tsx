import { useState } from 'react';
import clsx from 'clsx';
import { useAppStore } from '../../stores/appStore';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import type { Tab } from './BottomNav';

interface ShellProps {
  children: (activeTab: Tab) => React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const { profiles, activeProfileId, setActiveProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('today');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main area */}
      <div className="flex-1 flex flex-col md:ml-16">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white shadow-sm md:hidden">
          <h1 className="text-xl font-bold text-gray-900">Pulse</h1>
          <div className="flex gap-2">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProfile(p.id)}
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all',
                  p.id === activeProfileId
                    ? 'ring-2 ring-blue-500 bg-blue-50 scale-110'
                    : 'bg-gray-100 hover:bg-gray-200',
                )}
              >
                {p.avatar}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full max-w-lg mx-auto md:max-w-4xl">
          {children(activeTab)}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
