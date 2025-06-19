'use client';

import React, { useState, useEffect } from 'react';
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
  Chip,
  LinearProgress,
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
  Menu as MenuIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  CalendarMonth as CalendarMonthIcon,
  FitnessCenter as FitnessCenterIcon,
  Hub as HubIcon,
  MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import { useChatContext } from '../context/ChatContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const DRAWER_WIDTH = 280;
const MIN_DRAWER_WIDTH = 200;
const MAX_DRAWER_WIDTH = 400;
const COLLAPSED_DRAWER_WIDTH = 72;

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  type?: 'year' | 'semester' | 'subject' | 'topic' | 'subtopic';
  tags?: string[];
  progress?: number;
  status?: 'in_progress' | 'completed' | 'to_review';
  priority?: 'high' | 'medium' | 'low';
  unreadCount?: number;
  subCategories?: Category[];
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
    id: 'year1',
    name: 'Prva godina',
    icon: <SchoolIcon />,
    type: 'year',
    subCategories: [
      {
        id: 'semester1',
        name: 'Zimski semestar',
        type: 'semester',
        icon: <CalendarMonthIcon />,
        subCategories: [
          {
            id: 'anatomy1',
            name: 'Anatomija I',
            icon: <ScienceIcon />,
            type: 'subject',
            progress: 75,
            status: 'in_progress',
            priority: 'high',
            tags: ['obavezni', 'praktikum'],
            subCategories: [
              {
                id: 'bones',
                name: 'Kosti',
                type: 'topic',
                icon: <MedicalServicesIcon />,
                progress: 90,
                status: 'completed',
                priority: 'high',
                tags: ['osnovno', 'prakticno'],
              },
              {
                id: 'muscles',
                name: 'Mišići',
                type: 'topic',
                icon: <FitnessCenterIcon />,
                progress: 60,
                status: 'in_progress',
                priority: 'high',
                tags: ['osnovno', 'prakticno'],
              },
              {
                id: 'nerves',
                name: 'Nervi',
                type: 'topic',
                icon: <HubIcon />,
                progress: 30,
                status: 'to_review',
                priority: 'medium',
                tags: ['napredno', 'teorijsko'],
              },
            ],
          },
        ],
      },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

const TagChip = ({ tag }: { tag: string }) => (
  <Chip
    size="small"
    label={tag}
    sx={{
      height: 20,
      fontSize: '0.7rem',
      bgcolor: 'primary.light',
      color: 'primary.contrastText',
      mr: 0.5,
      mb: 0.5,
    }}
  />
);

const ProgressIndicator = ({ progress }: { progress: number }) => (
  <Box sx={{ width: '100%', mt: 1 }}>
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        height: 4,
        borderRadius: 2,
        bgcolor: 'action.hover',
        '& .MuiLinearProgress-bar': {
          borderRadius: 2,
        },
      }}
    />
    <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
      {progress}% završeno
    </Typography>
  </Box>
);

const StatusIndicator = ({ status }: { status: Category['status'] }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'success.main';
      case 'in_progress':
        return 'primary.main';
      case 'to_review':
        return 'warning.main';
      default:
        return 'text.secondary';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Završeno';
      case 'in_progress':
        return 'U toku';
      case 'to_review':
        return 'Za ponavljanje';
      default:
        return '';
    }
  };

  return (
    <Typography
      variant="caption"
      sx={{
        color: getStatusColor(),
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: getStatusColor(),
        }}
      />
      {getStatusText()}
    </Typography>
  );
};

export default function Sidebar({ onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState('chat');
  const { state: { searchQuery }, setSearchQuery } = useChatContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isMobile && collapsed) {
      setCollapsed(false);
    }
  }, [isMobile]);

  const handleResizeStart = (e: React.MouseEvent) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.min(Math.max(e.clientX, MIN_DRAWER_WIDTH), MAX_DRAWER_WIDTH);
      setDrawerWidth(newWidth);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

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
    setCollapsed(!collapsed);
    if (!collapsed) {
      setExpandedCategory(null);
    }
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasSubCategories = category.subCategories && category.subCategories.length > 0;
    const isExpanded = expandedCategory === category.id;

    return (
      <React.Fragment key={category.id}>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedItem === category.id}
            onClick={() => handleCategoryClick(category.id)}
            sx={{
              minHeight: 48,
              px: 2.5,
              pl: 2.5 + level * 2,
              ...(collapsed && {
                justifyContent: 'center',
                px: 1.5,
              }),
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 2,
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
            {(!collapsed || isMobile) && (
              <>
                <ListItemText
                  primary={category.name}
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      {category.status && <StatusIndicator status={category.status} />}
                      {category.tags && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                          {category.tags.map((tag) => (
                            <TagChip key={tag} tag={tag} />
                          ))}
                        </Box>
                      )}
                      {category.progress !== undefined && (
                        <ProgressIndicator progress={category.progress} />
                      )}
                    </Box>
                  }
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: category.type === 'year' || category.type === 'semester' ? 600 : 400,
                  }}
                  secondaryTypographyProps={{
                    component: 'div',
                  }}
                />
                {hasSubCategories && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>
        {(!collapsed || isMobile) && hasSubCategories && (
          <Collapse in={isExpanded}>
            <List disablePadding>
              {category.subCategories?.map((subCategory) => renderCategory(subCategory, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        width: collapsed ? COLLAPSED_DRAWER_WIDTH : drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      {/* Resize handle */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          cursor: 'col-resize',
          '&:hover': {
            bgcolor: 'primary.main',
          },
          bgcolor: isResizing ? 'primary.main' : 'transparent',
        }}
        onMouseDown={handleResizeStart}
      />

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {!collapsed && !isMobile && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            ACAI Assistant
          </Typography>
        )}
        <IconButton onClick={toggleCollapse} sx={{ display: isMobile ? 'none' : 'inline-flex' }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Search Bar */}
      {(!collapsed || isMobile) && (
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
        {categories.map((category) => renderCategory(category))}
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
        {(!collapsed || isMobile) && (
          <Avatar
            alt="User"
            src="/user-avatar.png"
            sx={{ width: 32, height: 32 }}
          />
        )}
        {(!collapsed || isMobile) ? (
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
        {(!collapsed || isMobile) && (
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
    </Box>
  );
}
