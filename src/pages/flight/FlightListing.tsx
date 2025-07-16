import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/pages/landing-page/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchFlights, clearError } from "@/redux/slices/flightSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "@/pages/landing-page/Footer";

export default function FlightListing() {
  const dispatch = useAppDispatch();
  const { flights, loading, error, meta } = useAppSelector((state) => state.flight);
  const [searchParams, setSearchParams] = useSearchParams();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const indonesianCities = [
    "Jakarta (CGK)",
    "Surabaya (MLG)",
    "Medan (KNO)",
    "Denpasar/Bali (DPS)",
    "Makassar (UPG)",
    "Balikpapan (BPN)",
    "Manado (MDC)",
    "Palembang (PLM)",
    "Pekanbaru (PKU)",
    "Banjarmasin (BDJ)",
    "Pontianak (PNK)",
    "Jambi (DJB)",
    "Padang (PDG)",
    "Yogyakarta (JOG)",
    "Solo (SOC)",
    "Semarang (SRG)",
    "Malang (MLG)",
    "Bandung (BDO)",
    "Lampung (TKG)",
    "Batam (BTH)",
  ];

  const airlines = ["Garuda Indonesia", "Lion Air", "Citilink", "AirAsia", "Batik Air", "Sriwijaya Air", "Wings Air", "Super Air Jet", "TransNusa"];

  // Get filters from URL parameters
  const getFiltersFromURL = () => {
    return {
      origin: searchParams.get("origin") || "",
      destination: searchParams.get("destination") || "",
      airlineName: searchParams.get("airlineName") || "",
    };
  };

  // Update URL parameters when filters change
  const updateURLParams = (newFilters: any) => {
    const params = new URLSearchParams(searchParams);

    // Update or remove parameters based on filter values
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    });

    // Reset page to 1 when filters change
    params.delete("page");

    setSearchParams(params);
  };

  // Fetch flights when URL parameters or pagination change
  useEffect(() => {
    const filters = getFiltersFromURL();
    const currentPage = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

    setPagination((prev) => ({
      ...prev,
      page: currentPage,
    }));

    dispatch(
      fetchFlights({
        pagination: { ...pagination, page: currentPage },
        filters,
      })
    );
  }, [searchParams, dispatch]);

  const handleFilterChange = (key: string, value: string) => {
    const currentFilters = getFiltersFromURL();
    const newFilters = {
      ...currentFilters,
      [key]: value,
    };

    updateURLParams(newFilters);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const currentFilters = getFiltersFromURL();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="px-5 lg:px-20 pb-38 pt-20 flex gap-x-10">
        <div className="hidden md:block lg:w-1/3 w-1/2 border-r pr-10">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Product Information</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.</p>
                <p>Key features include advanced processing capabilities, and an intuitive user interface designed for both beginners and experts.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Shipping Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>We offer worldwide shipping through trusted courier partners. Standard delivery takes 3-5 business days, while express shipping ensures delivery within 1-2 business days.</p>
                <p>All orders are carefully packaged and fully insured. Track your shipment in real-time through our dedicated tracking portal.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Return Policy</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>We stand behind our products with a comprehensive 30-day return policy. If you&apos;re not completely satisfied, simply return the item in its original condition.</p>
                <p>Our hassle-free return process includes free return shipping and full refunds processed within 48 hours of receiving the returned item.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="w-full">
          {/* Filters */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filter Flights</h2>
              {(currentFilters.origin || currentFilters.destination || currentFilters.airlineName) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              )}
            </div>

            <Select
              value={currentFilters.origin}
              onValueChange={(value) => handleFilterChange("origin", value)}
            >
              <SelectTrigger className="w-full border-slate-300 dark:border-stone-600">
                <SelectValue placeholder="Select departure city" />
              </SelectTrigger>
              <SelectContent>
                {indonesianCities.map((city) => (
                  <SelectItem
                    key={city}
                    value={city}
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentFilters.destination}
              onValueChange={(value) => handleFilterChange("destination", value)}
            >
              <SelectTrigger className="w-full border-slate-300 dark:border-stone-600">
                <SelectValue placeholder="Select destination city" />
              </SelectTrigger>
              <SelectContent>
                {indonesianCities.map((city) => (
                  <SelectItem
                    key={city}
                    value={city}
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentFilters.airlineName}
              onValueChange={(value) => handleFilterChange("airlineName", value)}
            >
              <SelectTrigger className="w-full border-slate-300 dark:border-stone-600">
                <SelectValue placeholder="Select airline" />
              </SelectTrigger>
              <SelectContent>
                {airlines.map((airline) => (
                  <SelectItem
                    key={airline}
                    value={airline}
                  >
                    {airline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Active Filters Display */}
            {(currentFilters.origin || currentFilters.destination || currentFilters.airlineName) && (
              <div className="flex flex-wrap gap-2 mt-4">
                <p className="text-sm text-gray-600">Active filters:</p>
                {currentFilters.origin && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    <span>Origin: {currentFilters.origin}</span>
                    <button
                      onClick={() => handleFilterChange("origin", "")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                )}
                {currentFilters.destination && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    <span>Destination: {currentFilters.destination}</span>
                    <button
                      onClick={() => handleFilterChange("destination", "")}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </div>
                )}
                {currentFilters.airlineName && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    <span>Airline: {currentFilters.airlineName}</span>
                    <button
                      onClick={() => handleFilterChange("airlineName", "")}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-gray-600">Loading flights...</span>
            </div>
          )}

          {/* Flight List */}
          {!loading && (
            <div className="space-y-5">
              {flights && flights.length > 0 ? (
                flights.map((flight) => (
                  <FlightListCard
                    key={flight.id}
                    flight={flight}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No flights found matching your criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination Info */}
          {!loading && flights && flights.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              Showing {flights.length} of {meta.total} flights
              {meta.totalPages > 1 && (
                <span>
                  {" "}
                  (Page {meta.page} of {meta.totalPages})
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function FlightListCard({ flight }: any) {
  const navigate = useNavigate()
  // Calculate flight duration (if we have both departure and arrival times)
  const calculateDuration = (departureTime: any, arrivalTime: any) => {
    if (!departureTime || !arrivalTime) return "N/A";

    const departure: any = new Date(departureTime);
    const arrival: any = new Date(arrivalTime);
    const diffMs: any = arrival - departure;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMinutes}m`;
  };

  // Format time to display only hours and minutes
  const formatTime = (dateString: any) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Extract airport codes from city strings (if available)
  const getAirportCode = (location: any) => {
    if (!location) return "N/A";
    const match = location.match(/\(([^)]+)\)/);
    return match ? match[1] : location.substring(0, 3).toUpperCase();
  };

  const duration = calculateDuration(flight.departureTime, flight.arrivalTime);
  const departureTime = formatTime(flight.departureTime);
  const arrivalTime = formatTime(flight.arrivalTime);
  const originCode = getAirportCode(flight.origin);
  const destinationCode = getAirportCode(flight.destination);

  return (
    <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
      {/* Logo & Rating */}
      <div className="flex items-center gap-4">
        <img
          src={`https://travelin.noxturne.my.id/${flight.thumnail}`}
          alt={flight.airlineName}
          className="w-20 h-16 object-cover rounded-lg"
        />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{flight.reviewCount || "54"} reviews</p>
          <p className="text-xs text-muted-foreground mt-1">{flight.airlineName}</p>
        </div>
      </div>

      {/* Flight Details */}
      <div className="flex flex-col gap-2 text-sm w-full md:w-auto">
        <FlightListDetail
          departureTime={departureTime}
          arrivalTime={arrivalTime}
          duration={duration}
          route={`${originCode} - ${destinationCode}`}
          isNonStop={true} // You can add this field to your API if needed
        />
        {/* You can add more flight details here if your API provides them */}
      </div>

      {/* Price & Action */}
      <div className="flex flex-col items-end gap-2 ml-auto">
        <p className="text-sm text-muted-foreground">starting from</p>
        <p className="text-xl font-bold text-red-500">Rp {flight.price || "N/A"}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              // Add wishlist functionality here
              console.log("Added to wishlist:", flight.id);
            }}
          >
            <Heart size={16} />
          </Button>
          <Button
            onClick={() => {
              navigate(`/flight/detail/${flight.id}`) 
            }}
          >
            View Deals
          </Button>
        </div>
      </div>
    </Card>
  );
}

function FlightListDetail({ departureTime, arrivalTime, duration, route, isNonStop }: any) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-xs">
          {departureTime} - {arrivalTime}
        </p>
        <p className="text-muted-foreground text-xs">{isNonStop ? "non stop" : "with stops"}</p>
        <p className="font-medium text-xs">{duration}</p>
      </div>
      <p className="text-xs text-muted-foreground">{route}</p>
    </div>
  );
}
