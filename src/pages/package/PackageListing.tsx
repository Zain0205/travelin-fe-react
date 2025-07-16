import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Navbar from "@/pages/landing-page/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Loader2, MapPin, Calendar, Users, Clock } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchTravelPackages, clearError } from "@/redux/slices/travelPackageSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "@/pages/landing-page/Footer";

export default function PackageListing() {
  const dispatch = useAppDispatch();
  const { packages, loading, error, meta } = useAppSelector((state: any) => state.travelPackage);
  const [searchParams, setSearchParams] = useSearchParams();

  const indonesianCities = [
    "Jakarta",
    "Surabaya",
    "Medan",
    "Bandung",
    "Bekasi",
    "Tangerang",
    "Depok",
    "Semarang",
    "Palembang",
    "Makassar",
    "Batam",
    "Pekanbaru",
    "Bandar Lampung",
    "Padang",
    "Malang",
    "Denpasar",
    "Samarinda",
    "Tasikmalaya",
    "Serang",
    "Balikpapan",
    "Pontianak",
    "Jambi",
    "Cirebon",
    "Sukabumi",
    "Mataram",
    "Manado",
    "Yogyakarta",
    "Solo",
    "Bogor",
    "Banjarmasin",
    "Bali",
    "Lombok",
    "Flores",
    "Komodo",
    "Raja Ampat",
    "Bunaken",
    "Bromo",
    "Ijen",
    "Toba",
    "Belitung",
  ];

  const priceRanges = [
    { label: "Under Rp 1,000,000", min: 0, max: 1000000 },
    { label: "Rp 1,000,000 - Rp 2,500,000", min: 1000000, max: 2500000 },
    { label: "Rp 2,500,000 - Rp 5,000,000", min: 2500000, max: 5000000 },
    { label: "Rp 5,000,000 - Rp 10,000,000", min: 5000000, max: 10000000 },
    { label: "Above Rp 10,000,000", min: 10000000, max: undefined },
  ];

  const durationOptions = [
    { label: "1-3 Days", min: 1, max: 3 },
    { label: "4-7 Days", min: 4, max: 7 },
    { label: "8-14 Days", min: 8, max: 14 },
    { label: "15+ Days", min: 15, max: undefined },
  ];

  // Get filters from URL parameters
  const getFiltersFromURL = () => {
    return {
      title: searchParams.get("title") || "",
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
      minDuration: searchParams.get("minDuration") ? parseInt(searchParams.get("minDuration")!) : undefined,
      maxDuration: searchParams.get("maxDuration") ? parseInt(searchParams.get("maxDuration")!) : undefined,
    };
  };

  // Update URL parameters when filters change
  const updateURLParams = (newFilters: any) => {
    const params = new URLSearchParams(searchParams);

    // Update or remove parameters based on filter values
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Reset page to 1 when filters change
    params.delete("page");

    setSearchParams(params);
  };

  // Fetch packages when URL parameters change
  useEffect(() => {
    const filters = getFiltersFromURL();
    const currentPage = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

    dispatch(
      fetchTravelPackages({
        ...filters,
        page: currentPage,
        limit: 10,
      })
    );
  }, [searchParams, dispatch]);

  const handleFilterChange = (key: string, value: any) => {
    const currentFilters = getFiltersFromURL();
    const newFilters = {
      ...currentFilters,
      [key]: value,
    };

    updateURLParams(newFilters);
  };

  const handlePriceRangeChange = (range: any) => {
    const currentFilters = getFiltersFromURL();
    const newFilters = {
      ...currentFilters,
      minPrice: range.min,
      maxPrice: range.max,
    };

    updateURLParams(newFilters);
  };

  const handleDurationRangeChange = (range: any) => {
    const currentFilters = getFiltersFromURL();
    const newFilters = {
      ...currentFilters,
      minDuration: range.min,
      maxDuration: range.max,
    };

    updateURLParams(newFilters);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const currentFilters = getFiltersFromURL();

  const getCurrentPriceRangeLabel = () => {
    if (!currentFilters.minPrice && !currentFilters.maxPrice) return "";

    const range = priceRanges.find((r) => r.min === currentFilters.minPrice && r.max === currentFilters.maxPrice);

    return range ? range.label : `Rp ${currentFilters.minPrice?.toLocaleString()} - Rp ${currentFilters.maxPrice?.toLocaleString()}`;
  };

  const getCurrentDurationRangeLabel = () => {
    if (!currentFilters.minDuration && !currentFilters.maxDuration) return "";

    const range = durationOptions.find((r) => r.min === currentFilters.minDuration && r.max === currentFilters.maxDuration);

    return range ? range.label : `${currentFilters.minDuration} - ${currentFilters.maxDuration} days`;
  };

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
              <AccordionTrigger>Travel Package Information</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>Explore Indonesia's most beautiful destinations with our carefully curated travel packages. From cultural adventures to natural wonders, we offer unforgettable experiences for every type of traveler.</p>
                <p>All packages include professional guides, comfortable accommodations, and authentic local experiences with flexible booking options.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Booking Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>Book with confidence knowing that all travel packages are professionally organized with instant confirmation. Our packages include accommodation, meals, transportation, and guided activities.</p>
                <p>Flexible payment options and comprehensive travel insurance available for all bookings.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Customer Support</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>Our experienced travel consultants are available 24/7 to help you choose the perfect package and assist with any special requirements or questions.</p>
                <p>We provide comprehensive pre-travel briefings and on-ground support throughout your journey.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="w-full">
          {/* Filters */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filter Travel Packages</h2>
              {(currentFilters.title || currentFilters.location || currentFilters.minPrice || currentFilters.maxPrice || currentFilters.minDuration || currentFilters.maxDuration) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Package Title Filter */}
            <Input
              placeholder="Search package title..."
              value={currentFilters.title}
              onChange={(e) => handleFilterChange("title", e.target.value)}
              className="w-full border-slate-300 dark:border-stone-600"
            />

            {/* Location Filter */}
            <Select
              value={currentFilters.location}
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger className="w-full border-slate-300 dark:border-stone-600">
                <SelectValue placeholder="Select destination" />
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

            {/* Price Range Filter */}
            <Select
              value={getCurrentPriceRangeLabel()}
              onValueChange={(value) => {
                const range = priceRanges.find((r) => r.label === value);
                if (range) {
                  handlePriceRangeChange(range);
                }
              }}
            >
              <SelectTrigger className="w-full border-slate-300 dark:border-stone-600">
                <SelectValue placeholder="Select price range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem
                    key={range.label}
                    value={range.label}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Duration Filter */}
            <Select
              value={getCurrentDurationRangeLabel()}
              onValueChange={(value) => {
                const range = durationOptions.find((r) => r.label === value);
                if (range) {
                  handleDurationRangeChange(range);
                }
              }}
            >
              <SelectTrigger className="w-full border-slate-300 dark:border-stone-600">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((range) => (
                  <SelectItem
                    key={range.label}
                    value={range.label}
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Active Filters Display */}
            {(currentFilters.title || currentFilters.location || currentFilters.minPrice || currentFilters.maxPrice || currentFilters.minDuration || currentFilters.maxDuration) && (
              <div className="flex flex-wrap gap-2 mt-4">
                <p className="text-sm text-gray-600">Active filters:</p>
                {currentFilters.title && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    <span>Title: {currentFilters.title}</span>
                    <button
                      onClick={() => handleFilterChange("title", "")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                )}
                {currentFilters.location && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    <span>Location: {currentFilters.location}</span>
                    <button
                      onClick={() => handleFilterChange("location", "")}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </div>
                )}
                {(currentFilters.minPrice || currentFilters.maxPrice) && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    <span>Price: {getCurrentPriceRangeLabel()}</span>
                    <button
                      onClick={() => {
                        handleFilterChange("minPrice", undefined);
                        handleFilterChange("maxPrice", undefined);
                      }}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </div>
                )}
                {(currentFilters.minDuration || currentFilters.maxDuration) && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                    <span>Duration: {getCurrentDurationRangeLabel()}</span>
                    <button
                      onClick={() => {
                        handleFilterChange("minDuration", undefined);
                        handleFilterChange("maxDuration", undefined);
                      }}
                      className="ml-1 text-orange-600 hover:text-orange-800"
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
              <span className="ml-2 text-gray-600">Loading travel packages...</span>
            </div>
          )}

          {/* Package List */}
          {!loading && (
            <div className="space-y-5">
              {packages && packages.length > 0 ? (
                packages.map((travelPackage: any) => (
                  <PackageListCard
                    key={travelPackage.id}
                    travelPackage={travelPackage}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No travel packages found matching your criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination Info */}
          {!loading && packages && packages.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              Showing {packages.length} of {meta.total} travel packages
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

function PackageListCard({ travelPackage }: any) {
  const navigate = useNavigate();

  // Format price with Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate available spots
  const getAvailableSpots = (quota: number) => {
    // Assuming some spots are already booked (you can replace with actual data)
    const bookedSpots = Math.floor(Math.random() * quota * 0.3);
    return quota - bookedSpots;
  };

  const availableSpots = getAvailableSpots(travelPackage.quota);

  return (
    <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
      {/* Package Image & Basic Info */}
      <div className="flex items-center gap-4">
        <img
          src={travelPackage.thumbnail ? `https://travelin.noxturne.my.id/${travelPackage.thumbnail}` : "/placeholder-travel.jpg"}
          alt={travelPackage.title}
          className="w-24 h-20 object-cover rounded-lg"
        />
        <div>
          <h3 className="font-semibold text-lg">{travelPackage.title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin
              size={14}
              className="text-gray-500"
            />
            <p className="text-sm text-gray-600">{travelPackage.location}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Clock
                size={14}
                className="text-gray-500"
              />
              <p className="text-sm text-gray-600">{travelPackage.duration} days</p>
            </div>
            <div className="flex items-center gap-1">
              <Users
                size={14}
                className="text-gray-500"
              />
              <p className="text-sm text-gray-600">{availableSpots} spots left</p>
            </div>
          </div>
          {travelPackage.agent && (
            <div className="mt-1">
              <p className="text-xs text-blue-600 font-medium">Agent: {travelPackage.agent.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Package Details */}
      <div className="flex flex-col gap-2 text-sm w-full md:w-auto">
        <PackageListDetail
          description={travelPackage.description}
          startDate={travelPackage.startDate}
          endDate={travelPackage.endDate}
        />
      </div>

      {/* Price & Action */}
      <div className="flex flex-col items-end gap-2 ml-auto">
        <p className="text-sm text-muted-foreground">per person</p>
        <p className="text-xl font-bold text-red-500">{formatPrice(travelPackage.price)}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              // Add wishlist functionality here
              console.log("Added to wishlist:", travelPackage.id);
            }}
          >
            <Heart size={16} />
          </Button>
          <Button
            onClick={() => {
              navigate(`/package/detail/${travelPackage.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PackageListDetail({ description, startDate, endDate }: any) {
  // Truncate description to show only first 100 characters
  const truncatedDescription = description && description.length > 100 ? description.substring(0, 100) + "..." : description;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-2 max-w-md">
      <p className="text-sm text-gray-700">{truncatedDescription}</p>
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Calendar size={14} />
        <span>
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </div>
    </div>
  );
}
