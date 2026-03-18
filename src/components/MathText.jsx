'use client';

import katex from 'katex';

/**
 * Renders text that may contain LaTeX math delimiters:
 *   $$...$$ → display (block) math
 *   $...$   → inline math
 *
 * Plain text segments are rendered as-is, preserving whitespace/newlines.
 */
export default function MathText({ text, className = '' }) {
  if (!text) return null;

  const segments = parseSegments(text);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          // Preserve newlines as line breaks, and render **bold**
          return seg.value.split('\n').map((line, j, arr) => (
            <span key={`${i}-${j}`}>
              {renderBold(line)}
              {j < arr.length - 1 && <br />}
            </span>
          ));
        }

        try {
          const html = katex.renderToString(seg.value, {
            displayMode: seg.type === 'display',
            throwOnError: false,
            strict: false,
          });
          return (
            <span
              key={i}
              className={seg.type === 'display' ? 'block my-2 overflow-x-auto' : 'inline'}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={i}>{seg.raw}</span>;
        }
      })}
    </span>
  );
}

/**
 * Render a plain-text line, converting **bold** markers to <strong> elements.
 */
function renderBold(line) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/**
 * Split raw text into segments:
 *   { type: 'text',    value: '...' }
 *   { type: 'display', value: '...', raw: '$$...$$' }
 *   { type: 'inline',  value: '...', raw: '$...$' }
 */
function parseSegments(text) {
  const segments = [];
  // Regex: match $$...$$ first, then $...$
  const re = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
  let last = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', value: text.slice(last, match.index) });
    }
    const raw = match[0];
    const isDisplay = raw.startsWith('$$');
    const inner = isDisplay ? raw.slice(2, -2) : raw.slice(1, -1);
    segments.push({ type: isDisplay ? 'display' : 'inline', value: inner, raw });
    last = match.index + raw.length;
  }

  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last) });
  }

  return segments;
}
