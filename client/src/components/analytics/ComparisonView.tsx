import type { Profile } from '../../lib/api';

interface CategoryTotal {
  id: number;
  name: string;
  color: string;
  icon: string;
  total_minutes: number;
}

interface CategoryDef {
  id: number;
  name: string;
  color: string;
}

interface ComparisonViewProps {
  profile1Totals: CategoryTotal[];
  profile2Totals: CategoryTotal[];
  profiles: Profile[];
  categories: CategoryDef[];
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function ComparisonView({
  profile1Totals,
  profile2Totals,
  profiles,
  categories,
}: ComparisonViewProps) {
  const profile1 = profiles[0];
  const profile2 = profiles[1];

  if (!profile1 || !profile2) {
    return (
      <div className="px-4 py-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-300 text-sm text-center">Need two profiles to compare</p>
        </div>
      </div>
    );
  }

  // Build a map for quick lookup
  const p1Map = new Map(profile1Totals.map((t) => [t.id, t]));
  const p2Map = new Map(profile2Totals.map((t) => [t.id, t]));

  // Collect all category IDs that appear in either profile
  const allCatIds = new Set([
    ...profile1Totals.map((t) => t.id),
    ...profile2Totals.map((t) => t.id),
  ]);

  // Build rows sorted by combined total (descending)
  const rows = Array.from(allCatIds)
    .map((catId) => {
      const p1 = p1Map.get(catId);
      const p2 = p2Map.get(catId);
      const catDef = categories.find((c) => c.id === catId);
      return {
        id: catId,
        name: p1?.name || p2?.name || catDef?.name || 'Unknown',
        color: p1?.color || p2?.color || catDef?.color || '#94a3b8',
        icon: p1?.icon || p2?.icon || '',
        p1Minutes: p1?.total_minutes || 0,
        p2Minutes: p2?.total_minutes || 0,
      };
    })
    .sort((a, b) => b.p1Minutes + b.p2Minutes - (a.p1Minutes + a.p2Minutes));

  // Find the max minutes across both profiles for bar scaling
  const maxMinutes = Math.max(
    ...rows.map((r) => Math.max(r.p1Minutes, r.p2Minutes)),
    1,
  );

  const p1Total = rows.reduce((sum, r) => sum + r.p1Minutes, 0);
  const p2Total = rows.reduce((sum, r) => sum + r.p2Minutes, 0);

  if (rows.length === 0) {
    return (
      <div className="px-4 py-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-300 text-sm text-center">No data for this week</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Side-by-Side Comparison</h3>

        {/* Profile headers */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{profile1.avatar}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{profile1.name}</p>
              <p className="text-xs text-gray-400">{formatTime(p1Total)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-300 font-medium">vs</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{profile2.name}</p>
              <p className="text-xs text-gray-400">{formatTime(p2Total)}</p>
            </div>
            <span className="text-lg">{profile2.avatar}</span>
          </div>
        </div>

        {/* Category rows */}
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.id}>
              {/* Category label */}
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: row.color }}
                />
                <span className="text-sm leading-none">{row.icon}</span>
                <span className="text-xs font-medium text-gray-600">{row.name}</span>
              </div>

              {/* Side-by-side bars */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                {/* Profile 1 bar (right-aligned, grows leftward) */}
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xs font-bold text-gray-700 shrink-0">
                    {row.p1Minutes > 0 ? formatTime(row.p1Minutes) : '-'}
                  </span>
                  <div className="h-4 rounded-full bg-gray-100 overflow-hidden w-full max-w-[120px]">
                    <div
                      className="h-full rounded-full transition-all duration-500 ml-auto"
                      style={{
                        width: `${maxMinutes > 0 ? (row.p1Minutes / maxMinutes) * 100 : 0}%`,
                        backgroundColor: row.color,
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-gray-200" />

                {/* Profile 2 bar (left-aligned, grows rightward) */}
                <div className="flex items-center gap-1.5">
                  <div className="h-4 rounded-full bg-gray-100 overflow-hidden w-full max-w-[120px]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${maxMinutes > 0 ? (row.p2Minutes / maxMinutes) * 100 : 0}%`,
                        backgroundColor: row.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 shrink-0">
                    {row.p2Minutes > 0 ? formatTime(row.p2Minutes) : '-'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals footer */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
            <div className="text-right">
              <span className="text-sm font-bold text-gray-900">{formatTime(p1Total)}</span>
            </div>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Total</span>
            <div>
              <span className="text-sm font-bold text-gray-900">{formatTime(p2Total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
