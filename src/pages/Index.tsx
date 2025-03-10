
import { useState, useEffect } from "react";
import { fetchTrending, Movie, TVShow } from "@/services/tmdbApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaGrid from "@/components/MediaGrid";
import SearchBar from "@/components/SearchBar";
import { searchMedia } from "@/services/tmdbApi";
import Navbar from "@/components/Navbar";

const Index = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[] | TVShow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      setLoading(true);
      const movies = await fetchTrending("movie");
      const tvShows = await fetchTrending("tv");
      setTrendingMovies(movies as Movie[]);
      setTrendingTVShows(tvShows as TVShow[]);
      setLoading(false);
    };

    loadTrending();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query) {
      setLoading(true);
      const results = await searchMedia(query, searchType);
      setSearchResults(results);
      setLoading(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleTabChange = (value: string) => {
    setSearchType(value as "movie" | "tv");
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-6">Discover</h1>
            <SearchBar onSearch={handleSearch} />
          </div>

          {searchQuery ? (
            <div className="mt-8">
              <Tabs defaultValue="movie" onValueChange={handleTabChange}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Search Results for "{searchQuery}"</h2>
                  <TabsList>
                    <TabsTrigger value="movie">Movies</TabsTrigger>
                    <TabsTrigger value="tv">TV Shows</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="movie" className="mt-0">
                  {loading ? (
                    <div className="flex justify-center my-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <MediaGrid items={searchResults} mediaType="movie" />
                  )}
                </TabsContent>
                <TabsContent value="tv" className="mt-0">
                  {loading ? (
                    <div className="flex justify-center my-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <MediaGrid items={searchResults} mediaType="tv" />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <>
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-6">Trending Movies</h2>
                {loading ? (
                  <div className="flex justify-center my-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <MediaGrid items={trendingMovies} mediaType="movie" />
                )}
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-6">Trending TV Shows</h2>
                {loading ? (
                  <div className="flex justify-center my-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <MediaGrid items={trendingTVShows} mediaType="tv" />
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Index;
