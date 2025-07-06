"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createFlight, clearError } from "@/redux/slices/flightSlice";
import { ArrowLeft, AlertCircle, CheckCircle, X } from "lucide-react";

function AddFlight() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.flight);

  const [formData, setFormData] = useState({
    airlineName: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const indonesianCities = [
    "Jakarta (CGK)",
    "Surabaya (MLG)",
    "Medan (KNO)",
    "Denpasar/Bali (DPS)",
    "Makassar (UPG)",
    "Balikpapan (BPN)",
    "Manado (MDC)",
    "Palembang (PLM)",
    "Pekanbaru (PKU)",
    "Banjarmasin (BDJ)",
    "Pontianak (PNK)",
    "Jambi (DJB)",
    "Padang (PDG)",
    "Yogyakarta (JOG)",
    "Solo (SOC)",
    "Semarang (SRG)",
    "Malang (MLG)",
    "Bandung (BDO)",
    "Lampung (TKG)",
    "Batam (BTH)",
  ];

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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.airlineName) errors.airlineName = "Airline is required";
    if (!formData.origin) errors.origin = "Origin is required";
    if (!formData.destination) errors.destination = "Destination is required";
    if (!formData.departureTime) errors.departureTime = "Departure time is required";
    if (!formData.arrivalTime) errors.arrivalTime = "Arrival time is required";
    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price))) {
      errors.price = "Price must be a valid number";
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    // Validate departure time is before arrival time
    if (formData.departureTime && formData.arrivalTime) {
      const departure = new Date(formData.departureTime);
      const arrival = new Date(formData.arrivalTime);
      if (departure >= arrival) {
        errors.arrivalTime = "Arrival time must be after departure time";
      }
    }

    // Validate departure time is not in the past
    if (formData.departureTime) {
      const departure = new Date(formData.departureTime);
      const now = new Date();
      if (departure <= now) {
        errors.departureTime = "Departure time must be in the future";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Clear success message when user starts editing
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setValidationErrors((prev) => ({
          ...prev,
          thumbnail: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          thumbnail: "File size must be less than 5MB",
        }));
        return;
      }

      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear thumbnail validation error
      if (validationErrors.thumbnail) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.thumbnail;
          return newErrors;
        });
      }
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    // Clear the file input
    const fileInput = document.getElementById("flightThumbnail") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccessMessage(null);
    dispatch(clearError());

    if (!validateForm()) {
      console.log("Form validation failed:", validationErrors);
      return;
    }

    try {
      const flightData = {
        ...formData,
        price: parseFloat(formData.price),
        ...(thumbnail && { thumnail: thumbnail }),
      };

      await dispatch(createFlight(flightData)).unwrap();

      setSuccessMessage("Flight created successfully!");
      setFormData({
        airlineName: "",
        origin: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
        price: "",
      });
      setThumbnail(null);
      setThumbnailPreview(null);
      setValidationErrors({});

      setTimeout(() => {
        navigate("/agent/flights");
      }, 2000);
    } catch (error) {
      console.error("Failed to create flight:", error);
    }
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    navigate("/agent/flights");
  };

  const isFormValid = () => {
    return formData.airlineName && formData.origin && formData.destination && formData.departureTime && formData.arrivalTime && formData.price && Object.keys(validationErrors).length === 0;
  };

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
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Add New Flight Partnership</h2>
          <p className="text-muted-foreground">Add a new flight partnership to your network</p>
        </div>
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

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      <motion.div variants={itemVariants}>
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle>Flight Information</CardTitle>
            <CardDescription>Fill in the details for your new flight partnership</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 w-full">
                  <Label htmlFor="airline">Airline *</Label>
                  <Select
                    value={formData.airlineName}
                    onValueChange={(value) => handleInputChange("airlineName", value)}
                  >
                    <SelectTrigger className={validationErrors.airlineName ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select airline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Garuda Indonesia">Garuda Indonesia</SelectItem>
                      <SelectItem value="Lion Air">Lion Air</SelectItem>
                      <SelectItem value="Citilink">Citilink</SelectItem>
                      <SelectItem value="AirAsia">AirAsia</SelectItem>
                      <SelectItem value="Batik Air">Batik Air</SelectItem>
                      <SelectItem value="Sriwijaya Air">Sriwijaya Air</SelectItem>
                      <SelectItem value="Wings Air">Wings Air</SelectItem>
                      <SelectItem value="Super Air Jet">Super Air Jet</SelectItem>
                      <SelectItem value="TransNusa">TransNusa</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.airlineName && <p className="text-sm text-red-500">{validationErrors.airlineName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flightPrice">Price (IDR) *</Label>
                  <Input
                    id="flightPrice"
                    type="number"
                    placeholder="Enter flight price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={validationErrors.price ? "border-red-500" : ""}
                    min="0"
                    step="1000"
                  />
                  {validationErrors.price && <p className="text-sm text-red-500">{validationErrors.price}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure">Origin (Departure City) *</Label>
                  <Select
                    value={formData.origin}
                    onValueChange={(value) => handleInputChange("origin", value)}
                  >
                    <SelectTrigger className={validationErrors.origin ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select departure city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indonesianCities.map((city) => (
                        <SelectItem
                          key={city}
                          value={city}
                        >
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.origin && <p className="text-sm text-red-500">{validationErrors.origin}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrival">Destination (Arrival City) *</Label>
                  <Select
                    value={formData.destination}
                    onValueChange={(value) => handleInputChange("destination", value)}
                  >
                    <SelectTrigger className={validationErrors.destination ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indonesianCities
                        .filter((city) => city !== formData.origin)
                        .map((city) => (
                          <SelectItem
                            key={city}
                            value={city}
                          >
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.destination && <p className="text-sm text-red-500">{validationErrors.destination}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Departure Date & Time *</Label>
                  <Input
                    id="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={(e) => handleInputChange("departureTime", e.target.value)}
                    className={validationErrors.departureTime ? "border-red-500" : ""}
                  />
                  {validationErrors.departureTime && <p className="text-sm text-red-500">{validationErrors.departureTime}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Date & Time *</Label>
                  <Input
                    id="arrivalTime"
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={(e) => handleInputChange("arrivalTime", e.target.value)}
                    className={validationErrors.arrivalTime ? "border-red-500" : ""}
                  />
                  {validationErrors.arrivalTime && <p className="text-sm text-red-500">{validationErrors.arrivalTime}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flightThumbnail">Flight Thumbnail</Label>
                <div className="space-y-4">
                  <Input
                    id="flightThumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className={`cursor-pointer ${validationErrors.thumbnail ? "border-red-500" : ""}`}
                  />
                  {validationErrors.thumbnail && <p className="text-sm text-red-500">{validationErrors.thumbnail}</p>}

                  {thumbnailPreview && (
                    <div className="relative inline-block">
                      <img
                        src={thumbnailPreview}
                        alt="Flight thumbnail preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeThumbnail}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

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
                  disabled={loading || !isFormValid()}
                >
                  {loading ? "Creating..." : "Add Flight Partnership"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default AddFlight;
