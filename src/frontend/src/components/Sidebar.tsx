'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, Tooltip, Divider, List, ListItem, ListItemText, ListItemIcon, Collapse, ListItemButton, Paper, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

interface Chat {
  id: string;
  title: string;
  category: string;
  lastMessage: string;
  timestamp: string;
}

interface SidebarProps {
  onClose?: () => void;
}

const categories = [
  { id: 'biology', name: 'Biologija', icon: <ScienceIcon /> },
  { id: 'math', name: 'Matematika', icon: <SchoolIcon /> },
  { id: 'history', name: 'Istorija', icon: <HistoryIcon /> },
];

const dummyChats: Chat[] = [
  { id: '1', title: 'Ćelijska struktura', category: 'biology', lastMessage: 'Da li možeš da objasniš razliku između...', timestamp: '10:30' },
  { id: '2', title: 'Kvadratne jednačine', category: 'math', lastMessage: 'Kako se rešava kvadratna jednačina...', timestamp: '09:15' },
  { id: '3', title: 'Rimsko carstvo', category: 'history', lastMessage: 'Koji su bili glavni razlozi...', timestamp: '08:45' },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('biology');
  const [activeChat, setActiveChat] = useState<string>('1');

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId);
    onClose?.();
  };

  const filteredChats = dummyChats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper 
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box 
        sx={{ 
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main',
            width: 32,
            height: 32,
          }}
        >
          A
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          ACAI Assistant
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Pretraži chatove..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            sx: {
              bgcolor: 'action.hover',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.selected',
              },
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        <List component="nav" disablePadding>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <ListItemButton
                onClick={() => handleCategoryClick(category.id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {category.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={category.name}
                  primaryTypographyProps={{
                    fontWeight: expandedCategory === category.id ? 600 : 400,
                  }}
                />
                {expandedCategory === category.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
              <Collapse in={expandedCategory === category.id} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {filteredChats
                    .filter(chat => chat.category === category.id)
                    .map((chat) => (
                      <ListItemButton
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        sx={{
                          ml: 2,
                          borderRadius: 2,
                          mb: 0.5,
                          bgcolor: activeChat === chat.id ? 'action.selected' : 'transparent',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <ChatIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={chat.title}
                          secondary={chat.lastMessage}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: activeChat === chat.id ? 600 : 400,
                          }}
                          secondaryTypographyProps={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            sx: {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                            },
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                          }}
                        >
                          {chat.timestamp}
                        </Typography>
                      </ListItemButton>
                    ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Box>

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
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main',
            width: 32,
            height: 32,
          }}
        >
          U
        </Avatar>
        <Box>
          <Typography variant="subtitle2">Učenik</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            user@email.com
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
