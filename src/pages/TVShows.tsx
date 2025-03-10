
import { useState, useEffect } from "react";
import { fetchTrending, fetchByGenre, TVShow } from "@/services/tmdbApi";
import MediaGrid from "@/components/MediaGrid";
import GenreSelector from "@/components/GenreSelector";
import SearchBar from "@/components/SearchBar";
import { searchMedia } from "@/services/tmdbApi";
import Navbar from "@/components/Navbar";

const TVShows = () => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadTVShows = async () => {
      setLoading(true);
      let results;
      
      if (searchQuery) {
        results = await searchMedia(searchQuery, "tv");
      } else if (selectedGenreId) {
        results = await fetchByGenre(selectedGenreId, "tv");
      } else {
        results = await fetchTrending("tv");
      }
      
      setTVShows(results as TVShow[]);
      setLoading(false);
    };

    loadTVShows();
  }, [selectedGenreId, searchQuery]);

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenreId(genreId);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSelectedGenreId(null);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-6">TV Shows</h1>
            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          <GenreSelector 
            mediaType="tv" 
            onSelectGenre={handleGenreSelect}
            selectedGenreId={selectedGenreId}
          />

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedGenreId
                ? "Genre Results"
                : "Trending TV Shows"}
            </h2>
            
            {loading ? (
              <div className="flex justify-center my-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <MediaGrid items={tvShows} mediaType="tv" />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default TVShows;
