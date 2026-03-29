import { useState, useEffect, useRef } from 'react';
import type { GlossaryEntry } from '@/types';
import { GLOSSARY_ENTRIES } from '@/data/glossary';
import GlossaryCard from './GlossaryCard';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GlossaryPage() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputValue]);

  const handleNameClick = (name: string) => {
    setInputValue(name);
    setSearchQuery(name);
    setActiveLetter(null);
  };

  const filteredEntries: GlossaryEntry[] = GLOSSARY_ENTRIES.filter((entry) => {
    const matchesLetter = !activeLetter || entry.name.toUpperCase().startsWith(activeLetter);
    if (!searchQuery) return matchesLetter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      entry.name.toLowerCase().includes(q) ||
      entry.alternateNames.some((alt) => alt.toLowerCase().includes(q)) ||
      entry.summary.toLowerCase().includes(q);
    return matchesSearch && matchesLetter;
  });

  // Group by first letter when no filters active
  const showGrouped = !searchQuery && !activeLetter;

  const groupedEntries = showGrouped
    ? ALPHABET.reduce<Record<string, GlossaryEntry[]>>((acc, letter) => {
        const group = filteredEntries.filter((e) =>
          e.name.toUpperCase().startsWith(letter)
        );
        if (group.length > 0) acc[letter] = group;
        return acc;
      }, {})
    : {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl text-olive-800 mb-2">
          Biblical Figures
        </h2>
        <p className="font-sans text-sm text-olive-500 mb-6">
          Explore the people of Scripture — their names, stories, and significance.
        </p>

        {/* Search */}
        <div role="search">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name or keyword..."
            className="
              w-full rounded-xl border border-parchment-300 bg-parchment-50
              px-4 py-3 text-sm font-sans text-olive-800
              placeholder:text-olive-300
              focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400
              transition-colors
            "
          />
        </div>

        {/* A-Z letter bar */}
        <div className="flex flex-wrap gap-1 my-4 overflow-x-auto">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
              className={`
                w-8 h-8 rounded-full text-xs font-sans font-medium
                flex items-center justify-center transition-colors flex-shrink-0
                ${activeLetter === letter
                  ? 'bg-olive-600 text-white'
                  : 'bg-parchment-100 text-olive-600 hover:bg-parchment-200'
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredEntries.length === 0 ? (
        <p className="font-sans text-sm italic text-olive-500">
          No figures found matching &ldquo;{searchQuery || activeLetter}&rdquo;
        </p>
      ) : showGrouped ? (
        <div>
          {Object.entries(groupedEntries).map(([letter, entries]) => (
            <div key={letter}>
              <h3 className="font-serif text-lg text-olive-700 border-b border-parchment-200 pb-1 mb-3 mt-6">
                {letter}
              </h3>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <GlossaryCard
                    key={entry.name}
                    entry={entry}
                    onNameClick={handleNameClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <GlossaryCard
              key={entry.name}
              entry={entry}
              onNameClick={handleNameClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
