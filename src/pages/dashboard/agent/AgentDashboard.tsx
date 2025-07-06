"use client";

import { motion } from "framer-motion";
import { Package, Users, DollarSign, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const mockData = {
  analytics: {
    totalPackages: 45,
    totalBookings: 1234,
    revenue: 125000,
    avgRating: 4.8,
    monthlyGrowth: 12.5,
    topDestinations: [
      { name: "Bali", bookings: 234, revenue: 45000 },
      { name: "Jakarta", bookings: 189, revenue: 32000 },
      { name: "Yogyakarta", bookings: 156, revenue: 28000 },
      { name: "Lombok", bookings: 134, revenue: 25000 },
    ],
  },
};

function AgentDashboard() {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Packages",
            value: mockData.analytics.totalPackages,
            icon: Package,
            color: "text-blue-600",
          },
          {
            title: "Total Bookings",
            value: mockData.analytics.totalBookings.toLocaleString(),
            icon: Users,
            color: "text-green-600",
          },
          {
            title: "Revenue",
            value: `Rp ${(mockData.analytics.revenue / 1000000).toFixed(1)}M`,
            icon: DollarSign,
            color: "text-purple-600",
          },
          {
            title: "Avg Rating",
            value: mockData.analytics.avgRating,
            icon: Star,
            color: "text-yellow-600",
          },
        ].map((stat) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">+{mockData.analytics.monthlyGrowth}% from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Top Destinations</CardTitle>
              <CardDescription>Most popular travel destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.analytics.topDestinations.map((dest, index) => (
                  <div
                    key={dest.name}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{dest.name}</span>
                        <span className="text-sm text-muted-foreground">{dest.bookings} bookings</span>
                      </div>
                      <Progress
                        value={(dest.bookings / 234) * 100}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest bookings and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New booking", package: "Bali Paradise 5D4N", time: "2 hours ago" },
                  { action: "Review received", package: "Jakarta City Tour", time: "4 hours ago" },
                  { action: "Package updated", package: "Yogya Heritage", time: "6 hours ago" },
                  { action: "New customer chat", package: "General inquiry", time: "8 hours ago" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.package} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AgentDashboard;
