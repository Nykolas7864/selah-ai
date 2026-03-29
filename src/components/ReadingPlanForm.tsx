import { useState } from 'react';
import type { ReadingPlan } from '@/types';
import { PLAN_TIMELINES } from '@/types';
import PlanTopicSelector from './PlanTopicSelector';
import { generateReadingPlan } from '@/lib/api';

interface ReadingPlanFormProps {
  onPlanGenerated: (plan: ReadingPlan) => void;
}

export default function ReadingPlanForm({ onPlanGenerated }: ReadingPlanFormProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState('');
  const [timeline, setTimeline] = useState<string>('2 weeks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopics.length === 0 && !customDescription.trim()) {
      setError('Please select at least one topic or describe your focus.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const plan = await generateReadingPlan({
        topics: selectedTopics,
        customDescription: customDescription.trim() || undefined,
        timeline,
      });
      onPlanGenerated(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl text-olive-800 mb-1">Create Your Reading Plan</h2>
        <p className="font-sans text-sm text-olive-500">
          Choose topics, describe your interests, and pick a timeline.
        </p>
      </div>

      {/* Topic selector */}
      <div className="space-y-2">
        <label className="block font-sans text-sm font-medium text-olive-700">
          Topics
        </label>
        <PlanTopicSelector selected={selectedTopics} onChange={setSelectedTopics} />
      </div>

      {/* Custom description */}
      <div className="space-y-2">
        <label className="block font-sans text-sm font-medium text-olive-700">
          Describe your focus <span className="text-olive-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
          placeholder="I want to learn about all the miracles Jesus performed and understand the context behind each one..."
          rows={3}
          className="
            w-full rounded-xl border border-parchment-300 bg-parchment-50
            px-4 py-3 text-sm font-sans text-olive-800
            placeholder:text-olive-300
            focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400
            resize-none transition-colors
          "
        />
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <label className="block font-sans text-sm font-medium text-olive-700">
          Timeline
        </label>
        <select
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="
            w-full rounded-xl border border-parchment-300 bg-parchment-50
            px-4 py-3 text-sm font-sans text-olive-800
            focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400
            transition-colors
          "
        >
          {PLAN_TIMELINES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <p className="font-sans text-sm text-wine-600">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-3 px-6 rounded-xl
          bg-olive-700 text-white font-sans font-medium text-sm
          hover:bg-olive-800 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? 'Generating your plan…' : 'Generate My Plan'}
      </button>
    </form>
  );
}
