"use client";
import { motion } from "framer-motion";
import { BarChart3, Calendar, CreditCard, Globe, Home, MapPin, MessageSquare, Plane, Settings, Star, Wallet, ChevronDown, Users2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const data = {
  user: {
    name: "Travel Admin",
    email: "admin@travelagency.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/analytics",
        },
        {
          title: "Revenue Analytics",
          url: "/analytics/revenue",
        },
        {
          title: "Performance Reports",
          url: "/analytics/performance",
        },
        {
          title: "Customer Insights",
          url: "/analytics/insights",
        },
      ],
    },
    {
      title: "Agent Management",
      url: "/agents",
      icon: Users2,
      items: [
        {
          title: "All Agents",
          url: "/agents",
        },
        {
          title: "Add New Agent",
          url: "/agents/add",
        },
        {
          title: "Performance Review",
          url: "/agents/performance",
        },
        {
          title: "Commission Reports",
          url: "/agents/commission",
        },
      ],
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: Calendar,
      badge: "12",
      items: [
        {
          title: "All Bookings",
          url: "/bookings",
        },
        {
          title: "Pending",
          url: "/bookings/pending",
        },
        {
          title: "Confirmed",
          url: "/bookings/confirmed",
        },
        {
          title: "Cancelled",
          url: "/bookings/cancelled",
        },
      ],
    },
    {
      title: "Destinations",
      url: "/destinations",
      icon: MapPin,
      items: [
        {
          title: "All Destinations",
          url: "/destinations",
        },
        {
          title: "Popular",
          url: "/destinations/popular",
        },
        {
          title: "Add New",
          url: "/destinations/add",
        },
      ],
    },
    {
      title: "Packages",
      url: "/packages",
      icon: Plane,
      items: [
        {
          title: "All Packages",
          url: "/packages",
        },
        {
          title: "Featured",
          url: "/packages/featured",
        },
        {
          title: "Seasonal",
          url: "/packages/seasonal",
        },
      ],
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: Star,
      badge: "5",
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageSquare,
      badge: "3",
    },
    {
      title: "Payments",
      url: "/payments",
      icon: CreditCard,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sidebar-primary-foreground">
                  <Globe className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Travelin</span>
                  <span className="text-xs">Admin Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* <form>
            <SidebarGroup className="py-0">
              <SidebarGroupContent className="relative">
                <SidebarInput
                  id="search"
                  placeholder="Search..."
                  className="pl-8"
                />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </SidebarGroupContent>
            </SidebarGroup>
          </form> */}
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navMain.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.items ? (
                      <Collapsible
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={item.isActive}
                              className="group/menu-button"
                            >
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-auto"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <a href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={item.isActive}
                        >
                          <a
                            href={item.url}
                            className="flex items-center"
                          >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="ml-auto"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>

      <SidebarFooter>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar || "/placeholder.svg"}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">TA</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Wallet className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </motion.div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AdminSidebar;
