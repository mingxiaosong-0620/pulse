import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DailyStat, Entry } from '../../lib/api';
import { api } from '../../lib/api';
import { useAppStore } from '../../stores/appStore';

interface Props {
  stats: DailyStat[];
  taskMinutes?: number;
  wallClockMinutes?: number;
  multiplier?: number;
}

const FULL_DAY = 1440;

function fmtHours(mins: number): string {
  const h = (mins / 60).toFixed(1).replace(/\.0$/, '');
  return `${h}h`;
}

// Custom tooltip on hover
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, total_minutes, color } = payload[0].payload;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>
      <span className="text-xs text-gray-500">{fmtHours(total_minutes)} ({Math.round(total_minutes / FULL_DAY * 100)}%)</span>
    </div>
  );
}

interface SubBreakdown {
  name: string;
  icon: string;
  minutes: number;
}

export default function DailyRing({ stats, taskMinutes, wallClockMinutes, multiplier }: Props) {
  const { activeProfileId, selectedDate, categories } = useAppStore();
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [subBreakdown, setSubBreakdown] = useState<SubBreakdown[]>([]);

  const unlabeledStat = stats.find((s) => s.name === 'Unlabeled');
  const trackedStats = stats.filter((s) => s.name !== 'Unlabeled');
  const trackedMinutes = trackedStats.reduce((sum, s) => sum + s.total_minutes, 0);
  const trackedHours = (trackedMinutes / 60).toFixed(1).replace(/\.0$/, '');

  const wc = wallClockMinutes ?? trackedMinutes;
  const unlabeledMinutes = unlabeledStat ? unlabeledStat.total_minutes : Math.max(0, FULL_DAY - wc);
  const data = [
    ...trackedStats.filter((s) => s.total_minutes > 0),
    ...(unlabeledMinutes > 0 ? [{ id: 6, name: 'Unlabeled', color: '#9CA3AF', icon: '❓', total_minutes: unlabeledMinutes }] : []),
  ];

  const hasData = data.length > 0 && data.some((d) => d.total_minutes > 0);
  const chartData = hasData ? data : [{ name: 'Empty', total_minutes: 1, color: '#E5E7EB' }];

  // Fetch subcategory breakdown when a category is expanded
  useEffect(() => {
    if (expandedCat === null) { setSubBreakdown([]); return; }
    api.getEntries(activeProfileId, selectedDate).then((entries: Entry[]) => {
      const cat = categories.find(c => c.id === expandedCat);
      if (!cat) return;
      const subIds = new Set(cat.subcategories.map(s => s.id));
      const subMap = new Map<number, { name: string; icon: string; minutes: number }>();
      entries.forEach(e => {
        if (subIds.has(e.subcategory_id)) {
          const existing = subMap.get(e.subcategory_id);
          if (existing) {
            existing.minutes += e.duration_minutes;
          } else {
            subMap.set(e.subcategory_id, {
              name: e.subcategory_name || 'Unknown',
              icon: e.subcategory_icon || '📌',
              minutes: e.duration_minutes,
            });
          }
        }
      });
      setSubBreakdown(Array.from(subMap.values()).sort((a, b) => b.minutes - a.minutes));
    });
  }, [expandedCat, activeProfileId, selectedDate, categories]);

  const handleCatClick = (catId: number) => {
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  return (
    <div className="flex flex-col py-2">
      {/* Compact donut — smaller on mobile, normal on desktop */}
      <div className="relative mx-auto w-[140px] h-[140px] md:w-[200px] md:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total_minutes"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={hasData ? 2 : 0}
              stroke="none"
              isAnimationActive={false}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} style={{ cursor: 'pointer' }} />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              offset={30}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm md:text-lg font-bold text-gray-800">
            {taskMinutes !== undefined && taskMinutes > 0
              ? `${(taskMinutes / 60).toFixed(1).replace(/\.0$/, '')}h`
              : trackedMinutes > 0 ? `${trackedHours}h` : '0h'}
          </span>
          {wallClockMinutes !== undefined && wallClockMinutes > 0 && (
            <span className="text-[10px] text-gray-400">
              {(wallClockMinutes / 60).toFixed(1).replace(/\.0$/, '')}h wall{multiplier && multiplier > 1 ? ` \u00b7 ${multiplier}x` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Legend with clickable categories */}
      <div className="mt-2 space-y-1 px-1">
        {trackedStats
          .filter((s) => s.total_minutes > 0)
          .map((s) => {
            const isExpanded = expandedCat === s.id;
            const catDef = categories.find(c => c.id === s.id);
            return (
              <div key={s.id}>
                <button
                  onClick={() => handleCatClick(s.id)}
                  className="w-full flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs font-medium text-gray-700 flex-1">{s.icon} {s.name}</span>
                  <span className="text-xs text-gray-500 font-semibold">{fmtHours(s.total_minutes)}</span>
                  <span className="text-xs text-gray-300 ml-1">
                    {Math.round(s.total_minutes / FULL_DAY * 100)}%
                  </span>
                  {catDef && catDef.subcategories.length > 0 && (
                    isExpanded
                      ? <ChevronUp size={12} className="text-gray-400" />
                      : <ChevronDown size={12} className="text-gray-400" />
                  )}
                </button>

                {/* Subcategory breakdown bar */}
                {isExpanded && subBreakdown.length > 0 && (
                  <div className="ml-5 mr-2 mb-2">
                    {/* Horizontal stacked bar */}
                    <div className="flex rounded-full overflow-hidden h-4 bg-gray-100 mb-1.5">
                      {subBreakdown.map((sub, i) => (
                        <div
                          key={i}
                          className="h-full flex items-center justify-center overflow-hidden"
                          style={{
                            width: `${(sub.minutes / s.total_minutes) * 100}%`,
                            backgroundColor: `${s.color}${i === 0 ? 'cc' : i === 1 ? '99' : i === 2 ? '77' : '55'}`,
                          }}
                          title={`${sub.name}: ${fmtHours(sub.minutes)}`}
                        >
                          {sub.minutes / s.total_minutes > 0.15 && (
                            <span className="text-[9px] font-medium text-white truncate px-1">{sub.name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Sub-labels */}
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                      {subBreakdown.map((sub, i) => (
                        <span key={i} className="text-[10px] text-gray-500">
                          {sub.icon} {sub.name} <span className="font-medium">{fmtHours(sub.minutes)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
