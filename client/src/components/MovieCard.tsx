import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/data/movies";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="movie-card bg-card rounded-lg overflow-hidden shadow-lg" data-testid={`movie-card-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}>
      <img 
        src={movie.poster} 
        alt={`${movie.title} movie poster`}
        className="w-full h-80 object-cover"
        data-testid={`movie-poster-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1" data-testid={`movie-title-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}>
          {movie.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{movie.genre} • {movie.year}</p>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            className="flex-1 text-sm"
            data-testid={`button-book-now-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            Book Now
          </Button>
          <Link href={`/prebook/${encodeURIComponent(movie.title)}`}>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
              data-testid={`button-ai-prebook-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              AI Pre-Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
