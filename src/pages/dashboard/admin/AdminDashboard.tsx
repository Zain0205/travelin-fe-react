"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Plane, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Package, Hotel, Clock, UserCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { 
  fetchAdminStatistics, 
  fetchAdminMonthlyReport, 
  fetchAgentPerformances 
} from "@/redux/slices/dashboardSlice";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

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

function AdminDashboard() {
  const dispatch = useAppDispatch();
  
  // Redux state selectors untuk admin
  const {
    adminStatistics,
    adminMonthlyReport,
    agentPerformances,
    isLoadingAdminStats,
    isLoadingAdminReport,
    isLoadingAgentPerformances,
    adminStatsError,
    adminReportError,
    agentPerformancesError
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchAdminStatistics());
    dispatch(fetchAdminMonthlyReport({ year: new Date().getFullYear() }));
    dispatch(fetchAgentPerformances());
  }, [dispatch]);

  const statsData = adminStatistics ? [
    {
      title: "Total Users",
      value: adminStatistics.totalUsers.toLocaleString('id-ID'),
      change: "+15.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      isLoading: isLoadingAdminStats
    },
    {
      title: "Total Revenue",
      value: formatCurrency(adminStatistics.totalRevenue),
      change: "+12.8%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      isLoading: isLoadingAdminStats
    },
    {
      title: "Total Bookings",
      value: adminStatistics.totalBookings.toLocaleString('id-ID'),
      change: "+8.7%",
      trend: "up",
      icon: Calendar,
      color: "text-purple-600",
      isLoading: isLoadingAdminStats
    },
    {
      title: "Total Agents",
      value: adminStatistics.totalAgents.toLocaleString('id-ID'),
      change: "+5.3%",
      trend: "up",
      icon: UserCheck,
      color: "text-orange-600",
      isLoading: isLoadingAdminStats
    },
    {
      title: "Total Packages",
      value: adminStatistics.totalPackages.toLocaleString('id-ID'),
      change: "+7.1%",
      trend: "up",
      icon: Package,
      color: "text-indigo-600",
      isLoading: isLoadingAdminStats
    },
    {
      title: "Total Hotels",
      value: adminStatistics.totalHotels.toLocaleString('id-ID'),
      change: "+3.2%",
      trend: "up",
      icon: Hotel,
      color: "text-pink-600",
      isLoading: isLoadingAdminStats
    },
    {
      title: "Total Flights",
      value: adminStatistics.totalFlights.toLocaleString('id-ID'),
      change: "+4.5%",
      trend: "up",
      icon: Plane,
      color: "text-cyan-600",
      isLoading: isLoadingAdminStats
    },
    {
      title: "Pending Bookings",
      value: adminStatistics.pendingBookings.toLocaleString('id-ID'),
      change: "-2.1%",
      trend: "down",
      icon: Clock,
      color: "text-yellow-600",
      isLoading: isLoadingAdminStats
    },
  ] : [];

  // Get top performing agents
  const topAgents = agentPerformances?.slice(0, 5) || [];

  // Calculate monthly growth for recent months
  const recentMonthlyData = adminMonthlyReport?.slice(-3) || [];

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
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your platform overview and performance metrics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
        </div>
      </motion.div>

      {/* Error Messages */}
      {(adminStatsError || adminReportError || agentPerformancesError) && (
        <motion.div variants={itemVariants}>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-sm text-red-600">
                {adminStatsError && <p>Stats Error: {adminStatsError}</p>}
                {adminReportError && <p>Report Error: {adminReportError}</p>}
                {agentPerformancesError && <p>Agent Performances Error: {agentPerformancesError}</p>}
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
              <CardDescription>Platform monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAdminReport ? (
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
                          <div className="flex space-x-4">
                            <span>Packages: {report.packageBookings}</span>
                            <span>Hotels: {report.hotelBookings}</span>
                            <span>Flights: {report.flightBookings}</span>
                          </div>
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

        {/* Top Performing Agents */}
        <motion.div
          variants={itemVariants}
          className="col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
              <CardDescription>Best performing travel agents on the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingAgentPerformances ? (
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
              ) : topAgents.length > 0 ? (
                topAgents.map((agent, index) => (
                  <motion.div
                    key={agent.agentId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none line-clamp-1">
                          {agent.agentName}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs rounded-full bg-primary text-white"
                        >
                          ★ {agent.averageRating?.toFixed(1) || 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{agent.totalPackages} packages</span>
                        <span>{agent.totalBookings} bookings</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-green-600">
                          {formatCurrency(agent.totalRevenue)}
                        </span>
                        <span className="text-muted-foreground">
                          {agent.totalReviews} reviews
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No agent performances available</p>
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
            <CardDescription>Frequently used admin actions for platform management</CardDescription>
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
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
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
                  <UserCheck className="h-6 w-6" />
                  <span>Manage Agents</span>
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
                  <span>All Bookings</span>
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
                  <span>Analytics</span>
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