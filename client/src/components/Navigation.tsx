import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border px-4 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            AI Pre-Book
          </h1>
          <span className="text-sm text-muted-foreground font-medium">Smart Movie Booking</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/">
            <button 
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
                location === "/" 
                  ? "bg-primary text-white shadow-lg" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              data-testid="nav-home"
            >
              Home
            </button>
          </Link>
          <Link href="/dashboard">
            <button 
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all ${
                location === "/dashboard" 
                  ? "bg-primary text-white shadow-lg" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              data-testid="nav-dashboard"
            >
              My Bookings
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
