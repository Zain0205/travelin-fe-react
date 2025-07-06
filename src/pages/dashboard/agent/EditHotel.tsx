import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { updateHotel, fetchHotelById, clearError } from "@/redux/slices/hotelSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2, X } from "lucide-react";

function EditHotel() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentHotel, loading, error } = useSelector((state: RootState) => state.hotel);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    pricePerNight: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [hotelImages, setHotelImages] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

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
    if (id) {
      dispatch(fetchHotelById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentHotel) {
      setFormData({
        name: currentHotel.name || "",
        description: currentHotel.description || "",
        location: currentHotel.location || "",
        pricePerNight: currentHotel.pricePerNight?.toString() || "",
      });

      // Set existing thumbnail
      if (currentHotel.thumbnail) {
        setThumbnailPreview(`http://localhost:3000/${currentHotel.thumbnail}`);
      }

      // Set existing images
      if (currentHotel.hotelImages && currentHotel.hotelImages.length > 0) {
        const imageUrls = currentHotel.hotelImages.map((img: any) => `http://localhost:3000/${img}`);
        setExistingImages(imageUrls);
      }
    }
  }, [currentHotel]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setHotelImages((prev) => [...prev, ...fileArray]);

      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagesPreview((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewImage = (index: number) => {
    setHotelImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.pricePerNight || !id) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const hotelData = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        pricePerNight: parseInt(formData.pricePerNight),
        thumbnail: thumbnail || undefined,
        hotelImages: hotelImages.length > 0 ? hotelImages : undefined,
      };

      await dispatch(updateHotel({ id: parseInt(id), hotelData })).unwrap();
      toast.success("Hotel updated successfully!");
      navigate("/agent/hotels");
    } catch (error) {
      toast.error("Failed to update hotel");
    }
  };

  const handleCancel = () => {
    navigate("/agent/hotels");
  };

  if (loading && !currentHotel) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading hotel data...</span>
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
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Edit Hotel Partnership</h2>
          <p className="text-muted-foreground">Update hotel information</p>
        </div>
      </div>

      <motion.div variants={itemVariants}>
        <form onSubmit={handleSubmit}>
          <Card className="shadow-none border-none">
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>Update the details for your hotel partnership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter hotel name"
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
                    placeholder="e.g., Nusa Dua, Bali"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter hotel description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerNight">Price per Night (IDR) *</Label>
                <Input
                  id="pricePerNight"
                  name="pricePerNight"
                  type="number"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  placeholder="Enter price per night"
                  required
                />
              </div>

              {/* Current Thumbnail */}
              <div className="space-y-2">
                <Label>Current Thumbnail</Label>
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img
                      src={thumbnailPreview}
                      alt="Current hotel thumbnail"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Update Thumbnail */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Update Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="cursor-pointer"
                />
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Images</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative"
                      >
                        <img
                          src={imageUrl}
                          alt={`Existing hotel image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
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

              {/* Add New Images */}
              <div className="space-y-2">
                <Label htmlFor="hotelImages">Add New Images</Label>
                <Input
                  id="hotelImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="cursor-pointer"
                />
                {imagesPreview.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {imagesPreview.map((preview, index) => (
                      <div
                        key={index}
                        className="relative"
                      >
                        <img
                          src={preview}
                          alt={`New hotel image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Hotel Partnership
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default EditHotel;
