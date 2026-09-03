import { Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (term: string) => void;
  loading: boolean;
}

export default function SearchBar({
  value,
  onChange,
  loading,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search songs, artists and albums"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border-0 bg-transparent pr-0 text-[13px] text-text outline-none ${loading ? 'pr-5.5' : ''}`}
      />
      {loading && (
        <div className="spin absolute right-0 top-1/2 flex -translate-y-1/2 text-text-search">
          <Loader2 size={16} />
        </div>
      )}
    </div>
  );
}

