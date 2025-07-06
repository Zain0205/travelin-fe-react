import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, AlertCircle, Calendar, CreditCard, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getBookings, updateBookingStatus, getBookingById, clearError } from "@/redux/slices/bookingSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import LoadingSkeleton from "../components/LoadingSkeleton";

function AgentBooking() {
  const dispatch = useAppDispatch();
  const { bookings, loading, error, pagination, currentBooking } = useAppSelector((state) => state.booking);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    type: "",
  });
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    loadBookings();
  }, [currentPage, filters]);

  const loadBookings = () => {
    dispatch(
      getBookings({
        page: currentPage,
        limit: 10,
        ...filters,
      })
    );
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await dispatch(updateBookingStatus({ id, status: newStatus })).unwrap();
      loadBookings();
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const handleViewDetail = async (id: number) => {
    setSelectedBookingId(id);
    try {
      await dispatch(getBookingById(id)).unwrap();
      setIsDetailDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch booking detail:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "outline", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
      rejected: { variant: "destructive", label: "Rejected" },
      refunded: { variant: "secondary", label: "Refunded" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: "outline", label: status };
    return <Badge className="w-full" variant={config.variant as any}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      unpaid: { variant: "destructive", label: "Unpaid" },
      paid: { variant: "default", label: "Paid" },
      refund_pending: { variant: "outline", label: "Refund Pending" },
      refunded: { variant: "secondary", label: "Refunded" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: "outline", label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      package: { variant: "default", label: "Package", icon: <MapPin className="w-3 h-3" /> },
      hotel: { variant: "outline", label: "Hotel", icon: <Calendar className="w-3 h-3" /> },
      flight: { variant: "secondary", label: "Flight", icon: <Users className="w-3 h-3" /> },
      custom: { variant: "destructive", label: "Custom", icon: <CreditCard className="w-3 h-3" /> },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || { variant: "outline", label: type, icon: null };
    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">Manage customer bookings and reservations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.paymentStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Payment</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="refund_pending">Refund Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Booking Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="package">Package</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
            <SelectItem value="flight">Flight</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(clearError())}
              className="ml-2"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => <LoadingSkeleton key={index} />)
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No bookings found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">#{booking.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(booking.bookingDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">User #{booking.userId}</div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(booking.type)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {formatDate(booking.travelDate)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(booking.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              {getStatusBadge(booking.status)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(booking.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details #{currentBooking?.id}</DialogTitle>
          </DialogHeader>
          
          {currentBooking && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Booking Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking ID:</span>
                      <span>#{currentBooking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer ID:</span>
                      <span>#{currentBooking.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{getTypeBadge(currentBooking.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking Date:</span>
                      <span>{formatDateTime(currentBooking.bookingDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Travel Date:</span>
                      <span>{formatDate(currentBooking.travelDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Status & Payment</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusBadge(currentBooking.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status:</span>
                      <span>{getPaymentStatusBadge(currentBooking.paymentStatus)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Price:</span>
                      <span className="font-medium">{formatPrice(currentBooking.totalPrice)}</span>
                    </div>
                    {currentBooking.cancelledAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cancelled At:</span>
                        <span>{formatDateTime(currentBooking.cancelledAt)}</span>
                      </div>
                    )}
                    {currentBooking.cancellationReason && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cancellation Reason:</span>
                        <span>{currentBooking.cancellationReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Package Details */}
              {currentBooking.type === 'package' && currentBooking.travelPackage && (
                <div>
                  <h3 className="font-semibold mb-2">Package Details</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm space-y-1">
                      <div className="font-medium">{currentBooking.travelPackage.name}</div>
                      <div className="text-muted-foreground">{currentBooking.travelPackage.description}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hotel Bookings */}
              {currentBooking.bookingHotels && currentBooking.bookingHotels.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Hotel Bookings</h3>
                  <div className="space-y-2">
                    {currentBooking.bookingHotels.map((hotel, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg text-sm">
                        <div className="font-medium">{hotel.hotel?.name || 'Hotel'}</div>
                        <div className="text-muted-foreground">
                          Check-in: {formatDate(hotel.checkInDate)} | Check-out: {formatDate(hotel.checkOutDate)}
                        </div>
                        <div className="text-muted-foreground">
                          {hotel.nights} nights | {formatPrice(hotel.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Flight Bookings */}
              {currentBooking.bookingFlights && currentBooking.bookingFlights.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Flight Bookings</h3>
                  <div className="space-y-2">
                    {currentBooking.bookingFlights.map((flight, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg text-sm">
                        <div className="font-medium">{flight.flight?.airlineName || 'Flight'}</div>
                        <div className="text-muted-foreground">
                          {flight.flight?.origin} → {flight.flight?.destination}
                        </div>
                        <div className="text-muted-foreground">
                          Passenger: {flight.passengerName} | Class: {flight.seatClass}
                        </div>
                        <div className="text-muted-foreground">
                          {formatPrice(flight.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments */}
              {currentBooking.payments && currentBooking.payments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Payment History</h3>
                  <div className="space-y-2">
                    {currentBooking.payments.map((payment, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg text-sm">
                        <div className="flex justify-between">
                          <span>Payment #{payment.id}</span>
                          <span className="font-medium">{formatPrice(payment.amount)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Method: {payment.method}</span>
                          <span>Status: {payment.status}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {formatDateTime(payment.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refund Info */}
              {currentBooking.refund && (
                <div>
                  <h3 className="font-semibold mb-2">Refund Information</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Refund Amount:</span>
                        <div className="font-medium">{formatPrice(currentBooking.refund.amount)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Original Amount:</span>
                        <div>{formatPrice(currentBooking.refund.originalAmount)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div>{getStatusBadge(currentBooking.refund.status)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reason:</span>
                        <div>{currentBooking.refund.reason}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default AgentBooking;