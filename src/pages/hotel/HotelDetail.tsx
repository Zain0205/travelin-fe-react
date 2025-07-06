"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Footer from "@/pages/landing-page/Footer";
import Navbar from "@/pages/landing-page/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHotelById, clearCurrentHotel, clearError } from "@/redux/slices/hotelSlice";
import { Loader2, CalendarIcon, ArrowLeft, AlertCircle, Star, MapPin, Wifi, Car, Coffee, Utensils, Dumbbell, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createBooking } from "@/redux/slices/bookingSlice";
import { toast } from "sonner";

interface HotelImage {
  id: number;
  fileUrl: string;
  hotelId: number;
  type: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// const formatDate = (dateString: string): string => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("id-ID", {
//     timeZone: "Asia/Jakarta",
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// };

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">({rating})</span>
    </div>
  );
};

function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { currentHotel, loading, error } = useAppSelector((state) => state.hotel);

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelById(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentHotel());
      dispatch(clearError());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentHotel?.thumbnail) {
      setSelectedImage(`http://localhost:3000/${currentHotel.thumbnail}`);
    }
  }, [currentHotel]);

  const handleBookNow = () => {
    navigate(`/booking/hotel/${id}`);
  };

  const handleBackToHotels = () => {
    navigate("/hotel/listing");
  };

  const handleImageSelect = (imagePath: string) => {
    // Jika imagePath sudah berupa URL lengkap, gunakan langsung
    if (imagePath.startsWith("http")) {
      setSelectedImage(imagePath);
    } else {
      setSelectedImage(`http://localhost:3000/${imagePath}`);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-muted-foreground">Memuat detail hotel...</p>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center space-y-4"
          >
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={handleBackToHotels}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Hotel
            </Button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (!currentHotel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center space-y-4"
          >
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <h2 className="text-xl font-semibold">Hotel Tidak Ditemukan</h2>
            <p className="text-muted-foreground">Hotel yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button
              onClick={handleBackToHotels}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Hotel
            </Button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-20 pb-38 mx-auto max-w-8xl px-38 py-8 space-y-8"
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleBackToHotels}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Hotel
          </Button>
        </motion.div>

        {/* Header Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-start flex-wrap gap-y-4"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{currentHotel.name}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{currentHotel.location}</span>
            </div>
            {currentHotel.rating && <StarRating rating={currentHotel.rating} />}
          </div>
          <div className="text-right space-y-2">
            <p className="text-3xl font-bold text-green-600">{formatCurrency(currentHotel.pricePerNight)}</p>
            <p className="text-sm text-muted-foreground">per malam</p>
            <HotelBookingModal
              currentHotel={currentHotel}
              trigger={
                <Button
                  size="lg"
                  className="w-full"
                >
                  Pesan Sekarang
                </Button>
              }
            />
          </div>
        </motion.div>

        {/* Main Image */}
        <motion.div
          className="rounded-xl overflow-hidden shadow-lg bg-gray-100"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={`${currentHotel.name} Hotel`}
              className="w-full h-64 md:h-96 object-cover cursor-pointer"
              onError={(e) => {
                console.error("Image failed to load:", selectedImage);
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
              <div className="text-center">
                <div className="text-4xl mb-2">🏨</div>
                <p className="text-gray-600 font-medium">{currentHotel.name}</p>
                <p className="text-gray-400 text-sm">{currentHotel.location}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Hotel Images Gallery */}
        {currentHotel?.images && currentHotel.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Galeri Foto</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {/* Thumbnail as first image */}
              {currentHotel.thumbnail && (
                <div
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${selectedImage === `http://localhost:3000/${currentHotel.thumbnail}` ? "ring-2 ring-blue-500 ring-offset-2" : "hover:scale-105"}`}
                  onClick={() => handleImageSelect(currentHotel.thumbnail)}
                >
                  <img
                    src={`http://localhost:3000/${currentHotel.thumbnail}`}
                    alt={`${currentHotel.name} thumbnail`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      console.error("Thumbnail failed to load:", currentHotel.thumbnail);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Additional hotel images - FIXED: using correct object structure */}
              {currentHotel.images.map((imageObj: HotelImage, index: number) => (
                <div
                  key={imageObj.id || index}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${selectedImage === `http://localhost:3000/${imageObj.fileUrl}` ? "ring-2 ring-blue-500 ring-offset-2" : "hover:scale-105"}`}
                  onClick={() => handleImageSelect(imageObj.fileUrl)}
                >
                  <img
                    src={`http://localhost:3000/${imageObj.fileUrl}`}
                    alt={`${currentHotel.name} image ${index + 1}`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", imageObj.fileUrl);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hotel Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Informasi Hotel</h2>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nama Hotel</p>
              <p className="font-medium text-lg">{currentHotel.name}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Lokasi</p>
              <p className="font-medium text-lg">{currentHotel.location}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Harga per Malam</p>
              <p className="font-medium text-lg text-green-600">{formatCurrency(currentHotel.pricePerNight)}</p>
            </div>

            {currentHotel.rating && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rating</p>
                <StarRating rating={currentHotel.rating} />
              </div>
            )}

            {currentHotel.totalRooms && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Kamar</p>
                <p className="font-medium text-lg">{currentHotel.totalRooms} kamar</p>
              </div>
            )}

            {currentHotel.availableRooms && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Kamar Tersedia</p>
                <p className="font-medium text-lg">{currentHotel.availableRooms} kamar</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Description */}
        {currentHotel.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Deskripsi Hotel</h2>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{currentHotel.description}</p>
            </div>
          </motion.div>
        )}

        {/* Hotel Amenities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Fasilitas Hotel</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Wi-Fi Gratis</span>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Parkir Gratis</span>
              </div>
              <div className="flex items-center space-x-3">
                <Coffee className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Kafe & Restoran</span>
              </div>
              <div className="flex items-center space-x-3">
                <Utensils className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Sarapan Gratis</span>
              </div>
              <div className="flex items-center space-x-3">
                <Dumbbell className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Pusat Kebugaran</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Keamanan 24 Jam</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hotel Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Kebijakan Hotel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Check-in: 14:00 - Check-out: 12:00</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Pembatalan gratis hingga 24 jam sebelum check-in</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Tidak diperkenankan merokok di dalam kamar</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Hewan peliharaan diperbolehkan (syarat berlaku)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Protokol kesehatan COVID-19 ketat</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Layanan kamar 24 jam tersedia</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
}

export default HotelDetail;

interface HotelBookingModalProps {
  currentHotel: any;
  trigger?: React.ReactNode;
}

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({ currentHotel, trigger }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.booking);

  const [open, setOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateNights = (): number => {
    if (!checkInDate || !checkOutDate) return 0;
    return differenceInDays(checkOutDate, checkInDate);
  };

  const calculateTotalPrice = (): number => {
    const nights = calculateNights();
    return nights * currentHotel.pricePerNight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkInDate) {
      toast.error("Silakan pilih tanggal check-in");
      return;
    }

    if (!checkOutDate) {
      toast.error("Silakan pilih tanggal check-out");
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error("Tanggal check-out harus setelah tanggal check-in");
      return;
    }

    const nights = calculateNights();
    if (nights <= 0) {
      toast.error("Minimal menginap 1 malam");
      return;
    }

    const bookingData: any = {
      type: "hotel" as const,
      hotels: [
        {
          hotelId: currentHotel.id,
          checkInDate: format(checkInDate, "yyyy-MM-dd"),
          checkOutDate: format(checkOutDate, "yyyy-MM-dd"),
          nights: nights,
        },
      ],
    };

    try {
      await dispatch(createBooking(bookingData)).unwrap();
      toast.success("Booking hotel berhasil dibuat!");
      setOpen(false);
      // Reset form
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
    } catch (error) {
      toast.error((error as string) || "Gagal membuat booking");
    }
  };

  const nights = calculateNights();
  const totalPrice = calculateTotalPrice();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className="w-full"
          >
            Pesan Sekarang
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pesan Hotel</DialogTitle>
          <DialogDescription>
            Lengkapi tanggal menginap untuk hotel {currentHotel.name} di {currentHotel.location}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Hotel Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Detail Hotel</h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Hotel</p>
                <p className="font-medium">{currentHotel.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lokasi</p>
                <p className="font-medium">{currentHotel.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Harga per malam</p>
                  <p className="font-medium text-green-600">{formatCurrency(currentHotel.pricePerNight)}</p>
                </div>
                {nights > 0 && (
                  <div>
                    <p className="text-muted-foreground">Total ({nights} malam)</p>
                    <p className="font-medium text-green-600">{formatCurrency(totalPrice)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Check-in Date */}
          <div className="space-y-2">
            <Label htmlFor="checkInDate">Tanggal Check-in *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !checkInDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? format(checkInDate, "PPP", { locale: id }) : "Pilih tanggal check-in"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label htmlFor="checkOutDate">Tanggal Check-out *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !checkOutDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? format(checkOutDate, "PPP", { locale: id }) : "Pilih tanggal check-out"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => {
                    const today = new Date();
                    const minCheckOut = checkInDate ? new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000) : today;
                    return date < minCheckOut;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Booking Summary */}
          {nights > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Ringkasan Booking</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Durasi menginap</span>
                  <span className="font-medium">{nights} malam</span>
                </div>
                <div className="flex justify-between">
                  <span>Harga per malam</span>
                  <span className="font-medium">{formatCurrency(currentHotel.pricePerNight)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span className="font-medium">{format(checkInDate!, "dd MMM yyyy", { locale: id })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span className="font-medium">{format(checkOutDate!, "dd MMM yyyy", { locale: id })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Total Price Summary */}
          {nights > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Pembayaran</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totalPrice)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {nights} malam × {formatCurrency(currentHotel.pricePerNight)}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || nights <= 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Buat Booking"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
