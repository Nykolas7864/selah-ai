/**
 * Loading indicator styled to match the devotional theme.
 * Shows a gentle pulsing animation while prompts are being generated.
 */
export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      {/* Animated dots */}
      <div className="flex gap-2">
        <span className="w-2.5 h-2.5 bg-gold-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2.5 h-2.5 bg-gold-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2.5 h-2.5 bg-gold-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <p className="font-serif text-olive-500 italic text-sm">
        Preparing your study prompts...
      </p>
    </div>
  );
}
