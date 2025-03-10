
import { useState, useEffect } from "react";
import { fetchGenres, Genre } from "@/services/tmdbApi";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GenreSelectorProps {
  mediaType: "movie" | "tv";
  onSelectGenre: (genreId: number | null) => void;
  selectedGenreId: number | null;
}

const GenreSelector = ({ mediaType, onSelectGenre, selectedGenreId }: GenreSelectorProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      setLoading(true);
      const data = await fetchGenres(mediaType);
      setGenres(data);
      setLoading(false);
    };

    loadGenres();
  }, [mediaType]);

  if (loading) {
    return (
      <div className="flex gap-2 pb-4 overflow-x-auto">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="h-9 w-20 rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4">
      <div className="flex gap-2 pb-2">
        <Button
          variant={selectedGenreId === null ? "secondary" : "outline"}
          size="sm"
          onClick={() => onSelectGenre(null)}
          className="rounded-full"
        >
          All
        </Button>
        
        {genres.map((genre) => (
          <Button
            key={genre.id}
            variant={selectedGenreId === genre.id ? "secondary" : "outline"}
            size="sm"
            onClick={() => onSelectGenre(genre.id)}
            className="rounded-full"
          >
            {genre.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default GenreSelector;
