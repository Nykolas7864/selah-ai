import type { AppView } from '@/types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

/**
 * Minimal header with app name and nav toggle between Home and Explore.
 * Design: warm serif title, understated navigation.
 */
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

        {/* Navigation toggle */}
        <nav className="flex gap-1 bg-parchment-200 rounded-full p-1">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-colors ${
              currentView === 'home'
                ? 'bg-white text-olive-800 shadow-sm'
                : 'text-olive-600 hover:text-olive-800'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-colors ${
              currentView === 'explore'
                ? 'bg-white text-olive-800 shadow-sm'
                : 'text-olive-600 hover:text-olive-800'
            }`}
          >
            Explore
          </button>
        </nav>
      </div>
    </header>
  );
}
