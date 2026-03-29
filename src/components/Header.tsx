import type { AppView } from '@/types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const NAV_ITEMS: { label: string; view: AppView }[] = [
  { label: 'Daily', view: 'home' },
  { label: 'Explore', view: 'explore' },
  { label: 'Glossary', view: 'glossary' },
  { label: 'Plans', view: 'reading-plan' },
];

export default function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="w-full border-b border-parchment-300 bg-parchment-50/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* App title */}
        <h1
          className="font-serif text-2xl font-bold text-olive-800 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          Selah<span className="text-gold-600">-AI</span>
        </h1>

        {/* Navigation */}
        <nav className="flex gap-1 bg-parchment-200 rounded-full p-1 overflow-x-auto">
          {NAV_ITEMS.map(({ label, view }) => (
            <button
              key={view}
              aria-label={`Navigate to ${label}`}
              onClick={() => onNavigate(view)}
              className={`px-3 py-1.5 rounded-full text-sm font-sans font-medium transition-colors whitespace-nowrap ${
                currentView === view
                  ? 'bg-white text-olive-800 shadow-sm'
                  : 'text-olive-600 hover:text-olive-800'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
