import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Trash2, AlertCircle, Plane } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchFlights, deleteFlight, clearError } from "@/redux/slices/flightSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "../components/LoadingSkeleton";

function AgentFlight() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { flights, loading, error, meta } = useAppSelector((state) => state.flight);

  console.log("Flights:", flights);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    airlineName: "",
    origin: "",
    destination: "",
  });

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
    loadFlights();
  }, [currentPage]);

  const loadFlights = () => {
    dispatch(
      fetchFlights({
        pagination: { page: currentPage, limit: 10 },
        filters: filters,
      })
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteFlight(id)).unwrap();
      loadFlights(); 
    } catch (error) {
      console.error("Failed to delete flight:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/agent/flights/edit/${id}`);
  };

  const handleAddFlight = () => {
    navigate("/agent/flights/add");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("id-ID");
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
          <h2 className="text-2xl font-bold">Flight Partnerships</h2>
          <p className="text-muted-foreground">Manage your flight affiliations</p>
        </div>
        <Button onClick={handleAddFlight}>
          <Plus className="mr-2 h-4 w-4" />
          Add Flight
        </Button>
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
                  <TableHead>Airline</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => <LoadingSkeleton key={index} />)
                ) : flights.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <Plane className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No flights found</p>
                        <Button variant="outline" onClick={handleAddFlight}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Flight
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  flights.map((flight) => (
                    <TableRow key={flight.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {flight.thumnail && (
                            <img
                              src={`http://localhost:3000/${flight.thumnail}`}
                              alt={flight.airlineName}
                              className="w-10 h-10 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                          <span className="font-medium">{flight.airlineName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {flight.origin} → {flight.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{formatTime(flight.departureTime)}</div>
                          <div className="text-muted-foreground">{formatDate(flight.departureTime)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{formatTime(flight.arrivalTime)}</div>
                          <div className="text-muted-foreground">{formatDate(flight.arrivalTime)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatPrice(flight.price)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{flight.agent?.name}</div>
                          <div className="text-muted-foreground">{flight.agent?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(flight.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(flight.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Pagination */}
      {meta.totalPages > 1 && (
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
            Page {currentPage} of {meta.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(meta.totalPages, prev + 1))}
            disabled={currentPage === meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default AgentFlight;
