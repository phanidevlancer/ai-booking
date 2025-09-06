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
    poster: "https://m.media-amazon.com/images/M/MV5BZjllNTdiM2QtYjQ0Ni00ZGM1LWFlYmUtNWY0YjMzYWIxOTYxXkEyXkFqcGc@._V1_.jpg",
    genre: "Action, Drama",
    year: "2024"
  },
  {
    title: "Kalki 2898 AD",
    poster: "https://m.media-amazon.com/images/M/MV5BMTM3ZGUwYTEtZTI5NS00ZmMyLTk2YmQtMWU4YjlhZTI3NjRjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genre: "Sci-Fi, Action",
    year: "2024"
  }
];
