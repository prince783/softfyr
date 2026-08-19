"use client";

import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Home,
  Folder,
  TrendingUp,
  User,
  CreditCard,
  Wallet,
  Headphones,
  Settings,
  LogOut,
  X,
  Crown,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface SidebarLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  module?: string;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  links: SidebarLink[];
}

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <Home size={18} strokeWidth={1.8} />,
  "My Projects": <Folder size={18} strokeWidth={1.8} />,
  Analytics: <TrendingUp size={18} strokeWidth={1.8} />,
  Profile: <User size={18} strokeWidth={1.8} />,
  Subscription: <CreditCard size={18} strokeWidth={1.8} />,
  Payments: <Wallet size={18} strokeWidth={1.8} />,
  Support: <Headphones size={18} strokeWidth={1.8} />,
  Settings: <Settings size={18} strokeWidth={1.8} />,
  Logout: <LogOut size={18} strokeWidth={1.8} />,
};

export default function Sidebar({ open, onClose, links }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);

    if (isMobile) {
      onClose();
    }
  };

  const isActive = (href: string) => {
    // Dashboard should be active ONLY on /dashboard
    if (href === "/dashboard" || href === "/") {
      return pathname === "/dashboard" || pathname === "/";
    }

    // Other menu items can remain active for their nested pages
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getIcon = (link: SidebarLink) => {
    return (
      link.icon || iconMap[link.label] || <Folder size={18} strokeWidth={1.8} />
    );
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #f0f0f5",
        px: 1.2,
        py: 2,
        boxSizing: "border-box",
      }}
    >
      {/* Mobile Close */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 1,
          }}
        >
          <IconButton onClick={onClose}>
            <X size={20} strokeWidth={1.8} />
          </IconButton>
        </Box>
      )}

      {/* Logo */}
      <Box
        sx={{
          height: 45,
          display: "flex",
          alignItems: "center",
          px: 1.5,
          mb: 2,
        }}
      >
        <Image
          src="/dashicon.png"
          alt="Your Logo"
          width={230}
          height={140}
          priority
          style={{
            objectFit: "contain",
            width: "180px",
            height: "80px",
          }}
        />
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.55,
        }}
      >
        {links.map((link) => {
          const active = isActive(link.href);

          return (
            <Box
              key={link.href}
              onClick={() => handleNavigation(link.href)}
              sx={{
                height: 42,
                px: 1.25,
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",

                background: active
                  ? "linear-gradient(90deg, #6138e8 0%, #7135e8 100%)"
                  : "transparent",

                color: active ? "#ffffff" : "#687083",

                transition: "all 0.2s ease",

                "&:hover": {
                  background: active
                    ? "linear-gradient(90deg, #6138e8 0%, #7135e8 100%)"
                    : "#f7f5ff",
                },

                "&:hover svg": {
                  color: active ? "#ffffff" : "#6138e8",
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  "& svg": {
                    color: active ? "#ffffff" : "#737b8c",
                    transition: "color 0.2s ease",
                  },
                }}
              >
                {getIcon(link)}
              </Box>

              {/* Label */}
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: active ? 500 : 400,
                  color: "inherit",
                  lineHeight: 1,
                  flex: 1,
                }}
              >
                {link.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Push upgrade card to bottom */}
      <Box sx={{ flex: 1 }} />

      {/* Upgrade Card */}
      <Box
        sx={{
          mx: 0.5,
          mb: 1,
          p: 1.5,
          borderRadius: "9px",
          background: "linear-gradient(180deg, #faf8ff 0%, #f7f3ff 100%)",
          border: "1px solid #eee9fa",
          textAlign: "center",
        }}
      >
        {/* Crown */}
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #8154ee 0%, #6938df 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 1,
          }}
        >
          <Crown size={18} strokeWidth={1.8} color="#ffffff" />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#25213b",
            mb: 0.6,
          }}
        >
          Upgrade to Pro
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: 10,
            lineHeight: 1.5,
            color: "#777387",
            mb: 1.4,
            px: 0.5,
          }}
        >
          Unlock more features and
          <br />
          create unlimited projects.
        </Typography>

        {/* Upgrade Button */}
        <Box
          onClick={() => router.push("/dashboard/subscription")}
          sx={{
            height: 34,
            borderRadius: "5px",
            background: "linear-gradient(90deg, #6138e8 0%, #7135e8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            mb: 1,

            "&:hover": {
              background: "linear-gradient(90deg, #5430d0 0%, #642ed4 100%)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#ffffff",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Upgrade Now
          </Typography>
        </Box>

        {/* View Plans */}
        <Box
          onClick={() => router.push("/dashboard/subscription")}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.3,
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              color: "#6941d8",
              fontWeight: 500,
            }}
          >
            View Plans
          </Typography>

          <ChevronRight size={13} strokeWidth={1.8} color="#6941d8" />
        </Box>
      </Box>
    </Box>
  );

  // Desktop
  if (!isMobile) {
    return (
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1200,
        }}
      >
        {sidebarContent}
      </Box>
    );
  }

  // Mobile
  return (
   <Drawer
  anchor="left"
  open={open}
  onClose={onClose}
  slotProps={{
    paper: {
      sx: {
        width: 250,
        border: "none",
      },
    },
  }}
>
  {sidebarContent}
</Drawer>
  );
}
