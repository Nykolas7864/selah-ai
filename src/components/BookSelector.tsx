import { BIBLE_BOOKS } from '@/data/books';

interface BookSelectorProps {
  value: string; // "Any" or a book name
  onChange: (value: string) => void;
}

/**
 * Dropdown to select a Bible book, with "Any Book" as default.
 * Groups books by testament for easier scanning.
 */
export default function BookSelector({ value, onChange }: BookSelectorProps) {
  const otBooks = BIBLE_BOOKS.filter((b) => b.testament === 'OT');
  const ntBooks = BIBLE_BOOKS.filter((b) => b.testament === 'NT');

  return (
    <div className="space-y-1">
      <label
        htmlFor="book-select"
        className="block text-sm font-sans font-medium text-olive-700"
      >
        Book
      </label>
      <select
        id="book-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-4 py-2.5 rounded-xl border border-parchment-300
          bg-white text-olive-800 font-sans text-sm
          focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400
          transition-colors
        "
      >
        <option value="Any">Any Book</option>
        <optgroup label="Old Testament">
          {otBooks.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="New Testament">
          {ntBooks.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
