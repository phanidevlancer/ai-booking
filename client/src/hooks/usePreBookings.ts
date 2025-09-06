import { useQuery } from "@tanstack/react-query";
import type { PreBooking } from "@shared/schema";

export function usePreBookings() {
  return useQuery<PreBooking[]>({
    queryKey: ["/api/prebookings"],
  });
}
