import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store"; // Adjust import path as needed
import { createHotel, clearError } from "@/redux/slices/hotelSlice"; // Adjust import path as needed
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // or your preferred toast library
import { ArrowLeft, Loader2 } from "lucide-react";

function AddHotel() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.hotel);

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
    if (error) {
      toast.error(error);
      dispatch(clearError());
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
      setHotelImages(prev => [...prev, ...fileArray]);
      
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagesPreview(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setHotelImages(prev => prev.filter((_, i) => i !== index));
    setImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.pricePerNight) {
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

      await dispatch(createHotel(hotelData)).unwrap();
      toast.success("Hotel added successfully!");
      navigate("/agent/hotels");
    } catch (error) {
      toast.error("Failed to add hotel");
    }
  };

  const handleCancel = () => {
    navigate("/agent/hotels");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Add New Hotel Partnership</h2>
          <p className="text-muted-foreground">Add a new hotel partnership to your network</p>
        </div>
      </div>

      <motion.div variants={itemVariants}>
        <form onSubmit={handleSubmit}>
          <Card className="shadow-none border-none">
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>Fill in the details for your new hotel partnership</CardDescription>
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

              {/* Thumbnail Image */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Hotel Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="cursor-pointer"
                />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img
                      src={thumbnailPreview}
                      alt="Hotel thumbnail preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Multiple Images */}
              <div className="space-y-2">
                <Label htmlFor="hotelImages">Hotel Images (Multiple)</Label>
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
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Hotel image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Hotel Partnership
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddHotel;