import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Plus, MapPin, Trash2, Eye, Edit, Calendar, Users, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchTravelPackages, deleteTravelPackage, clearError } from "@/redux/slices/travelPackageSlice";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import LoadingSkeleton from "../components/LoadingSkeleton";

function AgentTravelPackage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { packages, loading, error, meta } = useAppSelector((state) => state.travelPackage);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

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
    dispatch(fetchTravelPackages({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleDelete = async (id: number) => {
    setDeleteLoading(id);
    try {
      await dispatch(deleteTravelPackage(id)).unwrap();
      // Refresh the list after deletion
      dispatch(fetchTravelPackages({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error("Failed to delete package:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleView = (id: number) => {
    navigate(`/agent/packages/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/agent/packages/edit/${id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return <Badge variant="secondary">Upcoming</Badge>;
    } else if (now >= start && now <= end) {
      return <Badge variant="default">Active</Badge>;
    } else {
      return <Badge variant="outline">Completed</Badge>;
    }
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
          <h2 className="text-2xl font-bold">Travel Packages</h2>
          <p className="text-muted-foreground">Manage your travel packages ({meta.total} total packages)</p>
        </div>
        <Button onClick={() => navigate("/agent/packages/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Package
        </Button>
      </div>

      {error && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => <LoadingSkeleton key={index} />)
                ) : packages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No travel packages found</p>
                        <Button
                          variant="outline"
                          onClick={() => navigate("/agent/packages/add")}
                        >
                          Create your first package
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg: any) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={`http://localhost:3000/${pkg.thumbnail}`}
                            alt={pkg.title}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://github.com/shadcn.png";
                            }}
                          />
                          <div>
                            <p className="font-medium">{pkg.title}</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Users className="mr-1 h-3 w-3" />
                              {pkg.quota} spots
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                          {pkg.location}
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(pkg.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          {pkg.duration} days
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(pkg.startDate)}</div>
                          <div className="text-muted-foreground">to {formatDate(pkg.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(pkg.startDate.toString(), pkg.endDate.toString())}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(pkg.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pkg.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={deleteLoading === pkg.id}
                              >
                                {deleteLoading === pkg.id ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(pkg.id)}>Continue</AlertDialogAction>
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
        <motion.div variants={itemVariants}>
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {currentPage} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(meta.totalPages, prev + 1))}
              disabled={currentPage === meta.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AgentTravelPackage;
