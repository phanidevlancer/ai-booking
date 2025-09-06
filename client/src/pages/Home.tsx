import MovieCard from "@/components/MovieCard";
import { MOVIES } from "@/data/movies";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Upcoming Movies</h1>
        <p className="text-muted-foreground" data-testid="page-subtitle">
          Book your tickets now or use AI Pre-Book for automatic seat allocation
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOVIES.map((movie) => (
          <MovieCard key={movie.title} movie={movie} />
        ))}
      </div>
    </div>
  );
}
