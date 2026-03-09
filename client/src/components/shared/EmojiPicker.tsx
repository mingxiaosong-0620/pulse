import { useState } from 'react';
import clsx from 'clsx';

// Common activity emojis organized by theme
const EMOJI_GROUPS = [
  { label: 'Work', emojis: ['🎯', '💼', '🤝', '📧', '📋', '📚', '🗂️', '💻', '📊', '🔬', '📝', '🏗️'] },
  { label: 'People', emojis: ['💕', '👨‍👩‍👧', '👯', '🌐', '🏘️', '🤗', '👋', '💬', '🎉', '🍻', '☕', '🫂'] },
  { label: 'Growth', emojis: ['📖', '🔧', '🎓', '✍️', '💪', '🧠', '🎨', '📐', '🌟', '🏋️', '🧘', '🏃'] },
  { label: 'Life', emojis: ['😴', '🍳', '🚿', '🚇', '🧹', '🏥', '🛒', '👔', '💊', '🦷', '🏠', '🧺'] },
  { label: 'Fun', emojis: ['🎮', '📱', '🎬', '🎵', '🏕️', '🎨', '📸', '🎧', '🏖️', '⚽', '🎲', '🎤'] },
  { label: 'Other', emojis: ['📌', '⭐', '🔥', '❓', '💡', '🎁', '🌈', '🚀', '🐾', '🌸', '🍀', '✨'] },
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

      {/* Dropdown picker */}
      {isOpen && (
        <>
          {/* Backdrop to close */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute top-12 left-0 z-50 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2 max-h-56 overflow-y-auto">
            {EMOJI_GROUPS.map((group) => (
              <div key={group.label} className="mb-1.5">
                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider px-1 mb-0.5">
                  {group.label}
                </p>
                <div className="grid grid-cols-6 gap-0.5">
                  {group.emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onChange(emoji);
                        setIsOpen(false);
                      }}
                      className={clsx(
                        'w-9 h-9 flex items-center justify-center rounded-lg text-lg transition-all hover:scale-110',
                        value === emoji
                          ? 'bg-blue-50 ring-1 ring-blue-300'
                          : 'hover:bg-gray-50',
                      )}
                      style={value === emoji && color ? { backgroundColor: `${color}18` } : undefined}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
