import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateFlight, fetchFlightById, clearError, clearCurrentFlight } from "@/redux/slices/flightSlice";
import { ArrowLeft, AlertCircle, CheckCircle, Upload, X } from "lucide-react";

function EditFlight() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { currentFlight, loading, error } = useAppSelector((state) => state.flight);

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
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Indonesian cities with airport codes
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

  // Load flight data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchFlightById(parseInt(id)));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentFlight());
    };
  }, [dispatch, id]);

  // Populate form when flight data is loaded
  useEffect(() => {
    if (currentFlight) {
      console.log("Current flight data:", currentFlight);

      // Format datetime for input fields
      const formatDateTimeForInput = (dateTime: string) => {
        const date = new Date(dateTime);
        return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
      };

      setFormData({
        airlineName: currentFlight.airlineName || "",
        origin: currentFlight.origin || "",
        destination: currentFlight.destination || "",
        departureTime: formatDateTimeForInput(currentFlight.departureTime),
        arrivalTime: formatDateTimeForInput(currentFlight.arrivalTime),
        price: currentFlight.price?.toString() || "",
      });

      // Set existing thumbnail
      if (currentFlight.thumnail) {
        setExistingThumbnail(`http://localhost:3000/${currentFlight.thumnail}`);
      }
    }
  }, [currentFlight]);

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

    // Validate origin and destination are different
    if (formData.origin && formData.destination && formData.origin === formData.destination) {
      errors.destination = "Origin and destination must be different";
    }

    // Validate departure time is before arrival time
    if (formData.departureTime && formData.arrivalTime) {
      const departure = new Date(formData.departureTime);
      const arrival = new Date(formData.arrivalTime);
      if (departure >= arrival) {
        errors.arrivalTime = "Arrival time must be after departure time";
      }
    }

    // For edit mode, allow past dates (don't validate future dates)
    // This is because we might be editing existing flights

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

  const removeExistingThumbnail = () => {
    setExistingThumbnail(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Edit form submitted");
    console.log("Form data:", formData);
    console.log("New thumbnail:", thumbnail);

    // Clear previous messages
    setSuccessMessage(null);
    dispatch(clearError());

    // Validate form
    if (!validateForm()) {
      console.log("Form validation failed:", validationErrors);
      return;
    }

    if (!id) {
      console.error("Flight ID is missing");
      return;
    }

    try {
      const updateData: any = {
        id: parseInt(id),
        ...formData,
        price: parseFloat(formData.price),
      };

      // Only include thumbnail if a new one was selected
      if (thumbnail) {
        updateData.thumbnail = thumbnail;
      }

      console.log("Dispatching updateFlight with data:", updateData);
      const result = await dispatch(updateFlight(updateData)).unwrap();
      console.log("Update flight result:", result);

      setSuccessMessage("Flight updated successfully!");

      // Navigate back after short delay
      setTimeout(() => {
        navigate("/agent/flights");
      }, 2000);
    } catch (error) {
      console.error("Failed to update flight:", error);
    }
  };

  const handleCancel = () => {
    console.log("Edit form cancelled");
    navigate("/agent/flights");
  };

  const isFormValid = () => {
    return formData.airlineName && formData.origin && formData.destination && formData.departureTime && formData.arrivalTime && formData.price && Object.keys(validationErrors).length === 0;
  };

  // Show loading while fetching flight data
  if (loading && !currentFlight) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show error if flight not found
  if (!loading && !currentFlight && id) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <div>
          <h3 className="text-lg font-semibold">Flight Not Found</h3>
          <p className="text-muted-foreground">The flight you're trying to edit doesn't exist.</p>
        </div>
        <Button onClick={() => navigate("/agent/flights")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Flights
        </Button>
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
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Edit Flight Partnership</h2>
          <p className="text-muted-foreground">Update your flight partnership details</p>
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
            <CardDescription>Update the details for your flight partnership</CardDescription>
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
                  {/* Show existing thumbnail if available */}
                  {existingThumbnail && !thumbnailPreview && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Current thumbnail:</p>
                      <div className="relative inline-block">
                        <img
                          src={existingThumbnail}
                          alt="Current flight thumbnail"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeExistingThumbnail}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Input
                    id="flightThumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className={`cursor-pointer ${validationErrors.thumbnail ? "border-red-500" : ""}`}
                  />
                  {validationErrors.thumbnail && <p className="text-sm text-red-500">{validationErrors.thumbnail}</p>}

                  {/* Show new thumbnail preview */}
                  {thumbnailPreview && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">New thumbnail preview:</p>
                      <div className="relative inline-block">
                        <img
                          src={thumbnailPreview}
                          alt="New flight thumbnail preview"
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
                  {loading ? "Updating..." : "Update Flight Partnership"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default EditFlight;
