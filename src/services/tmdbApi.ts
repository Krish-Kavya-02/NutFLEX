
const API_KEY = "67fc5461bcc5c46713dbb52d5d86d365"; // Public TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MediaDetails {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

export const getPosterUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: string = "original"): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const fetchTrending = async (mediaType: "movie" | "tv" = "movie", timeWindow: "day" | "week" = "week"): Promise<Movie[] | TVShow[]> => {
  try {
    const response = await fetch(`${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching trending:", error);
    return [];
  }
};

export const fetchGenres = async (mediaType: "movie" | "tv" = "movie"): Promise<Genre[]> => {
  try {
    const response = await fetch(`${BASE_URL}/genre/${mediaType}/list?api_key=${API_KEY}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const fetchByGenre = async (genreId: number, mediaType: "movie" | "tv" = "movie", page: number = 1): Promise<Movie[] | TVShow[]> => {
  try {
    const response = await fetch(`${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching by genre:", error);
    return [];
  }
};

export const searchMedia = async (query: string, mediaType: "movie" | "tv" = "movie"): Promise<Movie[] | TVShow[]> => {
  if (!query) return [];
  try {
    const response = await fetch(`${BASE_URL}/search/${mediaType}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
};

export const fetchMediaDetails = async (id: number, mediaType: "movie" | "tv" = "movie"): Promise<MediaDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=videos,credits`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    
    // Format the data to include cast and standardize the response
    return {
      ...data,
      cast: data.credits?.cast?.slice(0, 10) || [],
    };
  } catch (error) {
    console.error("Error fetching media details:", error);
    return null;
  }
};

export const fetchTopRated = async (mediaType: "movie" | "tv" = "movie"): Promise<Movie[] | TVShow[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${mediaType}/top_rated?api_key=${API_KEY}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching top rated:", error);
    return [];
  }
};

export const fetchUpcoming = async (mediaType: "movie" | "tv" = "movie"): Promise<Movie[] | TVShow[]> => {
  try {
    const url = mediaType === "movie" 
      ? `${BASE_URL}/movie/upcoming?api_key=${API_KEY}` 
      : `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`;
    
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching upcoming content:", error);
    return [];
  }
};
