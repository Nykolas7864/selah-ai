import { useState, useEffect } from 'react';
import type { ReadingPlan, ReadingPlanProgress } from '@/types';
import ReadingPlanForm from './ReadingPlanForm';
import ReadingPlanDisplay from './ReadingPlanDisplay';

const STORAGE_KEY_PLAN = 'selah-reading-plan';
const STORAGE_KEY_PROGRESS = 'selah-reading-plan-progress';

export default function ReadingPlanPage() {
  const [plan, setPlan] = useState<ReadingPlan | null>(null);
  const [progress, setProgress] = useState<ReadingPlanProgress>({ completedDays: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(STORAGE_KEY_PLAN);
      const savedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (savedPlan) setPlan(JSON.parse(savedPlan) as ReadingPlan);
      if (savedProgress) setProgress(JSON.parse(savedProgress) as ReadingPlanProgress);
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handlePlanGenerated = (newPlan: ReadingPlan) => {
    const newProgress: ReadingPlanProgress = { completedDays: [] };
    setPlan(newPlan);
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(newPlan));
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(newProgress));
  };

  const handleToggleDay = (day: number) => {
    setProgress((prev) => {
      const completedDays = prev.completedDays.includes(day)
        ? prev.completedDays.filter((d) => d !== day)
        : [...prev.completedDays, day];
      const next = { completedDays };
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(next));
      return next;
    });
  };

  const handleStartOver = () => {
    if (!window.confirm('This will replace your current reading plan. Are you sure?')) return;
    setPlan(null);
    setProgress({ completedDays: [] });
    localStorage.removeItem(STORAGE_KEY_PLAN);
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
  };

  return (
    <div className="space-y-6">
      {plan ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-olive-800">Your Reading Plan</h2>
            <button
              onClick={handleStartOver}
              className="font-sans text-sm text-olive-400 hover:text-olive-600 underline underline-offset-4 transition-colors"
            >
              Create New Plan
            </button>
          </div>
          <ReadingPlanDisplay
            plan={plan}
            progress={progress}
            onToggleDay={handleToggleDay}
            onStartOver={handleStartOver}
          />
        </>
      ) : (
        <ReadingPlanForm onPlanGenerated={handlePlanGenerated} />
      )}
    </div>
  );
}
