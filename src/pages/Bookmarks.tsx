
import { useState, useEffect } from "react";
import { getBookmarks, BookmarkItem } from "@/services/bookmarkService";
import { Link } from "react-router-dom";
import { getPosterUrl } from "@/services/tmdbApi";
import { Trash2 } from "lucide-react";
import { removeBookmark } from "@/services/bookmarkService";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (id: number, title: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
    
    toast({
      title: "Removed from Bookmarks",
      description: title,
      duration: 2000,
    });
  };
  
  return (
    <>
      <Navbar />
      <main>
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-6">Bookmarks</h1>
          
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <h3 className="text-xl font-medium text-muted-foreground mb-4">No bookmarks yet</h3>
              <p className="text-muted-foreground mb-6">
                Find your favorite movies and TV shows and save them for later
              </p>
              <div className="flex gap-4">
                <Link to="/movies" className="text-primary hover:underline">Browse Movies</Link>
                <Link to="/tv" className="text-primary hover:underline">Browse TV Shows</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {bookmarks.map((item) => (
                <div key={item.id} className="movie-card relative group rounded-md overflow-hidden">
                  <Link to={`/${item.mediaType}/${item.id}`}>
                    <div className="aspect-[2/3] bg-muted">
                      <img 
                        src={getPosterUrl(item.poster_path)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="movie-card-overlay" />
                    <div className="movie-card-info p-2">
                      <div className="flex items-center">
                        <span className="text-xs text-white/90 capitalize">{item.mediaType}</span>
                      </div>
                      <h3 className="font-semibold text-white text-sm mt-1 line-clamp-1">{item.title}</h3>
                    </div>
                  </Link>
                  <button 
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(item.id, item.title)}
                    aria-label="Remove from bookmarks"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Bookmarks;
