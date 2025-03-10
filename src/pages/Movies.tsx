
import { useState, useEffect } from "react";
import { fetchTrending, fetchByGenre, Movie } from "@/services/tmdbApi";
import MediaGrid from "@/components/MediaGrid";
import GenreSelector from "@/components/GenreSelector";
import SearchBar from "@/components/SearchBar";
import { searchMedia } from "@/services/tmdbApi";
import Navbar from "@/components/Navbar";

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      let results;
      
      if (searchQuery) {
        results = await searchMedia(searchQuery, "movie");
      } else if (selectedGenreId) {
        results = await fetchByGenre(selectedGenreId, "movie");
      } else {
        results = await fetchTrending("movie");
      }
      
      setMovies(results as Movie[]);
      setLoading(false);
    };

    loadMovies();
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
            <h1 className="text-4xl font-bold mb-6">Movies</h1>
            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          <GenreSelector 
            mediaType="movie" 
            onSelectGenre={handleGenreSelect}
            selectedGenreId={selectedGenreId}
          />

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedGenreId
                ? "Genre Results"
                : "Trending Movies"}
            </h2>
            
            {loading ? (
              <div className="flex justify-center my-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <MediaGrid items={movies} mediaType="movie" />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Movies;
