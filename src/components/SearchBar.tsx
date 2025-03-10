
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Input
        type="search"
        placeholder="Search for movies or TV shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 bg-muted text-foreground"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </form>
  );
};

export default SearchBar;
