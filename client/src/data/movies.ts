export interface Movie {
  title: string;
  poster: string;
  genre: string;
  year: string;
}

export const MOVIES: Movie[] = [
  {
    title: "Deadpool & Wolverine",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    genre: "Action, Comedy",
    year: "2024"
  },
  {
    title: "Inside Out 2",
    poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    genre: "Animation, Family",
    year: "2024"
  },
  {
    title: "Pushpa 2",
    poster: "https://picsum.photos/400/600?random=3",
    genre: "Action, Drama",
    year: "2024"
  },
  {
    title: "Kalki 2898 AD",
    poster: "https://picsum.photos/400/600?random=4",
    genre: "Sci-Fi, Action",
    year: "2024"
  }
];
