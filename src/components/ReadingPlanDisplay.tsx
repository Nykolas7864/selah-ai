import type { ReadingPlan, ReadingPlanProgress } from '@/types';
import { formatPlanAsText, copyToClipboard, downloadAsTextFile } from '@/lib/formatPrompt';
import { useState } from 'react';

interface ReadingPlanDisplayProps {
  plan: ReadingPlan;
  progress: ReadingPlanProgress;
  onToggleDay: (day: number) => void;
  onStartOver: () => void;
}

export default function ReadingPlanDisplay({
  plan,
  progress,
  onToggleDay,
  onStartOver,
}: ReadingPlanDisplayProps) {
  const [copied, setCopied] = useState(false);

  const completedCount = progress.completedDays.length;
  const percentage = Math.round((completedCount / plan.totalDays) * 100);

  const handleCopy = async () => {
    const text = formatPlanAsText(plan, progress);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const text = formatPlanAsText(plan, progress);
    const date = new Date().toISOString().slice(0, 10);
    downloadAsTextFile(text, `selah-reading-plan-${date}.txt`);
  };

  const createdDate = new Date(plan.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Plan header */}
      <div className="bg-white rounded-2xl border border-parchment-200 shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <h2 className="font-serif text-xl text-olive-900 leading-snug">{plan.title}</h2>
          <span className="inline-block px-2.5 py-0.5 bg-olive-100 text-olive-700 rounded-full text-xs font-sans font-medium whitespace-nowrap">
            {plan.timeline}
          </span>
        </div>
        <p className="font-sans text-sm text-olive-600 leading-relaxed mb-1">{plan.description}</p>
        <p className="font-sans text-xs text-olive-400">Created {createdDate}</p>

        {/* Progress bar */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs text-olive-500">{completedCount} of {plan.totalDays} days</span>
            <span className="font-sans text-sm text-olive-600 font-medium">{percentage}%</span>
          </div>
          <div className="h-3 rounded-full bg-parchment-200 overflow-hidden">
            <div
              className="h-full bg-olive-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily entries */}
      <div className="bg-white rounded-2xl border border-parchment-200 shadow-sm divide-y divide-parchment-100 overflow-hidden">
        {plan.entries.map((entry) => {
          const done = progress.completedDays.includes(entry.day);
          return (
            <div
              key={entry.day}
              className={`flex items-start gap-3 px-5 py-3.5 transition-colors ${done ? 'bg-olive-50' : ''}`}
            >
              <input
                type="checkbox"
                checked={done}
                onChange={() => onToggleDay(entry.day)}
                className="mt-0.5 w-4 h-4 flex-shrink-0 accent-olive-600 cursor-pointer"
              />
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-parchment-200 text-olive-700 text-xs font-sans font-medium flex-shrink-0">
                {entry.day}
              </div>
              <div className="min-w-0">
                <p className={`font-sans text-sm font-medium text-olive-800 ${done ? 'line-through text-olive-400' : ''}`}>
                  {entry.book} {entry.chapters}
                </p>
                <p className="font-sans text-xs text-olive-500 leading-relaxed mt-0.5">
                  {entry.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-parchment-100 text-olive-600 text-sm font-sans hover:bg-parchment-200 transition-colors"
        >
          <span>📋</span>
          <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-parchment-100 text-olive-600 text-sm font-sans hover:bg-parchment-200 transition-colors"
        >
          <span>⬇</span>
          <span>Download</span>
        </button>
        <button
          onClick={onStartOver}
          className="ml-auto text-sm font-sans text-wine-600 hover:text-wine-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
