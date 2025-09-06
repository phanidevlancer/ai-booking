export interface Movie {
  title: string;
  poster: string;
  genre: string;
  year: string;
}

export const MOVIES: Movie[] = [
  {
    title: "Deadpool & Wolverine",
    poster: "https://m.media-amazon.com/images/M/MV5BNzRiMjg0MzUtNTQ1Mi00Y2Q5LWEwM2MtMzUwZDU5NmVjN2NkXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
    genre: "Action, Comedy",
    year: "2024"
  },
  {
    title: "Inside Out 2",
    poster: "https://m.media-amazon.com/images/M/MV5BYjQ3NjM4MjgtODNkNi00N2M4LWJhMzAtNzMwZmM4MTY4MWE3XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
    genre: "Animation, Family",
    year: "2024"
  },
  {
    title: "Pushpa 2",
    poster: "https://m.media-amazon.com/images/M/MV5BMjFmNDkxZWQtYzE2MS00MjJjLWJiNDktOWU4N2ZhN2YxZDk1XkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_FMjpg_UX1000_.jpg",
    genre: "Action, Drama",
    year: "2024"
  },
  {
    title: "Kalki 2898 AD",
    poster: "https://m.media-amazon.com/images/M/MV5BM2QzM2JiNTMtYzAyZC00MzM5LTk5Y2UtYTMwMGNkZGY0ZWE1XkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_FMjpg_UX1000_.jpg",
    genre: "Sci-Fi, Action",
    year: "2024"
  }
];
