"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Plane, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Package, Hotel, Clock } from "lucide-react";

// Redux hooks (you'll need to implement these)
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { 
  fetchAgentStatistics, 
  fetchAgentMonthlyReport, 
  fetchAgentPackages 
} from "@/redux/slices/dashboardSlice";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Currency formatter for Indonesian Rupiah
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Date formatter
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};

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

function AgentDashboard() {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const {
    agentStatistics,
    agentMonthlyReport,
    agentPackages,
    isLoadingAgentStats,
    isLoadingAgentReport,
    isLoadingAgentPackages,
    agentStatsError,
    agentReportError,
    agentPackagesError
  } = useAppSelector((state) => state.dashboard);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchAgentStatistics());
    dispatch(fetchAgentMonthlyReport({ year: new Date().getFullYear() }));
    dispatch(fetchAgentPackages());
  }, [dispatch]);

  // Generate stats data from Redux state
  const statsData = agentStatistics ? [
    {
      title: "Total Packages",
      value: agentStatistics.totalPackages.toLocaleString('id-ID'),
      change: "+12.5%", // You can calculate this from monthly report
      trend: "up",
      icon: Package,
      color: "text-blue-600",
      isLoading: isLoadingAgentStats
    },
    {
      title: "Revenue",
      value: formatCurrency(agentStatistics.totalRevenue),
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      isLoading: isLoadingAgentStats
    },
    {
      title: "Total Bookings",
      value: agentStatistics.totalBookings.toLocaleString('id-ID'),
      change: "+5.7%",
      trend: "up",
      icon: Calendar,
      color: "text-purple-600",
      isLoading: isLoadingAgentStats
    },
    {
      title: "Active Packages",
      value: agentStatistics.activePackages.toLocaleString('id-ID'),
      change: "+2.1%",
      trend: "up",
      icon: MapPin,
      color: "text-orange-600",
      isLoading: isLoadingAgentStats
    },
  ] : [];

  // Get top performing packages
  const topPackages = agentPackages?.slice(0, 5) || [];

  // Calculate monthly growth for recent months
  const recentMonthlyData = agentMonthlyReport?.slice(-3) || [];

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
          <h2 className="text-3xl font-bold tracking-tight">Agent Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your travel agency performance overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Package className="mr-2 h-4 w-4" />
            New Package
          </Button>
        </div>
      </motion.div>

      {/* Error Messages */}
      {(agentStatsError || agentReportError || agentPackagesError) && (
        <motion.div variants={itemVariants}>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-sm text-red-600">
                {agentStatsError && <p>Stats Error: {agentStatsError}</p>}
                {agentReportError && <p>Report Error: {agentReportError}</p>}
                {agentPackagesError && <p>Packages Error: {agentPackagesError}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
                {stat.isLoading ? (
                  <div className="space-y-2">
                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {stat.change}
                      </span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Monthly Performance */}
        <motion.div
          variants={itemVariants}
          className="col-span-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Your recent monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAgentReport ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentMonthlyData.length > 0 ? (
                <div className="space-y-4">
                  {recentMonthlyData.map((report, index) => (
                    <motion.div
                      key={`${report.year}-${report.month}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-lg border"
                    >
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {report.month} {report.year}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {report.totalBookings} bookings
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Revenue: {formatCurrency(report.totalRevenue)}</span>
                          <span>Packages: {report.packageBookings}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No monthly data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Packages */}
        <motion.div
          variants={itemVariants}
          className="col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Packages</CardTitle>
              <CardDescription>Your best performing travel packages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingAgentPackages ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : topPackages.length > 0 ? (
                topPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none line-clamp-1">
                          {pkg.title}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs rounded-full bg-primary text-white"
                        >
                          ★ {pkg.averageRating?.toFixed(1) || 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{pkg.location}</span>
                        <span>{pkg.totalBookings} bookings</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-green-600">
                          {formatCurrency(pkg.totalRevenue)}
                        </span>
                        <span className="text-muted-foreground">
                          {pkg.totalReviews} reviews
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No packages available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions for managing your travel packages</CardDescription>
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
                  <Package className="h-6 w-6" />
                  <span>Manage Packages</span>
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
                  <Calendar className="h-6 w-6" />
                  <span>View Bookings</span>
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
                  <Hotel className="h-6 w-6" />
                  <span>Hotel Bookings</span>
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
                  <span>Performance</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default AgentDashboard;