"use client";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import MuiNavbar from "../components/MuiNavbar";
import MuiSidebar from "../components/MuiSidebar";
import { Providers } from "@/providers/providers";

// Create cyberpunk theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6ec1c8', // Cyberpunk cyan
    },
    secondary: {
      main: '#bdb89c', // Cyberpunk gold
    },
    background: {
      default: '#181e2a',
      paper: '#1a2236',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bdb89c',
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '0.15em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(110, 193, 200, 0.2)',
        },
      },
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const themeMui = useTheme();
  const isMobile = useMediaQuery(themeMui.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
              <MuiSidebar 
                open={sidebarOpen} 
                onClose={handleSidebarClose}
                isMobile={isMobile}
              />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <MuiNavbar onMenuClick={handleSidebarToggle} />
                <Box 
                  component="main" 
                  sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    ml: { xs: 0, md: '240px' },
                    mt: { xs: '64px', md: '64px' }
                  }}
                >
                  {children}
                </Box>
              </Box>
            </Box>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}