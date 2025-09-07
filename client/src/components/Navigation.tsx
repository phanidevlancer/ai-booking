import { Link, useLocation } from "wouter";

const SmartBookLogo = ({ className }: { className?: string }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#1E40AF",stopOpacity:1}} />
        <stop offset="50%" style={{stopColor:"#3B82F6",stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#06B6D4",stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#F0F9FF",stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#DBEAFE",stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="ticketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#FBBF24",stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#F59E0B",stopOpacity:1}} />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/> 
        </feMerge>
      </filter>
    </defs>
    
    {/* Background circle */}
    <circle cx="16" cy="16" r="15" fill="url(#logoGradient)" stroke="#0EA5E9" strokeWidth="1" opacity="0.9"/>
    
    {/* AI Bot Body */}
    <g transform="translate(6, 8)">
      {/* Bot head */}
      <rect x="4" y="0" width="8" height="6" rx="2" fill="url(#botGradient)" stroke="#3B82F6" strokeWidth="0.8"/>
      
      {/* Bot eyes */}
      <circle cx="6.5" cy="2.5" r="0.8" fill="#3B82F6">
        <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="9.5" cy="2.5" r="0.8" fill="#3B82F6">
        <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite"/>
      </circle>
      
      {/* Bot antenna */}
      <line x1="8" y1="0" x2="8" y2="-2" stroke="#3B82F6" strokeWidth="0.5"/>
      <circle cx="8" cy="-2" r="0.8" fill="#F59E0B" filter="url(#glow)">
        <animate attributeName="fill" values="#F59E0B;#FBBF24;#F59E0B" dur="2s" repeatCount="indefinite"/>
      </circle>
      
      {/* Bot body */}
      <rect x="3" y="6" width="10" height="8" rx="1" fill="url(#botGradient)" stroke="#3B82F6" strokeWidth="0.8"/>
      
      {/* Bot chest panel */}
      <rect x="5" y="8" width="6" height="4" rx="0.5" fill="#1E40AF" opacity="0.3"/>
      <circle cx="8" cy="10" r="1" fill="#06B6D4" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      
      {/* Bot arm extending with ticket */}
      <rect x="13" y="9" width="4" height="1.5" rx="0.5" fill="url(#botGradient)" stroke="#3B82F6" strokeWidth="0.5"/>
    </g>
    
    {/* Movie Ticket */}
    <g transform="translate(20, 15)">
      <rect x="0" y="0" width="8" height="5" rx="0.5" fill="url(#ticketGradient)" stroke="#F59E0B" strokeWidth="0.5" filter="url(#glow)"/>
      
      {/* Ticket perforation */}
      <circle cx="0" cy="2.5" r="0.8" fill="none" stroke="#F59E0B" strokeWidth="0.3"/>
      <circle cx="8" cy="2.5" r="0.8" fill="none" stroke="#F59E0B" strokeWidth="0.3"/>
      
      {/* Ticket text lines */}
      <rect x="1.5" y="1" width="3" height="0.4" rx="0.2" fill="#FFFFFF" opacity="0.9"/>
      <rect x="1.5" y="2" width="2" height="0.4" rx="0.2" fill="#FFFFFF" opacity="0.7"/>
      <rect x="1.5" y="3" width="2.5" height="0.4" rx="0.2" fill="#FFFFFF" opacity="0.7"/>
      
      {/* Movie icon on ticket */}
      <rect x="5.5" y="1" width="1.5" height="1" rx="0.2" fill="#FFFFFF" opacity="0.8"/>
      <polygon points="6,2.2 6.8,2.6 6,3" fill="#F59E0B"/>
    </g>
    
    {/* Energy/AI particles around the interaction */}
    <g opacity="0.6">
      <circle cx="18" cy="12" r="0.5" fill="#06B6D4">
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="22" cy="18" r="0.4" fill="#FBBF24">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="25" cy="13" r="0.3" fill="#3B82F6">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </g>
    
    {/* Connection line from bot to ticket */}
    <line x1="19" y1="17" x2="20" y2="17" stroke="#06B6D4" strokeWidth="0.8" opacity="0.7">
      <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
    </line>
  </svg>
);

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border px-3 py-2 md:px-4 md:py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <SmartBookLogo className="w-8 h-8 md:w-10 md:h-10" />
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            SmartBook
          </h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-6">
          <Link href="/">
            <button 
              className={`text-xs md:text-sm font-medium px-2 py-1 md:px-4 md:py-2 rounded-full transition-all ${
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
              className={`text-xs md:text-sm font-medium px-2 py-1 md:px-4 md:py-2 rounded-full transition-all ${
                location === "/dashboard" 
                  ? "bg-primary text-white shadow-lg" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
              }`}
              data-testid="nav-dashboard"
            >
              <span className="hidden sm:inline">My Bookings</span>
              <span className="sm:hidden">Bookings</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
