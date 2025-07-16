"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, TrendingUp, TrendingDown, Calendar, Users, Package, Plane, Hotel } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { 
  fetchAdminStatistics, 
  fetchAdminMonthlyReport, 
  fetchAgentPerformances 
} from "@/redux/slices/dashboardSlice"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

// Revenue source colors
const revenueSourceColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]

export default function AdminAnalytics() {
  const dispatch = useAppDispatch()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [timeRange, setTimeRange] = useState("12months")
  
  const {
    adminStatistics,
    adminMonthlyReport,
    agentPerformances,
    isLoadingAdminStats,
    isLoadingAdminReport,
    isLoadingAgentPerformances,
    adminStatsError,
    adminReportError,
    agentPerformancesError,
  } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchAdminStatistics())
    dispatch(fetchAdminMonthlyReport({ year: selectedYear }))
    dispatch(fetchAgentPerformances())
  }, [dispatch, selectedYear])

  // Calculate revenue growth
  const calculateRevenueGrowth = () => {
    if (!adminMonthlyReport || adminMonthlyReport.length < 2) return 0
    
    const currentMonth = adminMonthlyReport[adminMonthlyReport.length - 1]
    const previousMonth = adminMonthlyReport[adminMonthlyReport.length - 2]
    
    if (!currentMonth || !previousMonth) return 0
    
    return ((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue) * 100
  }

  // Calculate average monthly revenue
  const calculateAverageMonthlyRevenue = () => {
    if (!adminMonthlyReport || adminMonthlyReport.length === 0) return 0
    
    const totalRevenue = adminMonthlyReport.reduce((sum, month) => sum + month.totalRevenue, 0)
    return totalRevenue / adminMonthlyReport.length
  }

  // Calculate revenue by booking type
  const calculateRevenueByType = () => {
    if (!adminMonthlyReport || adminMonthlyReport.length === 0) return []
    
    const totalPackageRevenue = adminMonthlyReport.reduce((sum, month) => sum + (month.packageBookings * 2500), 0) // Assuming average package value
    const totalHotelRevenue = adminMonthlyReport.reduce((sum, month) => sum + (month.hotelBookings * 150), 0) // Assuming average hotel value
    const totalFlightRevenue = adminMonthlyReport.reduce((sum, month) => sum + (month.flightBookings * 800), 0) // Assuming average flight value
    
    const total = totalPackageRevenue + totalHotelRevenue + totalFlightRevenue
    
    return [
      { 
        name: "Package Bookings", 
        value: total > 0 ? Math.round((totalPackageRevenue / total) * 100) : 0, 
        amount: totalPackageRevenue,
        color: "#8884d8" 
      },
      { 
        name: "Hotel Bookings", 
        value: total > 0 ? Math.round((totalHotelRevenue / total) * 100) : 0, 
        amount: totalHotelRevenue,
        color: "#82ca9d" 
      },
      { 
        name: "Flight Bookings", 
        value: total > 0 ? Math.round((totalFlightRevenue / total) * 100) : 0, 
        amount: totalFlightRevenue,
        color: "#ffc658" 
      },
    ].filter(item => item.value > 0)
  }

  // Format chart data for monthly trends
  const formatChartData = () => {
    if (!adminMonthlyReport) return []
    
    return adminMonthlyReport.map(month => ({
      month: new Date(month.year, new Date().getMonth()).toLocaleString('default', { month: 'short' }),
      revenue: month.totalRevenue,
      bookings: month.totalBookings,
      packages: month.packageBookings,
      hotels: month.hotelBookings,
      flights: month.flightBookings,
    }))
  }

  // Format agent performance data
  const formatAgentPerformanceData = () => {
    if (!agentPerformances) return []
    
    return agentPerformances.map(agent => ({
      name: agent.agentName,
      revenue: agent.totalRevenue,
      bookings: agent.totalBookings,
      packages: agent.totalPackages,
      rating: agent.averageRating,
    }))
  }

  const revenueGrowth = calculateRevenueGrowth()
  const averageMonthlyRevenue = calculateAverageMonthlyRevenue()
  const revenueByType = calculateRevenueByType()
  const chartData = formatChartData()
  const agentData = formatAgentPerformanceData()

  if (isLoadingAdminStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (adminStatsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading analytics: {adminStatsError}</p>
          <button 
            onClick={() => dispatch(fetchAdminStatistics())}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Revenue Analytics</h2>
          <p className="text-muted-foreground">Detailed revenue analysis and financial insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
            <SelectItem value="24months">Last 24 Months</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Revenue Overview Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {adminStatistics?.totalRevenue?.toLocaleString() || '0'}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueGrowth >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {Math.round(averageMonthlyRevenue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Average monthly revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminStatistics?.totalBookings?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {adminStatistics?.pendingBookings || 0} pending, {adminStatistics?.completedBookings || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adminStatistics?.totalAgents?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total users: {adminStatistics?.totalUsers?.toLocaleString() || '0'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="sources">Revenue Sources</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                  <CardDescription>Revenue and bookings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAdminReport ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Monthly booking distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAdminReport ? (
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="packages" stackId="1" stroke="#8884d8" fill="#8884d8" name="Packages" />
                        <Area type="monotone" dataKey="hotels" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Hotels" />
                        <Area type="monotone" dataKey="flights" stackId="1" stroke="#ffc658" fill="#ffc658" name="Flights" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Type</CardTitle>
                  <CardDescription>Distribution of revenue across booking types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueByType}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {revenueByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Type Details</CardTitle>
                  <CardDescription>Detailed breakdown by booking type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {revenueByType.map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                        <span className="font-medium">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{source.value}%</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Revenue performance by travel agents</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAgentPerformances ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={agentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}