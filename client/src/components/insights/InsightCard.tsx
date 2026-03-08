import { format, parseISO } from 'date-fns';

interface InsightCardProps {
  insight: string;
  generatedAt: string;
}

function parseMarkdown(text: string) {
  // Split on ## headers, keeping the header text
  const sections: { title?: string; body: string }[] = [];
  const parts = text.split(/^## /m);

  parts.forEach((part, i) => {
    if (i === 0 && part.trim()) {
      // Text before the first ## header
      sections.push({ body: part.trim() });
    } else if (i > 0) {
      const newlineIdx = part.indexOf('\n');
      if (newlineIdx === -1) {
        sections.push({ title: part.trim(), body: '' });
      } else {
        sections.push({
          title: part.slice(0, newlineIdx).trim(),
          body: part.slice(newlineIdx + 1).trim(),
        });
      }
    }
  });

  return sections;
}

function renderBody(body: string) {
  if (!body) return null;

  const paragraphs = body.split(/\n\n+/);

  return paragraphs.map((p, i) => {
    const trimmed = p.trim();
    if (!trimmed) return null;

    // Check if it's a list (lines starting with - or *)
    const lines = trimmed.split('\n');
    const isList = lines.every((l) => /^[\-\*•]\s/.test(l.trim()));

    if (isList) {
      return (
        <ul key={i} className="space-y-1 my-2">
          {lines.map((line, j) => (
            <li key={j} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="text-blue-400 mt-0.5 shrink-0">•</span>
              <span>{renderInline(line.replace(/^[\-\*•]\s*/, ''))}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i} className="text-sm text-gray-700 leading-relaxed my-2">
        {renderInline(trimmed)}
      </p>
    );
  });
}

function renderInline(text: string) {
  // Handle **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
}

export default function InsightCard({ insight, generatedAt }: InsightCardProps) {
  const sections = parseMarkdown(insight);

  let formattedTime: string;
  try {
    formattedTime = format(parseISO(generatedAt), 'MMM d, yyyy h:mm a');
  } catch {
    formattedTime = generatedAt;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Gradient left border */}
      <div className="flex">
        <div className="w-1 shrink-0 bg-gradient-to-b from-blue-500 to-purple-500" />
        <div className="flex-1 p-5">
          {sections.map((section, i) => (
            <div key={i} className={i > 0 ? 'mt-4' : ''}>
              {section.title && (
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {section.title}
                </h3>
              )}
              {renderBody(section.body)}
            </div>
          ))}

          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
            Generated {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
}
