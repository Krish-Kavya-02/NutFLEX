
import { Movie, TVShow } from "@/services/tmdbApi";
import MovieCard from "./MovieCard";
import { AlertTriangle } from "lucide-react";

interface MediaGridProps {
  items: (Movie | TVShow)[];
  mediaType: "movie" | "tv";
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

const MediaGrid = ({ items, mediaType, className = "", isLoading = false, error = null }: MediaGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="aspect-[2/3] bg-muted rounded-md animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-xl font-medium text-destructive">Error loading content</h3>
        <p className="text-muted-foreground mt-2">{error}</p>
        <p className="text-sm text-muted-foreground mt-4">
          Please check your internet connection or try again later.
        </p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h3 className="text-xl font-medium text-muted-foreground">No results found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or filters
        </p>
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
