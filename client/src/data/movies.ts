export interface Movie {
  title: string;
  poster: string;
  genre: string;
  year: string;
  releaseDate: string;
  pricingConfig: {
    [day: number]: number; // day -> price per ticket
  };
}

export const MOVIES: Movie[] = [
  {
    title: "Deadpool & Wolverine",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    genre: "Action, Comedy",
    year: "2025",
    releaseDate: "Dec 5, 2025",
    pricingConfig: {
      0: 100, // Release day
      1: 90,  // Day 1
      2: 80,  // Day 2
      3: 70,  // Day 3
      4: 60,  // Day 4
      5: 50,  // Day 5
      6: 40,  // Day 6
      7: 30   // Day 7 and beyond
    }
  },
  {
    title: "Inside Out 2",
    poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    genre: "Animation, Family",
    year: "2025",
    releaseDate: "Dec 12, 2025",
    pricingConfig: {
      0: 120, // Higher pricing for family movie
      1: 110,
      2: 100,
      3: 90,
      4: 80,
      5: 70,
      6: 60,
      7: 50
    }
  },
  {
    title: "Pushpa 2",
    poster: "https://m.media-amazon.com/images/M/MV5BZjllNTdiM2QtYjQ0Ni00ZGM1LWFlYmUtNWY0YjMzYWIxOTYxXkEyXkFqcGc@._V1_.jpg",
    genre: "Action, Drama",
    year: "2025",
    releaseDate: "Dec 20, 2025",
    pricingConfig: {
      0: 95,
      1: 85,
      2: 75,
      3: 65,
      4: 55,
      5: 45,
      6: 35,
      7: 25
    }
  },
  {
    title: "Kalki 2898 AD",
    poster: "https://m.media-amazon.com/images/M/MV5BMTM3ZGUwYTEtZTI5NS00ZmMyLTk2YmQtMWU4YjlhZTI3NjRjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    genre: "Sci-Fi, Action",
    year: "2025",
    releaseDate: "Dec 31, 2025",
    pricingConfig: {
      0: 110, // Premium pricing for sci-fi
      1: 100,
      2: 90,
      3: 80,
      4: 70,
      5: 60,
      6: 50,
      7: 40
    }
  }
];
