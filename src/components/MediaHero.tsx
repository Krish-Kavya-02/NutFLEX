
import { MediaDetails, getBackdropUrl, getPosterUrl } from "@/services/tmdbApi";
import { PlayCircle, Star, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

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

  const handleWatchTrailer = () => {
    if (trailer) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
      window.open(youtubeUrl, '_blank');
    } else {
      toast({
        variant: "destructive",
        title: "Trailer Not Available",
        description: "Sorry, no trailer is available for this content."
      });
    }
  };

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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {title} {releaseYear && <span className="text-muted-foreground">({releaseYear})</span>}
            </h1>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(releaseDate).toLocaleDateString()}</span>
                </div>
              )}
              {runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{runtime}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-secondary" />
                <span>{media.vote_average.toFixed(1)}/10</span>
              </div>
            </div>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {media.genres.map((genre) => (
                <span 
                  key={genre.id} 
                  className="bg-muted px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            {/* Overview */}
            <p className="text-lg text-muted-foreground mb-8">
              {media.overview}
            </p>
            
            {/* Actions */}
            {trailer && (
              <Button 
                className="w-fit" 
                size="lg" 
                onClick={handleWatchTrailer}
                variant="default"
              >
                <PlayCircle className="mr-2" />
                Watch Trailer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaHero;
