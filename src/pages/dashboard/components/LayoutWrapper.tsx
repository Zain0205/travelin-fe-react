"use client";

import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useLayoutEffect } from "react";

interface LayoutWrapperProps {
  sidebar: React.ReactNode;
}

function LayoutWrapper({ sidebar }: LayoutWrapperProps) {
  const location = useLocation();

  useLayoutEffect(() => {
    console.log("Route changed to:", location.pathname);
  }, [location.pathname]);


  return (
    <SidebarProvider>
      {sidebar}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex-1 p-4 md:p-8 pt-6">
          <AnimatePresence mode="wait" onExitComplete={() => console.log("Exit Animation")}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }  }
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default LayoutWrapper;