import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMediaDetails, MediaDetails } from "@/services/tmdbApi";
import MediaHero from "@/components/MediaHero";
import Navbar from "@/components/Navbar";

const MediaDetailsPage = () => {
  const { mediaType, id } = useParams<{ mediaType: "movie" | "tv"; id: string }>();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (!mediaType || !id) {
        setError("Invalid media type or ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const details = await fetchMediaDetails(parseInt(id), mediaType);
        setMedia(details);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load media details");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [mediaType, id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (error || !media) {
    return (
      <>
        <Navbar />
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground">{error || "Media not found"}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <MediaHero media={media} mediaType={mediaType as "movie" | "tv"} />
      
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-6">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.cast.map((person) => (
            <div key={person.id} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted mb-2">
                {person.profile_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    {person.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-medium text-sm">{person.name}</span>
              <span className="text-xs text-muted-foreground">{person.character}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MediaDetailsPage;
