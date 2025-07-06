import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { 
  fetchTravelPackageById, 
  updateTravelPackage, 
  clearError, 
  clearCurrentPackage 
} from "@/redux/slices/travelPackageSlice";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  title: string;
  location: string;
  description: string;
  price: string;
  duration: string;
  quota: string;
  startDate: string;
  endDate: string;
  thumbnail: File | null;
  packageImages: File[];
}

function EditPackage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentPackage, loading, error } = useAppSelector((state) => state.travelPackage);
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    location: "",
    description: "",
    price: "",
    duration: "",
    quota: "",
    startDate: "",
    endDate: "",
    thumbnail: null,
    packageImages: [],
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [packageImagesPreview, setPackageImagesPreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [isFormLoaded, setIsFormLoaded] = useState(false);

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

  // Fetch package data on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchTravelPackageById(parseInt(id)));
    }
    
    // Cleanup current package on unmount
    return () => {
      dispatch(clearCurrentPackage());
    };
  }, [dispatch, id]);

  // Populate form when package data is loaded
  useEffect(() => {
    if (currentPackage && !isFormLoaded) {
      const startDate = new Date(currentPackage.startDate).toISOString().split('T')[0];
      const endDate = new Date(currentPackage.endDate).toISOString().split('T')[0];
      
      setFormData({
        title: currentPackage.title || "",
        location: currentPackage.location || "",
        description: currentPackage.description || "",
        price: currentPackage.price?.toString() || "",
        duration: currentPackage.duration?.toString() || "",
        quota: currentPackage.quota?.toString() || "",
        startDate: startDate,
        endDate: endDate,
        thumbnail: null,
        packageImages: [],
      });

      // Set existing thumbnail preview
      if (currentPackage.thumbnail) {
        setThumbnailPreview(`http://localhost:3000/${currentPackage.thumbnail}`);
      }

      // Set existing package images
      if (currentPackage.packageImages && currentPackage.packageImages.length > 0) {
        const imageUrls = currentPackage.packageImages.map((img: any) => 
          `http://localhost:3000/${img.imageUrl || img}`
        );
        setExistingImages(imageUrls);
      }

      setIsFormLoaded(true);
    }
  }, [currentPackage, isFormLoaded]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePackageImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        packageImages: [...prev.packageImages, ...fileArray]
      }));

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPackageImagesPreview(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePackageImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packageImages: prev.packageImages.filter((_, i) => i !== index)
    }));
    setPackageImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: null }));
    setThumbnailPreview(null);
  };

  const validateForm = () => {
    const requiredFields = ['title', 'location', 'description', 'price', 'duration', 'quota', 'startDate', 'endDate'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (emptyFields.length > 0) {
      alert(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      return false;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('End date must be after start date');
      return false;
    }

    if (parseInt(formData.price) <= 0) {
      alert('Price must be greater than 0');
      return false;
    }

    if (parseInt(formData.duration) <= 0) {
      alert('Duration must be greater than 0');
      return false;
    }

    if (parseInt(formData.quota) <= 0) {
      alert('Quota must be greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) return;

    const submitData: any = {};
    
    submitData.title = formData.title;
    submitData.location = formData.location;
    submitData.description = formData.description;
    submitData.price = parseInt(formData.price);
    submitData.duration = parseInt(formData.duration);
    submitData.quota = parseInt(formData.quota);
    submitData.startDate = formData.startDate;
    submitData.endDate = formData.endDate;

    if (formData.thumbnail) {
      submitData.thumbnail = formData.thumbnail;
    }

    if (formData.packageImages.length > 0) {
      submitData.packageImages = formData.packageImages;
    }

    try {
      await dispatch(updateTravelPackage({ 
        id: parseInt(id), 
        packageData: submitData 
      })).unwrap();
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/agent/packages');
      }, 2000);
    } catch (error) {
      console.error('Failed to update package:', error);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/agent/packages');
    }
  };

  // Show loading state while fetching package data
  if (loading && !isFormLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading package data...</span>
        </div>
      </div>
    );
  }

  // Show error if package not found
  if (!loading && !currentPackage && !error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium">Package not found</h3>
          <p className="text-muted-foreground">The package you're looking for doesn't exist.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/agent/packages')}
          >
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/agent/packages')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Edit Travel Package</h2>
          <p className="text-muted-foreground">Update your travel package information</p>
        </div>
      </div>

      {error && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && (
        <motion.div variants={itemVariants}>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Package updated successfully! Redirecting to packages list...
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <form onSubmit={handleSubmit}>
          <Card className="shadow-none border-none">
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
              <CardDescription>Update the details for your travel package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Package Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter package title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter destination location"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter package description"
                  rows={4}
                  required
                />
              </div>

              {/* Pricing and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (IDR) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Days) *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Enter duration in days"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quota">Max Participants *</Label>
                  <Input
                    id="quota"
                    name="quota"
                    type="number"
                    value={formData.quota}
                    onChange={handleInputChange}
                    placeholder="Enter max participants"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {/* Thumbnail Image */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="cursor-pointer"
                  />
                  {thumbnailPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeThumbnail}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://github.com/shadcn.png";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Existing Package Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Package Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Existing package image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://github.com/shadcn.png";
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Package Images */}
              <div className="space-y-2">
                <Label htmlFor="packageImages">Add New Package Images</Label>
                <Input
                  id="packageImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePackageImagesChange}
                  className="cursor-pointer"
                />
                {packageImagesPreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {packageImagesPreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`New package image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removePackageImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Update Package
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default EditPackage;