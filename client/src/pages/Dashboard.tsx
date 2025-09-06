import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PreBooking } from "@shared/schema";

export default function Dashboard() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preBookings = [], isLoading } = useQuery<PreBooking[]>({
    queryKey: ["/api/prebookings"],
  });

  const openBookingMutation = useMutation({
    mutationFn: async (movieTitle: string) => {
      const response = await apiRequest("POST", "/api/movie-bookings", {
        movieTitle,
        isBookingOpen: true,
      });
      return response.json();
    },
    onSuccess: (_, movieTitle) => {
      toast({
        title: "Bookings Opened",
        description: `Bookings have been opened for ${movieTitle}!`,
      });
      // Simulate finding matches for pending pre-bookings
      simulateMatchFound(movieTitle);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to open bookings",
        variant: "destructive",
      });
    },
  });

  const simulateMatchFound = async (movieTitle: string) => {
    // Find pending pre-bookings for this movie and mark them as match found
    const pendingBookings = preBookings.filter(
      booking => booking.movieTitle === movieTitle && booking.status === "pending"
    );

    for (const booking of pendingBookings) {
      const mockMatchDetails = {
        theater: (booking.selectedTheaters as string[])[0],
        date: (booking.selectedDates as string[])[0],
        time: "15:00",
        seats: ["J7", "J8", "J9"].slice(0, booking.ticketCount),
        price: booking.ticketCount * 220,
        serviceFee: 45,
        total: booking.ticketCount * 220 + 45 - (booking.ticketCount * 50), // minus pre-booking fee
      };

      try {
        await apiRequest("PATCH", `/api/prebookings/${booking.id}/status`, {
          status: "match_found",
          matchDetails: mockMatchDetails,
        });
      } catch (error) {
        console.error("Failed to update booking status:", error);
      }
    }

    // Refresh the data
    queryClient.invalidateQueries({ queryKey: ["/api/prebookings"] });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "searching":
        return "bg-blue-500/20 text-blue-400";
      case "match_found":
        return "bg-green-500/20 text-green-400";
      case "confirmed":
        return "bg-primary/20 text-primary";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "match_found":
        return "Match Found";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="dashboard-title">
            My Pre-Bookings
          </h1>
          <p className="text-muted-foreground">Track your AI pre-booking requests</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-card p-3 rounded-lg">
            <span className="text-sm text-muted-foreground">Admin Mode:</span>
            <Switch
              checked={isAdminMode}
              onCheckedChange={setIsAdminMode}
              data-testid="admin-mode-toggle"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {preBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No pre-bookings found</p>
            <Link href="/">
              <Button data-testid="button-create-prebook">
                Create Your First Pre-Booking
              </Button>
            </Link>
          </div>
        ) : (
          preBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-card rounded-lg p-6 border border-border"
              data-testid={`prebook-card-${booking.id}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={booking.moviePoster} 
                    alt={booking.movieTitle}
                    className="w-16 h-20 object-cover rounded"
                    data-testid={`movie-poster-${booking.id}`}
                  />
                  <div>
                    <h3 className="font-semibold text-lg" data-testid={`movie-title-${booking.id}`}>
                      {booking.movieTitle}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {booking.ticketCount} ticket{booking.ticketCount > 1 ? 's' : ''} • {(booking.selectedTheaters as string[]).join(', ')}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {(booking.selectedDates as string[]).join(', ')} • {booking.timeRange} preferred
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}
                    data-testid={`status-badge-${booking.id}`}
                  >
                    {formatStatus(booking.status)}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatTimeAgo(booking.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Booking ID: {booking.id.slice(0, 8).toUpperCase()}
                </div>
                <div className="space-x-2">
                  {isAdminMode && booking.status === "pending" && (
                    <Button
                      onClick={() => openBookingMutation.mutate(booking.movieTitle)}
                      disabled={openBookingMutation.isPending}
                      size="sm"
                      data-testid={`button-open-booking-${booking.id}`}
                    >
                      {openBookingMutation.isPending ? "Opening..." : "Open Bookings"}
                    </Button>
                  )}
                  {booking.status === "match_found" && (
                    <Link href={`/match/${booking.id}`}>
                      <Button 
                        size="sm"
                        data-testid={`button-view-match-${booking.id}`}
                      >
                        View Match
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
