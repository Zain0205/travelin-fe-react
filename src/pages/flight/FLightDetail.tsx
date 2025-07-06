"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Footer from "@/pages/landing-page/Footer";
import Navbar from "@/pages/landing-page/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFlightById, clearCurrentFlight, clearError } from "@/redux/slices/flightSlice";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createBooking } from "@/redux/slices/bookingSlice";
import { toast } from "sonner";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateFlightDuration = (departureTime: string, arrivalTime: string): string => {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  const diffMs = arrival.getTime() - departure.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHours}j ${diffMinutes}m`;
};

function FlightDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentFlight, loading, error } = useAppSelector((state) => state.flight);

  useEffect(() => {
    if (id) {
      dispatch(fetchFlightById(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentFlight());
      dispatch(clearError());
    };
  }, [id, dispatch]);

  const handleBookNow = () => {
    navigate(`/booking/flight/${id}`);
  };

  const handleBackToFlights = () => {
    navigate("/flight/listing");
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
            <p className="text-muted-foreground">Memuat detail penerbangan...</p>
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
              onClick={handleBackToFlights}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Penerbangan
            </Button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (!currentFlight) {
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
            <h2 className="text-xl font-semibold">Penerbangan Tidak Ditemukan</h2>
            <p className="text-muted-foreground">Penerbangan yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button
              onClick={handleBackToFlights}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Penerbangan
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
        className="pt-20 pb-38 mx-auto px-38 py-8 space-y-8"
      >
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={handleBackToFlights}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Penerbangan
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
            <h1 className="text-3xl font-bold tracking-tight">{currentFlight.airlineName}</h1>
            <p className="text-muted-foreground text-sm">
              {currentFlight.origin} → {currentFlight.destination}
            </p>
            <p className="text-muted-foreground text-xs">{formatDate(currentFlight.departureTime)}</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-3xl font-bold text-green-600">{formatCurrency(currentFlight.price)}</p>
            <FlightBookingModal
              currentFlight={currentFlight}
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
          {currentFlight.thumnail ? (
            <img
              src={`http://localhost:3000/${currentFlight.thumnail}`}
              alt={`${currentFlight.airlineName} Flight`}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                // Fallback jika gambar tidak dapat dimuat
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
              <div className="text-center">
                <div className="text-4xl mb-2">✈️</div>
                <p className="text-gray-600 font-medium">{currentFlight.airlineName}</p>
                <p className="text-gray-400 text-sm">
                  {currentFlight.origin} → {currentFlight.destination}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Flight Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Informasi Penerbangan</h2>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Maskapai</p>
              <p className="font-medium text-lg">{currentFlight.airlineName}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Rute</p>
              <p className="font-medium text-lg">
                {currentFlight.origin} → {currentFlight.destination}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Harga</p>
              <p className="font-medium text-lg text-green-600">{formatCurrency(currentFlight.price)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Keberangkatan</p>
              <p className="font-medium">{formatTime(currentFlight.departureTime)}</p>
              <p className="text-sm text-muted-foreground">{formatDate(currentFlight.departureTime)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Kedatangan</p>
              <p className="font-medium">{formatTime(currentFlight.arrivalTime)}</p>
              <p className="text-sm text-muted-foreground">{formatDate(currentFlight.arrivalTime)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Durasi</p>
              <p className="font-medium text-lg">{calculateFlightDuration(currentFlight.departureTime, currentFlight.arrivalTime)}</p>
            </div>
          </div>
        </motion.div>

        {/* Basic Economy Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Fitur Kelas Ekonomi</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Tempat duduk standar dengan ruang kaki yang nyaman</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Makanan dan minuman gratis selama penerbangan</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Hiburan dalam pesawat dengan layar pribadi</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Bagasi kabin 1x (maksimal 7kg)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Akses Wi-Fi dalam pesawat (terbatas)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>Program frequent flyer miles</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Airline Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Kebijakan Maskapai</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Pembersihan kabin sebelum penerbangan & filtrasi udara HEPA</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Pemeriksaan kesehatan wajib sebelum penerbangan</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Kebijakan rebooking fleksibel (dukungan COVID-19)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Gratis perubahan jadwal hingga 24 jam sebelum keberangkatan</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
}

export default FlightDetail;

interface FlightBookingModalProps {
  currentFlight: any;
  trigger?: React.ReactNode;
}

interface FlightBookingForm {
  passengerName: string;
  seatClass: string;
}

const FlightBookingModal: React.FC<FlightBookingModalProps> = ({ currentFlight, trigger }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.booking);

  const [open, setOpen] = useState(false);
  const [travelDate, setTravelDate] = useState<Date>();
  const [flightBookings, setFlightBookings] = useState<FlightBookingForm[]>([
    {
      passengerName: "",
      seatClass: "economy",
    },
  ]);

  const seatClasses = [
    { value: "economy", label: "Ekonomi" },
    { value: "business", label: "Bisnis" },
    { value: "first", label: "First Class" },
  ];

  const handleAddPassenger = () => {
    setFlightBookings([
      ...flightBookings,
      {
        passengerName: "",
        seatClass: "economy",
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (flightBookings.length > 1) {
      setFlightBookings(flightBookings.filter((_, i) => i !== index));
    }
  };

  const handlePassengerChange = (index: number, field: keyof FlightBookingForm, value: string) => {
    const updatedBookings = [...flightBookings];
    updatedBookings[index][field] = value;
    setFlightBookings(updatedBookings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!travelDate) {
      toast.error("Silakan pilih tanggal perjalanan");
      return;
    }

    if (flightBookings.some((booking) => !booking.passengerName.trim())) {
      toast.error("Silakan lengkapi nama semua penumpang");
      return;
    }

    const bookingData = {
      type: "flight" as const,
      travelDate: format(travelDate, "yyyy-MM-dd"),
      flightBookings: flightBookings.map((booking) => ({
        flightId: currentFlight.id,
        passengerName: booking.passengerName.trim(),
        seatClass: booking.seatClass,
      })),
    };

    try {
      await dispatch(createBooking(bookingData)).unwrap();
      toast.success("Booking berhasil dibuat!");
      setOpen(false);
      // Reset form
      setTravelDate(undefined);
      setFlightBookings([
        {
          passengerName: "",
          seatClass: "economy",
        },
      ]);
    } catch (error) {
      toast.error((error as string) || "Gagal membuat booking");
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalPrice = flightBookings.length * currentFlight.price;

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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pesan Penerbangan</DialogTitle>
          <DialogDescription>
            Lengkapi data penumpang untuk penerbangan {currentFlight.airlineName} dari {currentFlight.origin} ke {currentFlight.destination}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Flight Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Detail Penerbangan</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Maskapai</p>
                <p className="font-medium">{currentFlight.airlineName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rute</p>
                <p className="font-medium">
                  {currentFlight.origin} → {currentFlight.destination}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Harga per penumpang</p>
                <p className="font-medium text-green-600">{formatCurrency(currentFlight.price)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total ({flightBookings.length} penumpang)</p>
                <p className="font-medium text-green-600">{formatCurrency(totalPrice)}</p>
              </div>
            </div>
          </div>

          {/* Travel Date */}
          <div className="space-y-2">
            <Label htmlFor="travelDate">Tanggal Perjalanan *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !travelDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {travelDate ? format(travelDate, "PPP", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={travelDate}
                  onSelect={setTravelDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Flight Bookings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Data Penumpang</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPassenger}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Penumpang
              </Button>
            </div>

            {flightBookings.map((booking, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Penumpang {index + 1}</h4>
                  {flightBookings.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePassenger(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`passengerName-${index}`}>Nama Penumpang *</Label>
                    <Input
                      id={`passengerName-${index}`}
                      value={booking.passengerName}
                      onChange={(e) => handlePassengerChange(index, "passengerName", e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`seatClass-${index}`}>Kelas Kursi</Label>
                    <Select
                      value={booking.seatClass}
                      onValueChange={(value) => handlePassengerChange(index, "seatClass", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kelas kursi" />
                      </SelectTrigger>
                      <SelectContent>
                        {seatClasses.map((seatClass) => (
                          <SelectItem
                            key={seatClass.value}
                            value={seatClass.value}
                          >
                            {seatClass.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Price Summary */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Pembayaran</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalPrice)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {flightBookings.length} penumpang × {formatCurrency(currentFlight.price)}
            </p>
          </div>

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
              disabled={loading}
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
