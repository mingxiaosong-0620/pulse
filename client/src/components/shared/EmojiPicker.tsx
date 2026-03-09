import { useState } from 'react';
import clsx from 'clsx';

// Flat list of common activity emojis — compact, single scrollable row
const EMOJIS = [
  '🎯', '💼', '🤝', '📧', '📋', '📚', '🗂️', '💻', '📊', '🔬', '📝', '🏗️',
  '💕', '👨‍👩‍👧', '👯', '🌐', '🏘️', '🤗', '💬', '🎉', '☕',
  '📖', '🔧', '🎓', '✍️', '💪', '🧠', '🎨', '🌟', '🏋️', '🧘', '🏃',
  '😴', '🍳', '🚿', '🚇', '🧹', '🏥', '🛒', '💊', '🏠',
  '🎮', '📱', '🎬', '🎵', '🏕️', '📸', '🎧', '🏖️', '⚽', '🎲',
  '📌', '⭐', '🔥', '💡', '🎁', '🌈', '🚀', '🐾', '🌸', '✨',
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  color?: string;
}

export default function EmojiPicker({ value, onChange, color }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-12 h-10 flex items-center justify-center text-lg rounded-xl border transition-all',
          isOpen
            ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100'
            : 'border-gray-200 bg-white hover:border-gray-300',
        )}
      >
        {value || '📌'}
      </button>

      {/* Picker — opens UPWARD, horizontal scroll */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-12 left-0 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-2 w-64">
            <div className="grid grid-cols-8 gap-0.5 max-h-32 overflow-y-auto">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onChange(emoji);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    'w-7 h-7 flex items-center justify-center rounded text-base transition-all hover:scale-125',
                    value === emoji ? 'bg-blue-50 ring-1 ring-blue-300' : 'hover:bg-gray-50',
                  )}
                  style={value === emoji && color ? { backgroundColor: `${color}20` } : undefined}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
