"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Footer from "@/pages/landing-page/Footer";
import Navbar from "@/pages/landing-page/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchTravelPackageById, clearCurrentPackage, clearError } from "@/redux/slices/travelPackageSlice";
import { createBooking } from "@/redux/slices/bookingSlice";
import { 
  Loader2, 
  ArrowLeft, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Plane,
  Camera,
  Mountain,
  Utensils,
  Shield,
  Car,
  CalendarIcon,
  Minus,
  Plus
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PackageImage {
  id: number;
  fileUrl: string;
  packageId: number;
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

const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = start.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
  });
  
  const endFormatted = end.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  
  return `${startFormatted} - ${endFormatted}`;
};

function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { currentPackage, loading, error } = useAppSelector((state) => state.travelPackage);
  console.log(currentPackage)

  useEffect(() => {
    if (id) {
      dispatch(fetchTravelPackageById(parseInt(id)));
    }

    return () => {
      dispatch(clearCurrentPackage());
      dispatch(clearError());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPackage?.thumbnail) {
      setSelectedImage(`http://localhost:3000/${currentPackage.thumbnail}`);
    }
  }, [currentPackage]);

  const handleBackToPackages = () => {
    navigate("/travel-package/listing");
  };

  const handleImageSelect = (imagePath: string) => {
    // Jika imagePath sudah berupa URL lengkap, gunakan langsung
    if (imagePath.startsWith('http')) {
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
            <p className="text-muted-foreground">Memuat detail paket wisata...</p>
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
              onClick={handleBackToPackages}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Paket Wisata
            </Button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (!currentPackage) {
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
            <h2 className="text-xl font-semibold">Paket Wisata Tidak Ditemukan</h2>
            <p className="text-muted-foreground">Paket wisata yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Button
              onClick={handleBackToPackages}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Paket Wisata
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
            onClick={handleBackToPackages}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Paket Wisata
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
            <h1 className="text-3xl font-bold tracking-tight">{currentPackage.title}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{currentPackage.location}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{currentPackage.duration} hari</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{currentPackage.quota} orang</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateRange(currentPackage.startDate, currentPackage.endDate)}</span>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <p className="text-3xl font-bold text-green-600">{formatCurrency(currentPackage.price)}</p>
            <p className="text-sm text-muted-foreground">per orang</p>
            <PackageBookingModal
              currentPackage={currentPackage}
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
              alt={`${currentPackage.title} Package`}
              className="w-full h-64 md:h-96 object-cover cursor-pointer"
              onError={(e) => {
                console.error("Image failed to load:", selectedImage);
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <div className="text-center">
                <div className="text-4xl mb-2">🏞️</div>
                <p className="text-gray-600 font-medium">{currentPackage.title}</p>
                <p className="text-gray-400 text-sm">{currentPackage.location}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Package Images Gallery */}
        {currentPackage?.packageImages && currentPackage.packageImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Galeri Foto</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {/* Thumbnail as first image */}
              {currentPackage.thumbnail && (
                <div
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    selectedImage === `http://localhost:3000/${currentPackage.thumbnail}` 
                      ? 'ring-2 ring-green-500 ring-offset-2' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => handleImageSelect(currentPackage.thumbnail)}
                >
                  <img
                    src={`http://localhost:3000/${currentPackage.thumbnail}`}
                    alt={`${currentPackage.title} thumbnail`}
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      console.error("Thumbnail failed to load:", currentPackage.thumbnail);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              
              {/* Additional package images */}
              {currentPackage.packageImages.map((imageObj: PackageImage, index: number) => (
                <div
                  key={imageObj.id || index}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                    selectedImage === `http://localhost:3000/${imageObj.fileUrl}` 
                      ? 'ring-2 ring-green-500 ring-offset-2' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => handleImageSelect(imageObj.fileUrl)}
                >
                  <img
                    src={`http://localhost:3000/${imageObj.fileUrl}`}
                    alt={`${currentPackage.title} image ${index + 1}`}
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

        {/* Package Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Informasi Paket Wisata</h2>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nama Paket</p>
              <p className="font-medium text-lg">{currentPackage.title}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Destinasi</p>
              <p className="font-medium text-lg">{currentPackage.location}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Harga per Orang</p>
              <p className="font-medium text-lg text-green-600">{formatCurrency(currentPackage.price)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Durasi</p>
              <p className="font-medium text-lg">{currentPackage.duration} hari</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Kuota Peserta</p>
              <p className="font-medium text-lg">{currentPackage.quota} orang</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tanggal Keberangkatan</p>
              <p className="font-medium text-lg">{formatDate(currentPackage.startDate)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tanggal Kembali</p>
              <p className="font-medium text-lg">{formatDate(currentPackage.endDate)}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium text-lg text-blue-600">Tersedia</p>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        {currentPackage.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold">Deskripsi Paket</h2>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentPackage.description}
              </p>
            </div>
          </motion.div>
        )}

        {/* Package Includes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Fasilitas Termasuk</h2>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Plane className="h-5 w-5 text-green-600" />
                <span className="text-sm">Transportasi PP</span>
              </div>
              <div className="flex items-center space-x-3">
                <Utensils className="h-5 w-5 text-green-600" />
                <span className="text-sm">Makan 3x sehari</span>
              </div>
              <div className="flex items-center space-x-3">
                <Camera className="h-5 w-5 text-green-600" />
                <span className="text-sm">Dokumentasi</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mountain className="h-5 w-5 text-green-600" />
                <span className="text-sm">Tiket Masuk Wisata</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm">Asuransi Perjalanan</span>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-green-600" />
                <span className="text-sm">Tour Guide</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Package Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Syarat & Ketentuan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">ℹ️</span>
                <span>Pembayaran DP minimal 50% dari total harga</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">ℹ️</span>
                <span>Pembatalan 7 hari sebelum keberangkatan dikenakan biaya 25%</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">ℹ️</span>
                <span>Wajib membawa KTP/identitas resmi</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">ℹ️</span>
                <span>Kondisi kesehatan baik dan tidak memiliki penyakit menular</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">ℹ️</span>
                <span>Mengikuti protokol kesehatan yang berlaku</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">ℹ️</span>
                <span>Jadwal dapat berubah sesuai kondisi cuaca</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
}

export default PackageDetail;

interface PackageBookingModalProps {
  currentPackage: any;
  trigger?: React.ReactNode;
}


const PackageBookingModal: React.FC<PackageBookingModalProps> = ({ currentPackage, trigger }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.booking);

  const [open, setOpen] = useState(false);
  const [participants, setParticipants] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>("");

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalPrice = (): number => {
    return participants * currentPackage.price;
  };

  const handleParticipantsChange = (change: number) => {
    const newValue = participants + change;
    if (newValue >= 1 && newValue <= currentPackage.quota) {
      setParticipants(newValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (participants < 1) {
      toast.error("Minimal 1 peserta");
      return;
    }

    if (participants > currentPackage.quota) {
      toast.error(`Maksimal ${currentPackage.quota} peserta`);
      return;
    }

    const bookingData: any = {
      type: "package" as const,
      packages: [
        {
          travelDate: currentPackage.startDate,
          packageId: currentPackage.id,
          participants: participants,
          specialRequests: specialRequests || null,
        },
      ],
    };

    try {
      await dispatch(createBooking(bookingData)).unwrap();
      toast.success("Booking paket wisata berhasil dibuat!");
      setOpen(false);
      // Reset form
      setParticipants(1);
      setSpecialRequests("");
    } catch (error) {
      toast.error((error as string) || "Gagal membuat booking");
    }
  };

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
          <DialogTitle>Pesan Paket Wisata</DialogTitle>
          <DialogDescription>
            Lengkapi detail booking untuk paket wisata {currentPackage.title} ke {currentPackage.location}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Package Summary */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Detail Paket Wisata</h3>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Paket Wisata</p>
                <p className="font-medium">{currentPackage.title}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Destinasi</p>
                <p className="font-medium">{currentPackage.location}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Durasi</p>
                  <p className="font-medium">{currentPackage.duration} hari</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kuota Tersedia</p>
                  <p className="font-medium">{currentPackage.quota} orang</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Tanggal Berangkat</p>
                  <p className="font-medium">{formatDate(currentPackage.startDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Kembali</p>
                  <p className="font-medium">{formatDate(currentPackage.endDate)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Harga per orang</p>
                  <p className="font-medium text-green-600">{formatCurrency(currentPackage.price)}</p>
                </div>
                {participants > 0 && (
                  <div>
                    <p className="text-muted-foreground">Total ({participants} orang)</p>
                    <p className="font-medium text-green-600">{formatCurrency(totalPrice)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Number of Participants */}
          <div className="space-y-2">
            <Label htmlFor="participants">Jumlah Peserta *</Label>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleParticipantsChange(-1)}
                disabled={participants <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Input
                  id="participants"
                  type="number"
                  min={1}
                  max={currentPackage.quota}
                  value={participants}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= currentPackage.quota) {
                      setParticipants(value);
                    }
                  }}
                  className="text-center"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleParticipantsChange(1)}
                disabled={participants >= currentPackage.quota}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Maksimal {currentPackage.quota} peserta untuk paket ini
            </p>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Permintaan Khusus (Opsional)</Label>
            <Textarea
              id="specialRequests"
              placeholder="Contoh: Makanan vegetarian, akomodasi khusus, dll."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              Tuliskan permintaan khusus Anda jika ada
            </p>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Ringkasan Booking</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Jumlah peserta</span>
                <span className="font-medium">{participants} orang</span>
              </div>
              <div className="flex justify-between">
                <span>Harga per orang</span>
                <span className="font-medium">{formatCurrency(currentPackage.price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Durasi perjalanan</span>
                <span className="font-medium">{currentPackage.duration} hari</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal keberangkatan</span>
                <span className="font-medium">{formatDate(currentPackage.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal kembali</span>
                <span className="font-medium">{formatDate(currentPackage.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Total Price Summary */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Pembayaran</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalPrice)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {participants} orang × {formatCurrency(currentPackage.price)}
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
              disabled={loading || participants <= 0}
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
