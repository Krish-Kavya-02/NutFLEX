
import { Movie, TVShow, getPosterUrl } from "@/services/tmdbApi";
import { BookmarkIcon } from "lucide-react";
import { isBookmarked, toggleBookmark } from "@/services/bookmarkService";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface MovieCardProps {
  item: Movie | TVShow;
  mediaType: "movie" | "tv";
}

const MovieCard = ({ item, mediaType }: MovieCardProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked(item.id));
  const { toast } = useToast();
  
  const title = "title" in item ? item.title : item.name;
  const releaseDate = "release_date" in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isNowBookmarked = toggleBookmark(item, mediaType);
    setBookmarked(isNowBookmarked);
    
    toast({
      title: isNowBookmarked ? "Added to Bookmarks" : "Removed from Bookmarks",
      description: title,
      duration: 2000,
    });
  };
  
  return (
    <Link to={`/${mediaType}/${item.id}`} className="movie-card block">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-muted">
        <img 
          src={getPosterUrl(item.poster_path)}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="movie-card-overlay" />
        <button 
          className={`absolute top-2 right-2 p-1 rounded-full bg-black/70 z-10 
            ${bookmarked ? 'text-secondary' : 'text-white'}`}
          onClick={handleBookmark}
          aria-label={bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <BookmarkIcon size={20} fill={bookmarked ? "currentColor" : "none"} />
        </button>
        <div className="movie-card-info">
          <div className="flex items-center">
            <span className="text-sm text-white/90">{year}</span>
            <span className="mx-1">•</span>
            <span className="text-sm text-white/90 capitalize">{mediaType}</span>
            <div className="ml-auto flex items-center space-x-1 text-secondary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1L10.1645 5.41455L15 6.08885L11.5 9.48855L12.309 14.3111L8 12.0421L3.691 14.3111L4.5 9.48855L1 6.08885L5.8355 5.41455L8 1Z" fill="currentColor" />
              </svg>
              <span className="text-sm font-medium">{item.vote_average.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="font-semibold text-white mt-1 line-clamp-1">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
