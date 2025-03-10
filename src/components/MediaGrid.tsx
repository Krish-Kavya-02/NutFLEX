
import { Movie, TVShow } from "@/services/tmdbApi";
import MovieCard from "./MovieCard";

interface MediaGridProps {
  items: (Movie | TVShow)[];
  mediaType: "movie" | "tv";
  className?: string;
}

const MediaGrid = ({ items, mediaType, className = "" }: MediaGridProps) => {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-xl font-medium text-muted-foreground">No results found</h3>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}>
      {items.map((item) => (
        <MovieCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
};

export default MediaGrid;
