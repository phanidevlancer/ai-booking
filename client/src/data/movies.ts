export interface Movie {
  title: string;
  poster: string;
  genre: string;
  year: string;
}

export const MOVIES: Movie[] = [
  {
    title: "Deadpool & Wolverine",
    poster: "https://image.tmdb.org/t/p/w500/hPtPOA0RTnV6hO5v3hF1rUuRtnO.jpg",
    genre: "Action, Comedy",
    year: "2024"
  },
  {
    title: "Inside Out 2",
    poster: "https://image.tmdb.org/t/p/w500/djhPTGoBsq0hwg5r3Iqh9CzRBY0.jpg",
    genre: "Animation, Family",
    year: "2024"
  },
  {
    title: "Pushpa 2",
    poster: "https://image.tmdb.org/t/p/w500/84nmyqRQltOelF8RoqfoBx3Y7cY.jpg",
    genre: "Action, Drama",
    year: "2024"
  },
  {
    title: "Kalki 2898 AD",
    poster: "https://image.tmdb.org/t/p/w500/eoNRk8r2raXI5Qun7qY5T2r8j04.jpg",
    genre: "Sci-Fi, Action",
    year: "2024"
  }
];
