import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { api } from './lib/api';

export default function App() {
  const { profiles, activeProfileId, setProfiles, setActiveProfile, setCategories } = useAppStore();

  useEffect(() => {
    api.getProfiles().then(setProfiles);
    api.getCategories().then(setCategories);
  }, []);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Pulse</h1>
        <div className="flex gap-2">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all
                ${p.id === activeProfileId
                  ? 'ring-2 ring-blue-500 bg-blue-50 scale-110'
                  : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {p.avatar}
            </button>
          ))}
        </div>
      </header>
      <main className="p-4 max-w-lg mx-auto">
        <p className="text-gray-500 text-center mt-8">
          Welcome, {activeProfile?.name || '...'}! Pulse is loading...
        </p>
      </main>
    </div>
  );
}
