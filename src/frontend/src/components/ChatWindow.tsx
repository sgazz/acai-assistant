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

export default function ChatWindow() {
  const theme = useTheme();
  const { 
    state: { messages, isLoading, error, editMessageId },
    setEditMessageId,
    updateMessage,
    addReaction,
    removeReaction,
    clearChat,
    sendMessage
  } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0); // Za force refresh

  const messageGroups = useMemo(() => {
    const groups: MessageGroup[] = [];
    let currentDate = '';
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString('sr-RS', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (date !== currentDate) {
        groups.push({
          date,
          messages: [message]
        });
        currentDate = date;
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });
    
    return groups;
  }, [messages]);

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
    scrollToBottom();
  }, [messages]);

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

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const isEditing = editMessageId === message.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.3
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', mb: 2 }}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            style={{ maxWidth: '80%', width: 'fit-content' }}
          >
            <Paper
              elevation={theme.palette.mode === 'dark' ? 2 : 0}
              sx={{
                p: 2,
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
                position: 'relative',
              }}
            >
              <Box sx={{ mb: 2 }}>
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
                          {copiedMessageId === message.id ? (
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
                        {copiedMessageId === message.id ? (
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
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
      </motion.div>
    );
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 140px)',
        overflowY: 'auto',
        p: 2,
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.100',
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
              <RefreshIcon />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {initialLoading ? (
        <MessageSkeleton />
      ) : messages.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            opacity: 0.7
          }}
        >
          <ArticleIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Nema poruka
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Započnite razgovor slanjem prve poruke
          </Typography>
        </Box>
      ) : (
        <>
          {messageGroups.map((group, index) => (
            <React.Fragment key={group.date}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  my: 3,
                  opacity: 0.7,
                }}
              >
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {group.date}
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              {group.messages.map((message) => (
                <React.Fragment key={message.id}>
                  {renderMessage(message)}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </>
      )}
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 0}
            sx={{
              p: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
              borderRadius: '18px 18px 18px 4px',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'divider',
            }}
          >
            <TypingIndicator />
          </Paper>
        </Box>
      )}
      
      <div ref={messagesEndRef} style={{ height: 1 }} />

      <Dialog
        open={!!selectedMessage}
        onClose={handleCloseSources}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Izvori</Typography>
            <IconButton onClick={handleCloseSources} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMessage?.sources?.map((source, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {source.filename}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stranica {source.page_number}
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
