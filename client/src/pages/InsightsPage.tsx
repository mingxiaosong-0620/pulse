import { useState, useCallback } from 'react';
import { startOfWeek, endOfWeek, format, addWeeks, subWeeks } from 'date-fns';
import { Sparkles, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { api } from '../lib/api';
import InsightCard from '../components/insights/InsightCard';

interface CachedInsight {
  key: string;
  insight: string;
  generatedAt: string;
}

export default function InsightsPage() {
  const { activeProfileId, profiles } = useAppStore();
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, CachedInsight>>(new Map());

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const startDate = format(weekStart, 'yyyy-MM-dd');
  const endDate = format(weekEnd, 'yyyy-MM-dd');
  const cacheKey = `${activeProfileId}-${startDate}`;

  const cachedResult = cache.get(cacheKey);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generateInsight(activeProfileId, startDate, endDate);
      const entry: CachedInsight = {
        key: cacheKey,
        insight: result.insight,
        generatedAt: result.generatedAt,
      };
      setCache((prev) => new Map(prev).set(cacheKey, entry));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insight');
    } finally {
      setLoading(false);
    }
  }, [activeProfileId, startDate, endDate, cacheKey]);

  const weekLabel = format(weekStart, 'MMM d') + ' – ' + format(weekEnd, 'MMM d');

  return (
    <div className="flex flex-col pb-24">
      {/* Week Selector */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setWeekStart((w) => subWeeks(w, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">Week of {format(weekStart, 'MMM d')}</p>
          <p className="text-xs text-gray-500">{weekLabel}</p>
        </div>
        <button
          onClick={() => setWeekStart((w) => addWeeks(w, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Profile indicator */}
      {activeProfile && (
        <div className="px-4 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1">
            <span>{activeProfile.avatar}</span>
            <span>{activeProfile.name}</span>
          </span>
        </div>
      )}

      {/* Content area */}
      <div className="px-4 space-y-4">
        {loading ? (
          /* Loading state */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex">
              <div className="w-1 shrink-0 bg-gradient-to-b from-blue-300 to-purple-300 animate-pulse" />
              <div className="flex-1 p-5 space-y-3 animate-pulse">
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-5/6 bg-gray-100 rounded" />
                <div className="h-3 w-4/6 bg-gray-100 rounded" />
                <div className="h-4 w-40 bg-gray-200 rounded mt-4" />
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-3/4 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-50">
              <Loader2 size={14} className="text-blue-500 animate-spin" />
              <span className="text-xs text-gray-500">Analyzing your time patterns...</span>
            </div>
          </div>
        ) : error ? (
          /* Error state */
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 text-center">
            <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="text-sm text-gray-700 mb-1">Something went wrong</p>
            <p className="text-xs text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : cachedResult ? (
          /* Insight result */
          <>
            <InsightCard insight={cachedResult.insight} generatedAt={cachedResult.generatedAt} />
            <button
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <Sparkles size={14} />
              Regenerate
            </button>
          </>
        ) : (
          /* Empty state — first generation */
          <div className="flex flex-col items-center pt-8">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-5">
              <Sparkles size={28} className="text-blue-500" />
            </div>
            <p className="text-sm text-gray-700 font-medium mb-1">Weekly Time Insight</p>
            <p className="text-xs text-gray-500 text-center mb-6 max-w-[240px]">
              Get an AI-powered summary of how you spent your time this week
            </p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white text-sm font-semibold shadow-sm hover:bg-blue-600 active:bg-blue-700 transition-colors"
            >
              <Sparkles size={16} />
              Generate Insight
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
