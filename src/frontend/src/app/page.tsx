'use client';

import React, { useState } from 'react';
import { Box, IconButton, Drawer, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflowX: 'auto',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1280px',
          minWidth: 0,
          height: '100vh',
          position: 'relative',
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 280,
                boxSizing: 'border-box',
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            <Sidebar onClose={handleDrawerToggle} />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              borderRight: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Sidebar />
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            position: 'relative',
            minWidth: 0,
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                position: 'fixed',
                top: 16,
                left: 16,
                zIndex: 1000,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <ChatWindow />
          <ChatInput />
        </Box>
      </Box>
    </Box>
  );
}
