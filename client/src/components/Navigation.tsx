import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-card border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary">AI Pre-Book</h1>
          <span className="text-sm text-muted-foreground">Movie Booking System</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button 
              className={`text-sm transition-colors ${
                location === "/" ? "text-primary" : "hover:text-primary"
              }`}
              data-testid="nav-home"
            >
              Home
            </button>
          </Link>
          <Link href="/dashboard">
            <button 
              className={`text-sm transition-colors ${
                location === "/dashboard" ? "text-primary" : "hover:text-primary"
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
