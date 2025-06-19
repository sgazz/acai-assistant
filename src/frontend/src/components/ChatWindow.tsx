'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, CircularProgress, Fade, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, Skeleton, Alert, Divider } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import RefreshIcon from '@mui/icons-material/Refresh';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useChatContext } from '../context/ChatContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, MessageReaction } from '../types/chat';
import ChatInput from './ChatInput';

const MessageSkeleton = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      {[...Array(3)].map((_, i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
          <Skeleton
            variant="rounded"
            width={i % 2 === 0 ? '60%' : '70%'}
            height={80}
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderRadius: i % 2 === 0 ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

// Dodajemo novu komponentu za indikator tipkanja
const TypingIndicator = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{ width: 8, height: 8, borderRadius: '50%', background: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600] }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
        style={{ width: 8, height: 8, borderRadius: '50%', background: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600] }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
        style={{ width: 8, height: 8, borderRadius: '50%', background: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600] }}
      />
    </Box>
  );
};

const CodeBlock = ({ language, value }: { language: string, value: string }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
        }}
      >
        <Tooltip title={copied ? "Kopirano!" : "Kopiraj kod"}>
          <IconButton
            size="small"
            onClick={handleCopy}
            sx={{
              color: theme.palette.mode === 'dark' ? 'grey.400' : 'grey.600',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
              },
            }}
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      <SyntaxHighlighter
        style={theme.palette.mode === 'dark' ? vscDarkPlus as any : tomorrow as any}
        language={language}
        customStyle={{
          margin: 0,
          borderRadius: 8,
          padding: '16px',
          backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#F8F9FA',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </Box>
  );
};

interface MessageGroup {
  date: string;
  messages: Message[];
}

const ReactionButton = ({ 
  messageId, 
  type, 
  count, 
  reacted, 
  onReact 
}: { 
  messageId: number;
  type: MessageReaction['type'];
  count: number;
  reacted: boolean;
  onReact: () => void;
}) => {
  const theme = useTheme();
  
  const getIcon = () => {
    switch (type) {
      case 'like':
        return <ThumbUpIcon fontSize="small" />;
      case 'dislike':
        return <ThumbDownIcon fontSize="small" />;
      case 'helpful':
        return <EmojiEventsIcon fontSize="small" />;
      case 'thanks':
        return <FavoriteIcon fontSize="small" />;
      default:
        return <ThumbUpIcon fontSize="small" />;
    }
  };

  const getButtonStyles = () => {
    if (!reacted) {
      return {
        color: theme.palette.text.secondary,
        hoverBgColor: theme.palette.mode === 'dark' 
          ? 'rgba(255,255,255,0.1)' 
          : 'rgba(0,0,0,0.05)',
      };
    }

    switch (type) {
      case 'like':
        return {
          color: theme.palette.primary.main,
          hoverBgColor: theme.palette.primary.dark,
        };
      case 'dislike':
        return {
          color: theme.palette.error.main,
          hoverBgColor: theme.palette.error.dark,
        };
      case 'helpful':
        return {
          color: theme.palette.success.main,
          hoverBgColor: theme.palette.success.dark,
        };
      case 'thanks':
        return {
          color: theme.palette.secondary.main,
          hoverBgColor: theme.palette.secondary.dark,
        };
      default:
        return {
          color: theme.palette.primary.main,
          hoverBgColor: theme.palette.primary.dark,
        };
    }
  };

  const styles = getButtonStyles();

  return (
    <Tooltip title={reacted ? `Ukloni ${type}` : `Dodaj ${type}`}>
      <Button
        size="small"
        variant={reacted ? "contained" : "outlined"}
        onClick={onReact}
        startIcon={getIcon()}
        sx={{
          minWidth: 'auto',
          px: 1,
          py: 0.5,
          borderRadius: '16px',
          color: reacted ? 'white' : styles.color,
          bgcolor: reacted ? styles.color : 'transparent',
          borderColor: styles.color,
          '&:hover': {
            bgcolor: styles.hoverBgColor,
          },
        }}
      >
        {count > 0 && count}
      </Button>
    </Tooltip>
  );
};

export type ChatWindowProps = {
  activeTab?: number;
};

export default function ChatWindow({ activeTab }: ChatWindowProps) {
  const theme = useTheme();
  const { 
    state: { messages, isLoading, error, editMessageId, searchQuery, filteredMessages },
    setEditMessageId,
    updateMessage,
    addReaction,
    removeReaction,
    clearChat,
    sendMessage,
    setSearchQuery
  } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  const messageGroups = useMemo(() => {
    const groups: MessageGroup[] = [];
    let currentDate = '';
    
    // Sortiramo poruke po timestamp-u od najstarije ka najnovijoj
    const messagesToGroup = (searchQuery ? filteredMessages : messages).slice().sort((a, b) => a.timestamp - b.timestamp);
    
    messagesToGroup.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('sr-RS', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (date !== currentDate) {
        currentDate = date;
        groups.push({
          date,
          messages: [message]
        });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });
    
    return groups;
  }, [messages, filteredMessages, searchQuery]);

  useEffect(() => {
    // Simuliramo inicijalno učitavanje
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
    setInitialLoading(true);
    // Ovde možete dodati logiku za ponovno učitavanje poruka
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!initialLoading) {
      scrollToBottom();
    }
  }, [messages.length, filteredMessages.length, searchQuery, initialLoading]);

  useEffect(() => {
    if (typeof activeTab !== 'undefined' && activeTab === 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [activeTab]);

  const handleCopyMessage = (messageId: number) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      navigator.clipboard.writeText(message.content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const handleStartEdit = (messageId: number) => {
    setEditMessageId(messageId);
    setEditContent(messages.find(m => m.id === messageId)?.content || '');
  };

  const handleSaveEdit = (messageId: number) => {
    if (editContent.trim() !== messages.find(m => m.id === messageId)?.content) {
      updateMessage(messageId, editContent.trim());
    }
    setEditMessageId(null);
  };

  const handleCancelEdit = (messageId: number) => {
    setEditMessageId(null);
    setEditContent(messages.find(m => m.id === messageId)?.content || '');
  };

  const handleShowSources = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleCloseSources = () => {
    setSelectedMessage(null);
  };

  const handleReaction = (messageId: number, type: MessageReaction['type'], reacted: boolean) => {
    if (reacted) {
      removeReaction(messageId, type);
    } else {
      addReaction(messageId, type);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.sender === 'user';
    const isEditing = editMessageId === message.id;
    const isCopied = copiedMessageId === message.id;

    return (
      <Box
        key={`message-${message.id}-${index}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
          mb: 2,
          width: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.3
          }}
          style={{
            maxWidth: '100%',
            minWidth: 0
          }}
        >
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 0}
            sx={{
              p: { xs: 1, sm: 2 },
              width: '100%',
              maxWidth: { xs: '95vw', sm: '90vw', md: '85%' },
              bgcolor: isUser
                ? theme.palette.mode === 'dark'
                  ? 'primary.dark'
                  : 'primary.main'
                : theme.palette.mode === 'dark'
                  ? 'background.paper'
                  : 'grey.50',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'divider',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 2px 8px rgba(0,0,0,0.2)'
                : '0 2px 4px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 4px 12px rgba(0,0,0,0.3)'
                  : '0 4px 8px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ 
              mb: 2,
              wordBreak: 'break-word',
              '& p': {
                margin: 0,
                lineHeight: 1.6,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                letterSpacing: '0.01em',
              },
              '& pre': {
                margin: '1rem 0',
                padding: '1rem',
                borderRadius: '8px',
                overflowX: 'auto',
              },
              '& code': {
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
              },
              '& ul, & ol': {
                margin: '0.5rem 0',
                paddingLeft: '1.5rem',
              },
              '& li': {
                marginBottom: '0.5rem',
              },
              '& blockquote': {
                margin: '1rem 0',
                padding: '0.5rem 1rem',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              },
            }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  autoFocus
                  sx={{
                    '& .MuiInputBase-input': {
                      color: isUser ? 'primary.contrastText' : 'text.primary',
                    },
                  }}
                />
              ) : (
                <Box>
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <Typography variant="h5" fontWeight={700} gutterBottom {...props} />,
                      h2: ({node, ...props}) => <Typography variant="h6" fontWeight={700} gutterBottom {...props} />,
                      h3: ({node, ...props}) => <Typography variant="subtitle1" fontWeight={600} gutterBottom {...props} />,
                      ul: ({node, ...props}) => <Box component="ul" sx={{ pl: 3, mb: 1 }} {...props} />,
                      ol: ({node, ...props}) => <Box component="ol" sx={{ pl: 3, mb: 1 }} {...props} />,
                      li: ({node, ...props}) => <li style={{ marginBottom: 4 }}>{props.children}</li>,
                      a: ({node, ...props}) => <a style={{ color: '#1976d2', wordBreak: 'break-all' }} target="_blank" rel="noopener noreferrer" {...props} />,
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <CodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, '')}
                          />
                        ) : (
                          <Box
                            component="code"
                            sx={{
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'grey.100',
                              color: theme.palette.mode === 'dark' ? 'primary.light' : 'secondary.dark',
                              px: 0.7,
                              py: 0.2,
                              borderRadius: 1,
                              fontSize: 14,
                              fontFamily: 'monospace'
                            }}
                            {...props}
                          >
                            {children}
                          </Box>
                        );
                      },
                      blockquote: ({node, ...props}) => <Box component="blockquote" sx={{ borderLeft: '4px solid #1976d2', pl: 2, color: 'grey.700', fontStyle: 'italic', my: 1 }} {...props} />,
                      p: ({node, ...props}) => <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-line' }} {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </Box>
              )}
            </Box>

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1,
                mt: 1,
                pt: 1,
                borderTop: '1px solid',
                borderColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: 0.7,
                  color: isUser ? 'primary.contrastText' : 'text.secondary'
                }}
              >
                {new Date(message.timestamp).toLocaleTimeString('sr-RS', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>

              {isUser ? (
                isEditing ? (
                  <>
                    <Tooltip title="Sačuvaj">
                      <IconButton
                        size="small"
                        onClick={() => handleSaveEdit(message.id)}
                        sx={{
                          color: 'primary.contrastText',
                          opacity: 0.7,
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Otkaži">
                      <IconButton
                        size="small"
                        onClick={() => handleCancelEdit(message.id)}
                        sx={{
                          color: 'primary.contrastText',
                          opacity: 0.7,
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Kopiraj">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyMessage(message.id)}
                        sx={{
                          color: isUser ? 'primary.contrastText' : 'text.secondary',
                          opacity: 0.7,
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        {isCopied ? (
                          <CheckIcon fontSize="small" />
                        ) : (
                          <ContentCopyIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Izmeni">
                      <IconButton
                        size="small"
                        onClick={() => handleStartEdit(message.id)}
                        sx={{
                          color: isUser ? 'primary.contrastText' : 'text.secondary',
                          opacity: 0.7,
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </>
                )
              ) : (
                <>
                  <Tooltip title="Kopiraj">
                    <IconButton
                      size="small"
                      onClick={() => handleCopyMessage(message.id)}
                      sx={{
                        color: isUser ? 'primary.contrastText' : 'text.secondary',
                        opacity: 0.7,
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      {isCopied ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <ContentCopyIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  {message.sources && message.sources.length > 0 && (
                    <Tooltip title="Prikaži izvore">
                      <IconButton
                        size="small"
                        onClick={() => handleShowSources(message)}
                        sx={{
                          opacity: 0.7,
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <ArticleIcon fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          {message.sources.length}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </motion.div>
        
        {!isUser && (
          <Box 
            sx={{ 
              display: 'flex',
              gap: 1,
              mt: 1,
              ml: 1,
            }}
          >
            {['like', 'dislike', 'helpful', 'thanks'].map((type) => {
              const reaction = message.reactions?.find(r => r.type === type as MessageReaction['type']);
              return (
                <ReactionButton
                  key={type}
                  messageId={message.id}
                  type={type as MessageReaction['type']}
                  count={reaction?.count || 0}
                  reacted={reaction?.reacted || false}
                  onReact={() => handleReaction(message.id, type as MessageReaction['type'], reaction?.reacted || false)}
                />
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
        position: 'relative',
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {searchQuery && (
        <Box
          sx={{
            p: { xs: 1, sm: 2 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {filteredMessages.length === 0
              ? 'Nema rezultata za pretragu'
              : `Pronađeno ${filteredMessages.length} ${
                  filteredMessages.length === 1 ? 'rezultat' : 'rezultata'
                } za "${searchQuery}"`}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setSearchQuery('')}
            sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: { xs: 1, sm: 2 },
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
            '&:hover': {
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            },
          },
        }}
      >
        {error && (
          <Alert 
            severity="error" 
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={handleRetry}
              >
                <RefreshIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {initialLoading ? (
          <MessageSkeleton />
        ) : (
          messageGroups.map((group, groupIndex) => (
            <Box key={`group-${group.date}-${groupIndex}`}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  my: 3,
                  px: 2,
                }}
              >
                <Divider sx={{ flex: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0,0,0,0.05)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {group.date}
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              {group.messages.map((message, index) => renderMessage(message, index))}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
        }}
      >
        <ChatInput />
      </Box>

      <Dialog
        open={Boolean(selectedMessage)}
        onClose={handleCloseSources}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Izvori</DialogTitle>
        <DialogContent>
          {selectedMessage?.sources?.map((source, index) => (
            <Box key={`source-${index}-${source.title}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ArticleIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">
                {source.title} - {source.content}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSources}>Zatvori</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
