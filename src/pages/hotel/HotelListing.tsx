import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Navbar from "@/pages/landing-page/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Loader2, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchHotels, clearError } from "@/redux/slices/hotelSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "@/pages/landing-page/Footer";

export default function HotelListing() {
  const dispatch = useAppDispatch();
  const { hotels, loading, error, pagination: meta } = useAppSelector((state: any) => state.hotel);
  const [searchParams, setSearchParams] = useSearchParams();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

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
  ];

  const priceRanges = [
    { label: "Under Rp 500,000", min: 0, max: 500000 },
    { label: "Rp 500,000 - Rp 1,000,000", min: 500000, max: 1000000 },
    { label: "Rp 1,000,000 - Rp 2,000,000", min: 1000000, max: 2000000 },
    { label: "Rp 2,000,000 - Rp 5,000,000", min: 2000000, max: 5000000 },
    { label: "Above Rp 5,000,000", min: 5000000, max: undefined },
  ];

  // Get filters from URL parameters
  const getFiltersFromURL = () => {
    return {
      name: searchParams.get("name") || "",
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
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

  // Fetch hotels when URL parameters or pagination change
  useEffect(() => {
    const filters = getFiltersFromURL();
    const currentPage = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

    setPagination((prev) => ({
      ...prev,
      page: currentPage,
    }));

    dispatch(
      fetchHotels({
        pagination: { ...pagination, page: currentPage },
        filters,
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

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const currentFilters = getFiltersFromURL();

  const getCurrentPriceRangeLabel = () => {
    if (!currentFilters.minPrice && !currentFilters.maxPrice) return "";

    const range = priceRanges.find((r) => r.min === currentFilters.minPrice && r.max === currentFilters.maxPrice);

    return range ? range.label : `Rp ${currentFilters.minPrice?.toLocaleString()} - Rp ${currentFilters.maxPrice?.toLocaleString()}`;
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
              <AccordionTrigger>Hotel Information</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>Discover amazing hotels across Indonesia with our comprehensive booking platform. From luxury resorts to budget-friendly accommodations, we have something for every traveler.</p>
                <p>All hotels are verified and offer competitive rates with instant confirmation and secure booking processes.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Booking Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>Book with confidence knowing that all reservations are instantly confirmed. Our platform supports flexible booking options and easy cancellation policies.</p>
                <p>Payment is secure and processed through trusted payment gateways with multiple payment options available.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Customer Support</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>Our 24/7 customer support team is ready to assist you with any questions or concerns about your hotel booking.</p>
                <p>We provide comprehensive travel support including local recommendations and assistance with special requests.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="w-full">
          {/* Filters */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filter Hotels</h2>
              {(currentFilters.name || currentFilters.location || currentFilters.minPrice || currentFilters.maxPrice) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Hotel Name Filter */}
            <Input
              placeholder="Search hotel name..."
              value={currentFilters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="w-full border-slate-300 dark:border-stone-600"
            />

            {/* Location Filter */}
            <Select
              value={currentFilters.location}
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger className="w-full border-slate-300 dark:border-stone-600">
                <SelectValue placeholder="Select location" />
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

            {/* Active Filters Display */}
            {(currentFilters.name || currentFilters.location || currentFilters.minPrice || currentFilters.maxPrice) && (
              <div className="flex flex-wrap gap-2 mt-4">
                <p className="text-sm text-gray-600">Active filters:</p>
                {currentFilters.name && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    <span>Name: {currentFilters.name}</span>
                    <button
                      onClick={() => handleFilterChange("name", "")}
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
              <span className="ml-2 text-gray-600">Loading hotels...</span>
            </div>
          )}

          {/* Hotel List */}
          {!loading && (
            <div className="space-y-5">
              {hotels && hotels.length > 0 ? (
                hotels.map((hotel: any) => (
                  <HotelListCard
                    key={hotel.id}
                    hotel={hotel}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hotels found matching your criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination Info */}
          {!loading && hotels && hotels.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 text-center">
              Showing {hotels.length} of {meta.total} hotels
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

function HotelListCard({ hotel }: any) {
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

  // Generate random rating for display (you can replace with actual data)
  const generateRating = () => {
    return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
  };

  const rating = generateRating();

  return (
    <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
      {/* Hotel Image & Basic Info */}
      <div className="flex items-center gap-4">
        <img
          src={hotel.thumbnail ? `http://localhost:3000/${hotel.thumbnail}` : "/placeholder-hotel.jpg"}
          alt={hotel.name}
          className="w-24 h-20 object-cover rounded-lg"
        />
        <div>
          <h3 className="font-semibold text-lg">{hotel.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin
              size={14}
              className="text-gray-500"
            />
            <p className="text-sm text-gray-600">{hotel.location}</p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star
              size={14}
              className="text-yellow-500 fill-current"
            />
            <p className="text-sm font-medium">{rating}</p>
            <p className="text-xs text-gray-500">({Math.floor(Math.random() * 500) + 100} reviews)</p>
          </div>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="flex flex-col gap-2 text-sm w-full md:w-auto">
        <HotelListDetail
          description={hotel.description}
          amenities={hotel.amenities || []}
        />
      </div>

      {/* Price & Action */}
      <div className="flex flex-col items-end gap-2 ml-auto">
        <p className="text-sm text-muted-foreground">per night</p>
        <p className="text-xl font-bold text-red-500">{formatPrice(hotel.pricePerNight)}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              // Add wishlist functionality here
              console.log("Added to wishlist:", hotel.id);
            }}
          >
            <Heart size={16} />
          </Button>
          <Button
            onClick={() => {
              navigate(`/hotel/detail/${hotel.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

function HotelListDetail({ description, amenities }: any) {
  // Truncate description to show only first 100 characters
  const truncatedDescription = description && description.length > 100 ? description.substring(0, 100) + "..." : description;

  return (
    <div className="flex flex-col gap-1 max-w-md">
      <p className="text-sm text-gray-700">{truncatedDescription}</p>
      {amenities && amenities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {amenities.slice(0, 3).map((amenity: string, index: number) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && <span className="text-xs text-gray-500">+{amenities.length - 3} more</span>}
        </div>
      )}
    </div>
  );
}
