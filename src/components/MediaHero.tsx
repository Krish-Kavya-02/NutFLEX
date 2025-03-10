
import { MediaDetails, getBackdropUrl, getPosterUrl } from "@/services/tmdbApi";
import { PlayCircle, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaHeroProps {
  media: MediaDetails;
  mediaType: "movie" | "tv";
}

const MediaHero = ({ media, mediaType }: MediaHeroProps) => {
  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "";
  
  const trailer = media.videos?.results?.find(
    (video) => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser")
  );
  
  const formatRuntime = (minutes?: number): string => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const runtime = media.runtime 
    ? formatRuntime(media.runtime)
    : media.episode_run_time && media.episode_run_time.length > 0
      ? formatRuntime(media.episode_run_time[0])
      : "";
  
  return (
    <div className="relative">
      {/* Backdrop Image */}
      <div className="absolute inset-0 z-[-1] h-[70vh]">
        <div className="relative h-full w-full">
          <img 
            src={getBackdropUrl(media.backdrop_path)}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40" />
        </div>
      </div>
      
      <div className="container pt-20 pb-10 min-h-[70vh] flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Poster */}
          <div className="hidden md:block">
            <img 
              src={getPosterUrl(media.poster_path)}
              alt={title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          {/* Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              {title} {releaseYear && <span className="text-muted-foreground">({releaseYear})</span>}
            </h1>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
              {releaseDate && (
                <span>{new Date(releaseDate).toLocaleDateString()}</span>
              )}
              {runtime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{runtime}</span>
                </div>
              )}
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-secondary" />
                <span>{media.vote_average.toFixed(1)}/10</span>
              </div>
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-4">
              {media.genres.map((genre) => (
                <span 
                  key={genre.id} 
                  className="bg-muted px-2 py-1 rounded-md text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            {/* Overview */}
            <p className="mt-6 text-muted-foreground">
              {media.overview}
            </p>
            
            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              {trailer && (
                <Button className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Watch Trailer
                </Button>
              )}
            </div>
            
            {/* Cast */}
            {media.cast && media.cast.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {media.cast.slice(0, 5).map((person) => (
                    <div key={person.id} className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted mb-2">
                        {person.profile_path ? (
                          <img 
                            src={getPosterUrl(person.profile_path, "w185")}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            {person.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">{person.name}</span>
                      <span className="text-xs text-muted-foreground">{person.character}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaHero;
