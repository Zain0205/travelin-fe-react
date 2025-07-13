import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { checkAuthStatus } from "@/redux/slices/authSlice";
import { getBookings, cancelBooking, requestReschedule, clearError } from "@/redux/slices/bookingSlice";
import { processPayment, clearPaymentError, clearMidtransResponse } from "@/redux/slices/paymentSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  User,
  Eye,
  MessageCircle,
  CreditCard,
  Calendar,
  Plane,
  Building2,
  Package,
  Heart,
  Star,
  Clock,
  X,
  RefreshCw,
  AlertCircle,
  Loader2,
  QrCode,
  Wallet,
  CreditCardIcon,
  Banknote,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "../landing-page/Navbar";
import Footer from "../landing-page/Footer";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const paymentMethods = [
  { value: "qris", label: "QRIS", icon: <QrCode /> },
  { value: "e_wallet", label: "E-Wallet", icon: <Wallet /> },
  { value: "credit_card", label: "Credit Card", icon: <CreditCardIcon /> },
  { value: "bank_transfer", label: "Bank Transfer", icon: <Banknote /> },
];

function CustomerProfile() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("account");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Action dialogs state
  const [cancelDialog, setCancelDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<"cancel" | "refund" | "reschedule" | null>(null);

  // Form states
  const [cancelReason, setCancelReason] = useState("");
  const [requestRefund, setRequestRefund] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");

  const { user: profile, isLoading: profileLoading } = useAppSelector((state) => state.auth);
  const { bookings, loading: bookingsLoading, error } = useAppSelector((state) => state.booking);
  console.log("Selected booking:", selectedBooking);
  const { processingPayment, midtransResponse, error: paymentError, currentPayment } = useAppSelector((state) => state.payment);
  console.log(midtransResponse);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuthStatus());
    dispatch(
      getBookings({
        page: 1,
        limit: 10,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError);
      dispatch(clearPaymentError());
    }
  }, [paymentError, dispatch]);

  // Handle Midtrans redirect
  useEffect(() => {
    if (midtransResponse && midtransResponse.redirect_url) {
      setDialogOpen(false);
      toast.success("Payment initialized successfully! Redirecting to payment page...");

      setTimeout(() => {
        navigate(midtransResponse.redirect_url);
      }, 1000);

      dispatch(clearMidtransResponse());
    }
  }, [midtransResponse, dispatch]);

  const getBookingIcon = (type: any) => {
    switch (type) {
      case "flight":
        return <Plane className="w-5 h-5 text-blue-500" />;
      case "hotel":
        return <Building2 className="w-5 h-5 text-green-500" />;
      case "package":
        return <Package className="w-5 h-5 text-purple-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "refunded":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: any) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "unpaid":
        return "bg-red-50 text-red-700 border-red-200";
      case "refund_pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "refunded":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: any) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: any) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
    setSelectedPaymentMethod(""); // Reset payment method selection
  };

  const handleChatAgent = () => {
    const agentId = selectedBooking?.bookingHotels[0]?.hotel.agentId || selectedBooking?.bookingFlights[0]?.flight?.agentId || selectedBooking.travelPackage.agentId;

    console.log("Agent ID:", agentId);
    if (agentId) {
      navigate(`/chat/${agentId}`);
    } else {
      console.log("Agent information not available");
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!selectedBooking) {
      toast.error("No booking selected");
      return;
    }

    try {
      // Prepare payment data
      const paymentData: any = {
        bookingId: selectedBooking.id,
        amount: selectedBooking.totalPrice,
        method: selectedPaymentMethod,
        customerDetails: {
          first_name: profile?.name?.split(" ")[0] || "Customer",
          last_name: profile?.name?.split(" ").slice(1).join(" ") || "",
          email: profile?.email || "",
          phone: profile?.phone || "",
        },
        itemDetails: [
          {
            id: `booking_${selectedBooking.id}`,
            price: selectedBooking.totalPrice,
            quantity: 1,
            name: selectedBooking.travelPackage?.name || `${selectedBooking.type} booking`,
            category: selectedBooking.type,
          },
        ],
        transactionDetails: {
          order_id: `booking_${selectedBooking.id}_${Date.now()}`,
          gross_amount: selectedBooking.totalPrice,
        },
      };

      // Dispatch payment processing
      const result = await dispatch(processPayment(paymentData)).unwrap();

      // Success will be handled by useEffect watching midtransResponse
      console.log("Payment processing result:", result);
      setTimeout(() => {
        setDialogOpen(false);
        toast.success("Payment processing started! Please check your payment method.");

        window.location.href = result.midtrans.redirectUrl;
        // navigate(result.midtrans.redirectUrl)
      }, 1000);
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error || "Failed to process payment");
    }
  };

  const handleRemoveFromFavorites = (favoriteId: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
  };

  // Action handlers
  const handleCancelBooking = (booking: any) => {
    setSelectedBooking(booking);
    setActionType("cancel");
    setCancelDialog(true);
  };

  const handleRequestRefund = (booking: any) => {
    setSelectedBooking(booking);
    setActionType("refund");
    setRefundDialog(true);
  };

  const handleRequestReschedule = (booking: any) => {
    setSelectedBooking(booking);
    setActionType("reschedule");
    setRescheduleDialog(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBooking || !cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    try {
      await dispatch(
        cancelBooking({
          bookingId: selectedBooking.id,
          reason: cancelReason,
          requestRefund: requestRefund,
        })
      ).unwrap();

      toast.success("Booking cancelled successfully");
      setCancelDialog(false);
      setCancelReason("");
      setRequestRefund(false);

      // Refresh bookings
      dispatch(getBookings({ page: 1, limit: 10 }));
    } catch (error: any) {
      toast.error(error || "Failed to cancel booking");
    }
  };

  const confirmRequestRefund = async () => {
    if (!selectedBooking || !refundReason.trim()) {
      toast.error("Please provide a refund reason");
      return;
    }

    try {
      await dispatch(
        requestRefund({
          bookingId: selectedBooking.id,
          reason: refundReason,
        })
      ).unwrap();

      toast.success("Refund request submitted successfully");
      setRefundDialog(false);
      setRefundReason("");

      // Refresh bookings
      dispatch(getBookings({ page: 1, limit: 10 }));
    } catch (error: any) {
      toast.error(error || "Failed to request refund");
    }
  };

  const confirmRequestReschedule = async () => {
    if (!selectedBooking || !rescheduleDate) {
      toast.error("Please select a new travel date");
      return;
    }

    try {
      await dispatch(
        requestReschedule({
          bookingId: selectedBooking.id,
          requestedDate: rescheduleDate,
        })
      ).unwrap();

      toast.success("Reschedule request submitted successfully");
      setRescheduleDialog(false);
      setRescheduleDate("");

      // Refresh bookings
      dispatch(getBookings({ page: 1, limit: 10 }));
    } catch (error: any) {
      toast.error(error || "Failed to request reschedule");
    }
  };

  // Check if actions are available for booking
  const canCancelBooking = (booking: any) => {
    return booking.status === "confirmed" || booking.status === "pending";
  };

  const canRequestRefund = (booking: any) => {
    return booking.paymentStatus === "paid" && booking.status !== "cancelled";
  };

  const canRequestReschedule = (booking: any) => {
    return booking.status === "confirmed" || booking.status === "pending";
  };

  if (profileLoading || bookingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen dark:bg-black pt-20 pb-38 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
            <div className="flex flex-col items-center">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage
                  src={profile?.avatar || "/api/placeholder/80/80"}
                  alt={profile?.name || "User"}
                />
                <AvatarFallback className="bg-teal-600 text-white text-xl">{profile?.name?.charAt(0)?.toUpperCase() || profile?.email?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">{profile?.name || profile?.email?.split("@")[0] || "User"}</h1>
              <p className="text-gray-600">{profile?.email || "No email available"}</p>
            </div>
          </div>

          {/* Tabs Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent
              value="account"
              className="space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Account Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Name</p>
                          <p className="text-sm text-gray-500">{profile?.name || "Not set"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-gray-500">{profile?.email || "Not set"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-sm text-gray-500">{profile?.phone || "Not set"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-sm text-gray-500">{profile?.address || "Not set"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <CalendarDays className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Join Date</p>
                          <p className="text-sm text-gray-500">{formatDate(profile?.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent
              value="bookings"
              className="space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">My Bookings</h2>
                    <Badge variant="secondary">{bookings?.length || 0} Total</Badge>
                  </div>

                  <div className="space-y-4">
                    {!bookings || bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No bookings found</p>
                      </div>
                    ) : (
                      bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center dark:hover:bg-slate-700 justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">{getBookingIcon(booking.type)}</div>
                            <div>
                              <p className="font-medium capitalize">{booking.type}</p>
                              <p className="text-sm text-gray-500">{booking.travelPackage?.name || `${booking.type} booking`}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <p className="text-sm font-medium">{formatDate(booking.travelDate)}</p>
                              <p className="text-xs text-gray-500">Travel Date</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">{formatCurrency(booking.totalPrice)}</p>
                              <p className="text-xs text-gray-500">Total</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Badge
                                variant="outline"
                                className={getStatusColor(booking.status)}
                              >
                                {booking.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getPaymentStatusColor(booking.paymentStatus)}
                              >
                                {booking.paymentStatus}
                              </Badge>
                            </div>

                            <div className="">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <MoreHorizontal />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleBookingClick(booking)}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Button>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {canCancelBooking(booking) && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCancelBooking(booking)}
                                        className="text-red-600 hover:text-red-700 border-red-200"
                                      >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                      </Button>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {canRequestReschedule(booking) && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRequestReschedule(booking)}
                                        className="text-blue-600 hover:text-blue-700 border-blue-200"
                                      >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reschedule
                                      </Button>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {canRequestRefund(booking) && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRequestRefund(booking)}
                                        className="text-green-600 hover:text-green-700 border-green-200"
                                      >
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Request Refund
                                      </Button>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent
              value="favorites"
              className="space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">My Favorites</h2>
                    <Badge variant="secondary">{favorites.length} Items</Badge>
                  </div>

                  <div className="space-y-4">
                    {favorites.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No favorites added yet</p>
                        <p className="text-sm text-gray-400 mt-2">Start exploring and save your favorite destinations</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favorites.map((favorite) => (
                          <div
                            key={favorite.id}
                            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div className="relative">
                              <img
                                src={favorite.image}
                                alt={favorite.name}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-3 right-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveFromFavorites(favorite.id)}
                                  className="bg-white/80 hover:bg-white text-red-500 hover:text-red-600 border-red-200"
                                >
                                  <Heart className="w-4 h-4 fill-current" />
                                </Button>
                              </div>
                              <div className="absolute top-3 left-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-white/80 text-gray-700 capitalize"
                                >
                                  {favorite.type}
                                </Badge>
                              </div>
                            </div>

                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg">{favorite.name}</h3>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm font-medium">{favorite.rating}</span>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-3">{favorite.description}</p>

                              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{favorite.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{favorite.duration}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-lg font-bold text-green-600">{formatCurrency(favorite.price)}</p>
                                  <p className="text-xs text-gray-500">Added {formatDate(favorite.addedAt)}</p>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Book Now</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Booking Details Dialog */}
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
              </DialogHeader>

              {selectedBooking && (
                <div className="space-y-6">
                  {/* Booking Header */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">{getBookingIcon(selectedBooking.type)}</div>
                      <div>
                        <p className="font-semibold capitalize">{selectedBooking.type} Booking</p>
                        <p className="text-sm text-gray-500">Booking ID: #{selectedBooking.id}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge
                        variant="outline"
                        className={getStatusColor(selectedBooking.status)}
                      >
                        {selectedBooking.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getPaymentStatusColor(selectedBooking.paymentStatus)}
                      >
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Package/Service</p>
                        <p className="text-gray-900">{selectedBooking.travelPackage?.name || `${selectedBooking.type} booking`}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Travel Date</p>
                        <p className="text-gray-900">{formatDate(selectedBooking.travelDate)}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Number of Travelers</p>
                        <p className="text-gray-900">{selectedBooking.numberOfTravelers || 1} person(s)</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Booking Date</p>
                        <p className="text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total Price</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(selectedBooking.totalPrice)}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Payment Status</p>
                        <Badge
                          variant="outline"
                          className={getPaymentStatusColor(selectedBooking.paymentStatus)}
                        >
                          {selectedBooking.paymentStatus}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700">Booking Status</p>
                        <Badge
                          variant="outline"
                          className={getStatusColor(selectedBooking.status)}
                        >
                          {selectedBooking.status}
                        </Badge>
                      </div>

                      {selectedBooking.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notes</p>
                          <p className="text-gray-900">{selectedBooking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">Special Requests</p>
                      <p className="text-blue-800">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  {/* Payment Section - Only show if payment is unpaid */}
                  {selectedBooking.paymentStatus === "unpaid" && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="payment-method">Select Payment Method</Label>
                          <Select
                            value={selectedPaymentMethod}
                            onValueChange={setSelectedPaymentMethod}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem
                                  key={method.value}
                                  value={method.value}
                                >
                                  <div className="flex items-center space-x-2">
                                    <span>{method.icon}</span>
                                    <span>{method.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Total Amount:</span>
                            <span className="text-xl font-bold text-green-600">{formatCurrency(selectedBooking.totalPrice)}</span>
                          </div>
                        </div>

                        <Button
                          onClick={handlePayment}
                          disabled={!selectedPaymentMethod || processingPayment}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processingPayment ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleChatAgent}
                  className="mr-auto"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Agent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Cancel Booking Dialog */}
          <AlertDialog
            open={cancelDialog}
            onOpenChange={setCancelDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to cancel this booking? This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="cancel-reason">Reason for cancellation</Label>
                  <Textarea
                    id="cancel-reason"
                    placeholder="Please provide a reason for cancellation..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="request-refund"
                    checked={requestRefund}
                    onChange={(e) => setRequestRefund(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor="request-refund"
                    className="text-sm"
                  >
                    Request refund (if applicable)
                  </Label>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmCancelBooking}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={!cancelReason.trim()}
                >
                  Confirm Cancellation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Refund Request Dialog */}
          <AlertDialog
            open={refundDialog}
            onOpenChange={setRefundDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Request Refund</AlertDialogTitle>
                <AlertDialogDescription>Please provide details for your refund request. Our team will review it within 3-5 business days.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="refund-reason">Reason for refund</Label>
                  <Textarea
                    id="refund-reason"
                    placeholder="Please explain why you are requesting a refund..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Refund processing may take 7-14 business days depending on your payment method.
                  </p>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmRequestRefund}
                  disabled={!refundReason.trim()}
                >
                  Submit Refund Request
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Reschedule Request Dialog */}
          <AlertDialog
            open={rescheduleDialog}
            onOpenChange={setRescheduleDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Request Reschedule</AlertDialogTitle>
                <AlertDialogDescription>Please select your preferred new travel date. Additional fees may apply.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="reschedule-date">New Travel Date</Label>
                  <Input
                    id="reschedule-date"
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Reschedule requests are subject to availability and may incur additional charges.
                  </p>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmRequestReschedule}
                  disabled={!rescheduleDate}
                >
                  Submit Reschedule Request
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CustomerProfile;
