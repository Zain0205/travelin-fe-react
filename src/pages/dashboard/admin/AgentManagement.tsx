"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Mail, Phone, MapPin, Star, TrendingUp, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { clearError, getAllAgents, registerUser } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

const initialAgents = [
  {
    id: "AG001",
    name: "Sarah Johnson",
    email: "sarah.johnson@travelagency.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    role: "Senior Agent",
    joinDate: "2023-01-15",
    totalBookings: 145,
    totalRevenue: 289000,
    rating: 4.9,
    commission: 28900,
    specialties: ["Luxury Travel", "Europe", "Honeymoons"],
  },
];

export default function AgentManagement() {
  // const [agents, setAgents] = useState(initialAgents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "agent",
  });

  const dispatch: any = useAppDispatch();
  const { isLoading, error, isAuthenticated, agents } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllAgents())
  }, [])

    console.log(agents.data)

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate('/login');
  //   }, 2000)
  //   return () => clearTimeout(timer)
  // }, [isAuthenticated, navigate, showSuccess])

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newAgent.name.trim()) {
      errors.name = "Name is required";
    }

    if (!newAgent.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newAgent.email)) {
      errors.email = "Email is invalid";
    }

    if (!newAgent.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (!newAgent.password) {
      errors.password = "Password is required";
    } else if (newAgent.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (newAgent.password !== newAgent.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setNewAgent((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(newAgent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        registerUser({
          name: newAgent.name,
          email: newAgent.email,
          phone: newAgent.phone,
          password: newAgent.password,
          role: newAgent.role,
        })
      );

      setShowSuccess(true);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agent Management</h2>
          <p className="text-muted-foreground">Manage your travel agents and track their performance</p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Travel Agent</DialogTitle>
              <DialogDescription>Add a new travel agent to your team. Fill in their details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="name"
                  className="text-right"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter agent's name"
                  value={newAgent.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="email"
                  className="text-right"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter agent's email"
                  value={newAgent.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="phone"
                  className="text-right"
                >
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter agent's phone number"
                  value={newAgent.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="pw"
                  className="text-right"
                >
                  Password
                </Label>
                <Input
                  id="pw"
                  name="password"
                  value={newAgent.password}
                  placeholder="Create a password"
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpw">Confirm Password</Label>
                <Input
                  id="cpw"
                  value={newAgent.confirmPassword}
                  onChange={handleInputChange}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Badge variant="secondary">{agents.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents?.data?.filter((a: any) => a.isVerified === true).length}</div>
            <p className="text-xs text-muted-foreground">{agents?.data?.filter((a: any) => a.isVerified === false).length} inactive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(agents?.data?.reduce((acc: any, agent: any) => acc + agent.rating, 0) / agents.length).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average rating across all agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Badge variant="outline">{agents?.data?.reduce((acc: any, agent: any) => acc + agent.totalBookings, 0)}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(agents?.data?.reduce((acc: any, agent: any) => acc + agent.totalBookings, 0) / agents.length)}</div>
            <p className="text-xs text-muted-foreground">Average per agent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            {/* <Badge variant="outline">${agents?.data?.reduce((acc: any, agent: any) => acc + agent.commission, 0).toLocaleString()}</Badge> */}
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">${Math.round(agents?.data?.reduce((acc: any, agent: any) => acc + agent.commission, 0) / agents.length).toLocaleString()}</div> */}
            <p className="text-xs text-muted-foreground">Average per agent</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Travel Agents</CardTitle>
            <CardDescription>Manage your team of travel agents and track their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents?.data?.map((agent: any, index: any) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {agent.name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-muted-foreground">{agent.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {agent.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-1 h-3 w-3" />
                          {agent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{agent.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{agent.bookings.length} bookings</div>
                        {/* <div className="text-sm font-medium">${agent.totalRevenue.toLocaleString()}</div> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={agent.isVerified ? "default" : "secondary"}
                        className="cursor-pointer"
                      >
                        {agent.isVerified ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Performance</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
