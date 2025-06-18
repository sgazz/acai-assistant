'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Typography,
  Badge,
  Collapse,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Description as DocumentIcon,
  Science as BiologyIcon,
  Calculate as MathIcon,
  History as HistoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useChatContext } from '../context/ChatContext';

const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 72;

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  unreadCount?: number;
  subCategories?: { id: string; name: string }[];
}

const categories: Category[] = [
  {
    id: 'chat',
    name: 'Chat',
    icon: <ChatIcon />,
    unreadCount: 2,
  },
  {
    id: 'documents',
    name: 'Dokumenti',
    icon: <DocumentIcon />,
    unreadCount: 1,
  },
  {
    id: 'biology',
    name: 'Biologija',
    icon: <BiologyIcon />,
    subCategories: [
      { id: 'cell', name: 'Ćelijska struktura' },
      { id: 'genetics', name: 'Genetika' },
      { id: 'evolution', name: 'Evolucija' },
    ],
  },
  {
    id: 'math',
    name: 'Matematika',
    icon: <MathIcon />,
    subCategories: [
      { id: 'algebra', name: 'Algebra' },
      { id: 'geometry', name: 'Geometrija' },
      { id: 'calculus', name: 'Analiza' },
    ],
  },
  {
    id: 'history',
    name: 'Istorija',
    icon: <HistoryIcon />,
    subCategories: [
      { id: 'ancient', name: 'Stari vek' },
      { id: 'medieval', name: 'Srednji vek' },
      { id: 'modern', name: 'Moderno doba' },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState('chat');
  const { state: { searchQuery }, setSearchQuery } = useChatContext();

  const handleCategoryClick = (categoryId: string) => {
    if (categories.find(cat => cat.id === categoryId)?.subCategories) {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    } else {
      setSelectedItem(categoryId);
      if (onClose) {
        onClose();
      }
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setExpandedCategory(null);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: theme => theme.transitions.create(['width'], {
            duration: theme.transitions.duration.standard,
          }),
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {!isCollapsed && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            ACAI Assistant
          </Typography>
        )}
        <IconButton onClick={toggleCollapse}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Search Bar */}
      {!isCollapsed && (
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Pretraži chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* Main Navigation */}
      <List sx={{ flex: 1, overflow: 'auto', pt: 0 }}>
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedItem === category.id}
                onClick={() => handleCategoryClick(category.id)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  ...(isCollapsed && {
                    justifyContent: 'center',
                    px: 1.5,
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: 'center',
                  }}
                >
                  {category.unreadCount ? (
                    <Badge badgeContent={category.unreadCount} color="primary">
                      {category.icon}
                    </Badge>
                  ) : (
                    category.icon
                  )}
                </ListItemIcon>
                {!isCollapsed && (
                  <>
                    <ListItemText primary={category.name} />
                    {category.subCategories && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryClick(category.id);
                        }}
                      >
                        {expandedCategory === category.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    )}
                  </>
                )}
              </ListItemButton>
            </ListItem>
            {!isCollapsed && category.subCategories && (
              <Collapse in={expandedCategory === category.id}>
                <List disablePadding>
                  {category.subCategories.map((sub) => (
                    <ListItemButton
                      key={sub.id}
                      selected={selectedItem === sub.id}
                      onClick={() => setSelectedItem(sub.id)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText
                        primary={sub.name}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {!isCollapsed && (
          <Avatar
            alt="User"
            src="/user-avatar.png"
            sx={{ width: 32, height: 32 }}
          />
        )}
        {!isCollapsed ? (
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" noWrap>
              Učenik
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              user@email.com
            </Typography>
          </Box>
        ) : (
          <Tooltip title="Učenik" placement="right">
            <Avatar
              alt="User"
              src="/user-avatar.png"
              sx={{ width: 32, height: 32 }}
            />
          </Tooltip>
        )}
        {!isCollapsed && (
          <>
            <Tooltip title="Obaveštenja">
              <IconButton size="small">
                <Badge badgeContent={3} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Podešavanja">
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Drawer>
  );
}
