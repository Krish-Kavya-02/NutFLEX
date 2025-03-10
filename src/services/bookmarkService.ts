
import { Movie, TVShow } from "./tmdbApi";

export type BookmarkItem = {
  id: number;
  title: string;
  poster_path: string;
  mediaType: "movie" | "tv";
  added_at: number;
};

const BOOKMARK_KEY = "nutFLEX_bookmarks";

export const getBookmarks = (): BookmarkItem[] => {
  const bookmarks = localStorage.getItem(BOOKMARK_KEY);
  return bookmarks ? JSON.parse(bookmarks) : [];
};

export const addBookmark = (item: Movie | TVShow, mediaType: "movie" | "tv"): void => {
  const bookmarks = getBookmarks();
  
  // Check if the item already exists in bookmarks
  if (bookmarks.some(bookmark => bookmark.id === item.id)) {
    return;
  }
  
  const newBookmark: BookmarkItem = {
    id: item.id,
    title: "title" in item ? item.title : item.name,
    poster_path: item.poster_path,
    mediaType,
    added_at: Date.now(),
  };
  
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify([newBookmark, ...bookmarks]));
};

export const removeBookmark = (id: number): void => {
  const bookmarks = getBookmarks();
  const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updatedBookmarks));
};

export const isBookmarked = (id: number): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some(bookmark => bookmark.id === id);
};

export const toggleBookmark = (item: Movie | TVShow, mediaType: "movie" | "tv"): boolean => {
  const isAlreadyBookmarked = isBookmarked(item.id);
  
  if (isAlreadyBookmarked) {
    removeBookmark(item.id);
    return false;
  } else {
    addBookmark(item, mediaType);
    return true;
  }
};
