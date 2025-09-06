import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import PreBookForm from "@/pages/PreBookForm";
import Confirmation from "@/pages/Confirmation";
import Dashboard from "@/pages/Dashboard";
import MatchFound from "@/pages/MatchFound";
import FinalConfirmation from "@/pages/FinalConfirmation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/prebook/:movieTitle" component={PreBookForm} />
      <Route path="/confirmation" component={Confirmation} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/match/:preBookingId" component={MatchFound} />
      <Route path="/final-confirmation/:bookingId" component={FinalConfirmation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Navigation />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
