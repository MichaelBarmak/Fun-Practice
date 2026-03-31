'use client';

import katex from 'katex';

/**
 * Renders text that may contain LaTeX math delimiters and **bold** markers:
 *   $$...$$ → display (block) math
 *   $...$   → inline math
 *   **...**  → bold (may contain math inside)
 *
 * Bold is parsed first so that **From $S_0$:** correctly bolds the whole phrase.
 */
export default function MathText({ text, className = '' }) {
  if (!text) return null;

  const segments = parseSegments(text);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return seg.value.split('\n').map((line, j, arr) => (
            <span key={`${i}-${j}`}>
              {seg.bold ? <strong>{line}</strong> : line}
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
          const mathEl = (
            <span
              className={seg.type === 'display' ? 'block my-2 overflow-x-auto' : 'inline'}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
          return seg.bold
            ? <strong key={i} className="inline">{mathEl}</strong>
            : <span key={i}>{mathEl}</span>;
        } catch {
          return <span key={i}>{seg.raw}</span>;
        }
      })}
    </span>
  );
}

/**
 * Parse text into segments, handling **bold** markers first (which may contain math),
 * then splitting math within each bold/non-bold region.
 */
function parseSegments(text) {
  const segments = [];
  const boldRe = /\*\*([\s\S]*?)\*\*/g;
  let last = 0;
  let match;

  while ((match = boldRe.exec(text)) !== null) {
    if (match.index > last) {
      segments.push(...parseMath(text.slice(last, match.index), false));
    }
    segments.push(...parseMath(match[1], true));
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    segments.push(...parseMath(text.slice(last), false));
  }

  return segments;
}

/**
 * Split a (possibly bold) text string into math and plain-text segments.
 */
function parseMath(text, bold) {
  const segments = [];
  const re = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
  let last = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', value: text.slice(last, match.index), bold });
    }
    const raw = match[0];
    const isDisplay = raw.startsWith('$$');
    const inner = isDisplay ? raw.slice(2, -2) : raw.slice(1, -1);
    segments.push({ type: isDisplay ? 'display' : 'inline', value: inner, raw, bold });
    last = match.index + raw.length;
  }

  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last), bold });
  }

  return segments;
}
