import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { api } from './lib/api';
import Shell from './components/layout/Shell';
import TodayPage from './pages/TodayPage';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  const { setProfiles, setActiveProfile, setCategories } = useAppStore();

  useEffect(() => {
    api.getProfiles().then(setProfiles);
    api.getCategories().then(setCategories);
  }, []);

  return (
    <Shell>
      {(activeTab) => (
        <>
          {activeTab === 'today' && <TodayPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'insights' && (
            <p className="text-gray-400 text-center mt-16 text-sm">Insights coming soon</p>
          )}
        </>
      )}
    </Shell>
  );
}
