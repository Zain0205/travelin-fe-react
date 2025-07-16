import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Edit, MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchHotels, deleteHotel, clearError } from "@/redux/slices/hotelSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

function AgentHotel() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { hotels, loading, error, pagination } = useSelector((state: RootState) => state.hotel);

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
    dispatch(
      fetchHotels({
        pagination: { page: 1, limit: 10 },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteHotel(id)).unwrap();
      toast.success("Hotel deleted successfully");
    } catch (error) {
      toast.error("Failed to delete hotel");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/agent/hotels/edit/${id}`);
  };

  const handleAddHotel = () => {
    navigate("/agent/hotels/add");
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
          <h2 className="text-2xl font-bold">Hotel Partnerships</h2>
          <p className="text-muted-foreground">Manage your hotel affiliations</p>
        </div>
        <Button onClick={handleAddHotel}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading hotels...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price/Night</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotels.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No hotels found. Click "Add Hotel" to create your first hotel partnership.
                      </TableCell>
                    </TableRow>
                  ) : (
                    hotels.map((hotel: any) => {
                      return (
                        <TableRow key={hotel.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {hotel.thumbnail && (
                                <img
                                  src={`https://travelin.noxturne.my.id/${hotel.thumbnail}`}
                                  alt={hotel.name}
                                  className="w-12 h-12 object-cover rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48";
                                  }}
                                />
                              )}
                              <div>
                                <span className="font-medium">{hotel.name}</span>
                                {hotel.description && <p className="text-sm text-muted-foreground truncate max-w-xs">{hotel.description}</p>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                              {hotel.location}
                            </div>
                          </TableCell>
                          <TableCell>Rp {hotel.pricePerNight.toLocaleString("id-ID")}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(hotel.id)}
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
                                    <AlertDialogAction onClick={() => handleDelete(hotel.id)}>Continue</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination if needed */}
      {pagination.totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-2"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1 || loading}
            onClick={() =>
              dispatch(
                fetchHotels({
                  pagination: { page: pagination.page - 1, limit: pagination.limit },
                })
              )
            }
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === pagination.totalPages || loading}
            onClick={() =>
              dispatch(
                fetchHotels({
                  pagination: { page: pagination.page + 1, limit: pagination.limit },
                })
              )
            }
          >
            Next
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AgentHotel;
