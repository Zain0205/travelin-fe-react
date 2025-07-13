"use client";
import { motion } from "framer-motion";
import { Globe, Home, MessageSquare, Settings, Star, Wallet, Hotel, ChevronDown, Package, Plane, Calendar } from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";

const data = {
  user: {
    name: "Travel Agent",
    email: "admin@travelagency.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/agent/dashboard",
      icon: Home,
    },
    {
      title: "Travel Packages",
      url: "/agent/packages",
      icon: Package,
    },
    {
      title: "Flights",
      url: "/agent/flights",
      icon: Plane,
    },
    {
      title: "Hotels",
      url: "/agent/hotels",
      icon: Hotel,
    },
    {
      title: "Bookings",
      url: "/agent/bookings",
      icon: Calendar,
    },
    {
      title: "Reviews",
      url: "/agent/reviews",
      icon: Star,
    },
    {
      title: "Customer Chat",
      url: "/agent/chat/inbox",
      icon: MessageSquare,
    },
  ],
};

function AgentSidebar() {
  const location = useLocation();
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
                  <span className="text-xs">Agent Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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
                {data.navMain.map((item, index) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
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
                    </motion.div>
                  );
                })}
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

export default AgentSidebar;
