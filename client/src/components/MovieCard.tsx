import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Movie } from "@/data/movies";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="movie-card bg-white rounded-2xl overflow-hidden border border-gray-100" data-testid={`movie-card-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="relative">
        {imageError ? (
          <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-gray-500 text-sm font-medium">{movie.title}</p>
            </div>
          </div>
        ) : (
          <img 
            src={movie.poster} 
            alt={`${movie.title} movie poster`}
            className="w-full h-80 object-cover"
            onError={() => setImageError(true)}
            data-testid={`movie-poster-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}
          />
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {movie.year}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2" data-testid={`movie-title-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}>
          {movie.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 font-medium">{movie.genre}</p>
        <div className="flex flex-col space-y-3">
          <Button 
            variant="outline" 
            className="w-full font-semibold border-gray-200 hover:bg-gray-50"
            data-testid={`button-book-now-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            Book Now
          </Button>
          <Link href={`/prebook/${encodeURIComponent(movie.title)}`} className="w-full">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-semibold shadow-lg"
              data-testid={`button-ai-prebook-${movie.title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              ✨ AI Pre-Book
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
