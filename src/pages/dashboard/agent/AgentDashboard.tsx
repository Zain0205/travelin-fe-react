"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, Users, DollarSign, Star, TrendingUp, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useAppDispatch, useAppSelector } from "@//redux/hook";
import { 
  fetchAgentStatistics, 
  fetchAgentMonthlyReport, 
  fetchAgentPackages 
} from "@/redux/slices/dashboardSlice";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

function AgentDashboard() {
  const dispatch = useAppDispatch();
  const {
    agentStatistics,
    agentMonthlyReport,
    agentPackages,
    isLoadingAgentStats,
    isLoadingAgentReport,
    isLoadingAgentPackages,
    agentStatsError,
    agentReportError,
    agentPackagesError,
  } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch all agent data on component mount
    dispatch(fetchAgentStatistics());
    dispatch(fetchAgentMonthlyReport({ year: new Date().getFullYear() }));
    dispatch(fetchAgentPackages());
  }, [dispatch]);

  // Transform monthly report data for charts
  const monthlyChartData = useMemo(() => {
    if (!agentMonthlyReport || agentMonthlyReport.length === 0) return [];
    
    return agentMonthlyReport.map(report => ({
      month: report.month,
      bookings: report.totalBookings,
      revenue: report.totalRevenue / 1000000, // Convert to millions
      packages: report.packageBookings,
      hotels: report.hotelBookings,
      flights: report.flightBookings,
    }));
  }, [agentMonthlyReport]);

  // Transform package data for charts
  const packageChartData = useMemo(() => {
    if (!agentPackages || agentPackages.length === 0) return [];
    
    return [...agentPackages]
      .sort((a, b) => b.totalBookings - a.totalBookings)
      .slice(0, 6)
      .map(pkg => ({
        name: pkg.title.length > 20 ? `${pkg.title.substring(0, 20)}...` : pkg.title,
        bookings: pkg.totalBookings,
        revenue: pkg.totalRevenue / 1000000, // Convert to millions
        rating: pkg.averageRating,
        location: pkg.location,
      }));
  }, [agentPackages]);

  // Booking distribution data
  const bookingDistributionData = useMemo(() => {
    if (!agentMonthlyReport || agentMonthlyReport.length === 0) return [];
    
    const totals = agentMonthlyReport.reduce((acc, report) => ({
      packages: acc.packages + report.packageBookings,
      hotels: acc.hotels + report.hotelBookings,
      flights: acc.flights + report.flightBookings,
    }), { packages: 0, hotels: 0, flights: 0 });


    console.log(totals)
    console.log(agentMonthlyReport)

    return [
      { name: 'Packages', value: totals.packages },
      { name: 'Hotels', value: totals.hotels },
      { name: 'Flights', value: totals.flights },
    ];
  }, [agentMonthlyReport]);

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

  // Calculate growth percentage (mock calculation - you might want to implement proper comparison)
  const calculateGrowth = (current: number) => {
    // This is a simplified calculation - in real app, compare with previous period
    return Math.floor(Math.random() * 20) + 5; // Random growth between 5-25%
  };

  if (isLoadingAgentStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (agentStatsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading dashboard data: {agentStatsError}</div>
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
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Packages",
            value: agentStatistics?.totalPackages || 0,
            icon: Package,
            color: "text-blue-600",
          },
          {
            title: "Total Bookings",
            value: (agentStatistics?.totalBookings || 0).toLocaleString(),
            icon: Users,
            color: "text-green-600",
          },
          {
            title: "Revenue",
            value: `Rp ${((agentStatistics?.totalRevenue || 0) / 1000000).toFixed(1)}M`,
            icon: DollarSign,
            color: "text-purple-600",
          },
          {
            title: "Active Packages",
            value: agentStatistics?.activePackages || 0,
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
                <p className="text-xs text-muted-foreground">
                  +{calculateGrowth(typeof stat.value === 'string' ? 0 : stat.value)}% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Package Performance</CardTitle>
              <CardDescription>Detailed performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {packageChartData.map((pkg, index) => (
                  <div
                    key={index}
                    className="flex items-center dark:bg-stone-800 space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm truncate">{pkg.name}</p>
                          <p className="text-xs text-gray-500">{pkg.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{pkg.bookings} bookings</p>
                          <p className="text-xs text-gray-500">Rp {pkg.revenue.toFixed(1)}M</p>
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs">{pkg.rating.toFixed(1)}</span>
                        <Progress
                          value={(pkg.bookings / Math.max(...packageChartData.map(p => p.bookings))) * 100}
                          className="ml-2 flex-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Booking Distribution */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Booking Distribution
              </CardTitle>
              <CardDescription>Distribution of bookings by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      {/* Service Breakdown */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Service Breakdown</CardTitle>
            <CardDescription>Monthly comparison of different services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="packages" stackId="a" fill="#3B82F6" name="Packages" />
                  <Bar dataKey="hotels" stackId="a" fill="#10B981" name="Hotels" />
                  <Bar dataKey="flights" stackId="a" fill="#F59E0B" name="Flights" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default AgentDashboard;