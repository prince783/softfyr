"use client";

import React, { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const SIDEBAR_LINKS = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "My Projects",
    href: "/dashboard/projects",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
  },
  {
    label: "Subscription",
    href: "/dashboard/subscription",
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
  },
  {
    label: "Support",
    href: "/dashboard/support",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f8fb",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        links={SIDEBAR_LINKS}
      />

      {/* Main Area */}
      <Box
        sx={{
          minHeight: "100vh",
          pl: {
            xs: 0,
            lg: "250px",
          },
          transition: "padding-left 0.3s ease",
        }}
      >
        {/* Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            pt: {
              xs: "64px",
              sm: "72px",
              lg: "64px",
            },
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}