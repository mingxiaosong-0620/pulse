import clsx from 'clsx';
import { useAppStore } from '../../stores/appStore';

interface ProfileToggleProps {
  value: number | 'combined';
  onSelect: (value: number | 'combined') => void;
}

export default function ProfileToggle({ value, onSelect }: ProfileToggleProps) {
  const { profiles } = useAppStore();

  const options: { key: number | 'combined'; label: string; avatar: string }[] = [
    ...profiles.map((p) => ({ key: p.id as number | 'combined', label: p.name, avatar: p.avatar })),
    { key: 'combined', label: 'Both', avatar: '👥' },
  ];

  return (
    <div className="px-4 pb-2">
      <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
        {options.map((opt) => (
          <button
            key={String(opt.key)}
            onClick={() => onSelect(opt.key)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all',
              value === opt.key
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <span className="text-sm">{opt.avatar}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
