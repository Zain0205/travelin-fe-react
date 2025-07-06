"use client";

import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Plane, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import LayoutWrapper from "../components/LayoutWrapper";
import AdminSidebar from "../components/AdminSidebar";

const statsData = [
  {
    title: "Total Bookings",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Revenue",
    value: "$847,392",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Active Customers",
    value: "1,429",
    change: "+5.7%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Destinations",
    value: "156",
    change: "+2.1%",
    trend: "up",
    icon: MapPin,
    color: "text-orange-600",
  },
];

// const recentBookings = [
//   {
//     id: "BK001",
//     customer: "Sarah Johnson",
//     avatar: "/placeholder.svg?height=32&width=32",
//     destination: "Bali, Indonesia",
//     package: "Premium Beach Resort",
//     amount: "$2,450",
//     status: "confirmed",
//     date: "2024-01-15",
//   },
//   {
//     id: "BK002",
//     customer: "Michael Chen",
//     avatar: "/placeholder.svg?height=32&width=32",
//     destination: "Tokyo, Japan",
//     package: "Cultural Experience",
//     amount: "$3,200",
//     status: "pending",
//     date: "2024-01-14",
//   },
//   {
//     id: "BK003",
//     customer: "Emma Wilson",
//     avatar: "/placeholder.svg?height=32&width=32",
//     destination: "Paris, France",
//     package: "Romantic Getaway",
//     amount: "$4,100",
//     status: "confirmed",
//     date: "2024-01-13",
//   },
//   {
//     id: "BK004",
//     customer: "David Rodriguez",
//     avatar: "/placeholder.svg?height=32&width=32",
//     destination: "Santorini, Greece",
//     package: "Island Hopping",
//     amount: "$2,800",
//     status: "cancelled",
//     date: "2024-01-12",
//   },
//   {
//     id: "BK005",
//     customer: "Lisa Anderson",
//     avatar: "/placeholder.svg?height=32&width=32",
//     destination: "Dubai, UAE",
//     package: "Luxury Desert Safari",
//     amount: "$3,500",
//     status: "confirmed",
//     date: "2024-01-11",
//   },
// ];

const topDestinations = [
  { name: "Bali, Indonesia", bookings: 342, revenue: "$89,400", growth: 15 },
  { name: "Tokyo, Japan", bookings: 298, revenue: "$127,600", growth: 12 },
  { name: "Paris, France", bookings: 256, revenue: "$156,800", growth: 8 },
  { name: "Santorini, Greece", bookings: 189, revenue: "$94,500", growth: 22 },
  { name: "Dubai, UAE", bookings: 167, revenue: "$118,300", growth: 18 },
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function AdminDashboard() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your travel agency today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plane className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsData.map((stat) => (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" /> : <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Bookings */}
        <motion.div
          variants={itemVariants}
          className="col-span-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest travel bookings from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <EnhancedBookingTable
                  bookings={bookings}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteBooking}
                /> */}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Destinations */}
        <motion.div
          variants={itemVariants}
          className="col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Destinations</CardTitle>
              <CardDescription>Most popular travel destinations this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topDestinations.map((destination, index) => (
                <motion.div
                  key={destination.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{destination.name}</p>
                      <Badge
                        variant="outline"
                        className="text-xs rounded-full bg-primary text-white"
                      >
                        +{destination.growth}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{destination.bookings} bookings</span>
                      <span>{destination.revenue}</span>
                    </div>
                    {/* <Progress
                        value={destination.growth * 3}
                        className="h-1"
                      /> */}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions for managing your travel agency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col space-y-2 bg-transparent"
                >
                  <Calendar className="h-6 w-6" />
                  <span>Manage Bookings</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col space-y-2 bg-transparent"
                >
                  <MapPin className="h-6 w-6" />
                  <span>Add Destination</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col space-y-2 bg-transparent"
                >
                  <Users className="h-6 w-6" />
                  <span>Customer Support</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col space-y-2 bg-transparent"
                >
                  <TrendingUp className="h-6 w-6" />
                  <span>View Reports</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default AdminDashboard;
