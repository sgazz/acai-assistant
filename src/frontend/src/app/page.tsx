'use client';

import React, { useState } from 'react';
import { Box, IconButton, Drawer, useMediaQuery, useTheme, Tabs, Tab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import Sidebar from '../components/Sidebar';
import ChatWindow, { type ChatWindowProps } from '../components/ChatWindow';
import DocumentList from '../components/DocumentList';

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        bgcolor: 'background.default',
        overflow: 'hidden',
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
          component="nav"
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
        component="section"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          minWidth: 0,
          maxWidth: '100%',
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

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            minHeight: 48,
          }}
        >
          <Tab
            icon={<ChatIcon />}
            label="Chat"
            iconPosition="start"
            sx={{ 
              minHeight: 48,
              py: 0
            }}
          />
          <Tab
            icon={<DescriptionIcon />}
            label="Dokumenti"
            iconPosition="start"
            sx={{ 
              minHeight: 48,
              py: 0
            }}
          />
        </Tabs>

        <Box
          component="div"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {activeTab === 0 ? (
            <ChatWindow activeTab={activeTab} />
          ) : (
            <DocumentList />
          )}
        </Box>
      </Box>
    </Box>
  );
}
