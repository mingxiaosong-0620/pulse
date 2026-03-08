interface CategoryTotal {
  id: number;
  name: string;
  color: string;
  icon: string;
  total_minutes: number;
}

interface CategoryLeaderboardProps {
  totals: CategoryTotal[];
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function CategoryLeaderboard({ totals }: CategoryLeaderboardProps) {
  const sorted = [...totals].sort((a, b) => b.total_minutes - a.total_minutes);
  const grandTotal = sorted.reduce((sum, c) => sum + c.total_minutes, 0);

  if (sorted.length === 0 || grandTotal === 0) {
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
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Category Summary</h3>
        <div className="space-y-3">
          {sorted.map((cat) => {
            const pct = grandTotal > 0 ? (cat.total_minutes / grandTotal) * 100 : 0;
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-lg leading-none">{cat.icon}</span>
                  <span className="text-sm text-gray-700 flex-1">{cat.name}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatTime(cat.total_minutes)}
                  </span>
                  <span className="text-xs text-gray-400 w-10 text-right">
                    {Math.round(pct)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total</span>
          <span className="text-sm font-bold text-gray-900">{formatTime(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
