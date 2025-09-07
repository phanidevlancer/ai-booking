import MovieCard from "@/components/MovieCard";
import { MOVIES } from "@/data/movies";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Clock, MapPin, Star, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const scrollToMovies = () => {
    const moviesSection = document.getElementById('movies-section');
    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-gradient py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Movie Booking
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Never Miss
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Your Show
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let AI handle the rush! Pre-book your favorite movies and get the best seats automatically when bookings open.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={scrollToMovies}
            >
              <Zap className="w-5 h-5 mr-2" />
              Try SmartBook
            </Button>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white/50 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold transition-all duration-300">
                My Bookings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="stats-counter">10K+</div>
              <p className="text-muted-foreground font-medium">Happy Users</p>
            </div>
            <div>
              <div className="stats-counter">500+</div>
              <p className="text-muted-foreground font-medium">Movies Booked</p>
            </div>
            <div>
              <div className="stats-counter">50+</div>
              <p className="text-muted-foreground font-medium">Partner Theaters</p>
            </div>
            <div>
              <div className="stats-counter">99%</div>
              <p className="text-muted-foreground font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SmartBook?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of movie booking with intelligent automation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Our AI secures your seats within seconds of booking opening, faster than any human.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Location</h3>
              <p className="text-muted-foreground">
                Automatically finds the best theaters near you based on your preferences.
              </p>
            </div>
            <div className="feature-card rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Best Seats</h3>
              <p className="text-muted-foreground">
                Intelligent seat selection based on your row and grouping preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div id="movies-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" data-testid="page-title">Upcoming Movies</h2>
            <p className="text-xl text-muted-foreground" data-testid="page-subtitle">
              Choose your favorite movie and let AI handle the rest
            </p>
          </div>
          
          <div className="movie-grid rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {MOVIES.map((movie) => (
                <MovieCard key={movie.title} movie={movie} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience the Future of Movie Booking?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of movie lovers who never miss their favorite shows
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
            <Users className="w-5 h-5 mr-2" />
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}
