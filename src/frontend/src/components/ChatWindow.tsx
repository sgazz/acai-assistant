'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, CircularProgress, Fade, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import { useChatContext } from '../context/ChatContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types/chat';

export default function ChatWindow() {
  const { 
    state: { messages, isLoading, error, editMessageId },
    setEditMessageId,
    updateMessage
  } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const isEditing = editMessageId === message.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', mb: 2 }}>
          <Box sx={{ maxWidth: '80%' }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: isUser ? 'primary.main' : 'background.paper',
                color: isUser ? 'primary.contrastText' : 'text.primary',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoFocus
                    sx={{
                      '& .MuiInputBase-input': {
                        color: 'primary.contrastText',
                      },
                    }}
                  />
                ) : (
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ mb: !isUser && message.sources && message.sources.length > 0 ? 1 : 0 }}>
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
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ borderRadius: 8, fontSize: 14, margin: 0 }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <Box component="code" sx={{ bgcolor: 'grey.100', color: 'secondary.dark', px: 0.7, py: 0.2, borderRadius: 1, fontSize: 14, fontFamily: 'monospace' }} {...props}>
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
                    {!isUser && message.sources && message.sources.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Prikaži izvore">
                          <IconButton
                            size="small"
                            onClick={() => handleShowSources(message)}
                            sx={{
                              opacity: 0.5,
                              transition: 'opacity 0.2s',
                              '&:hover': {
                                opacity: 1,
                              },
                            }}
                          >
                            <ArticleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {message.sources.length} {message.sources.length === 1 ? 'izvor' : 'izvora'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isUser ? 'flex-end' : 'flex-start', mt: 0.5 }}>
                  <Typography variant="caption" color={isUser ? 'primary.contrastText' : 'text.secondary'} sx={{ opacity: 0.7 }}>
                    {new Date(message.timestamp).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  {isUser ? (
                    <>
                      {isEditing ? (
                        <>
                          <Tooltip title="Sačuvaj">
                            <IconButton
                              size="small"
                              onClick={() => handleSaveEdit(message.id)}
                              sx={{
                                ml: 1,
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
                                ml: 1,
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
                                ml: 1,
                                color: 'primary.contrastText',
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
                                ml: 1,
                                color: 'primary.contrastText',
                                opacity: 0.7,
                                '&:hover': { opacity: 1 },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Tooltip title="Kopiraj">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyMessage(message.id)}
                          sx={{
                            ml: 1,
                            color: 'text.secondary',
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
                              ml: 1,
                              color: 'text.secondary',
                              opacity: 0.7,
                              '&:hover': { opacity: 1 },
                            }}
                          >
                            <ArticleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </motion.div>
    );
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.default',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'stretch',
          maxWidth: '100%',
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              {renderMessage(message)}
            </React.Fragment>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      {isLoading && (
        <Fade in={isLoading}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'background.paper',
              p: 1,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                '@keyframes dots': {
                  '0%, 20%': { content: '".  "' },
                  '40%': { content: '".. "' },
                  '60%': { content: '"..."' },
                  '80%, 100%': { content: '"   "' },
                },
                '&::after': {
                  content: '"..."',
                  animation: 'dots 1.5s infinite',
                }
              }}
            />
          </Box>
        </Fade>
      )}

      {error && (
        <Fade in={!!error}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'error.main',
              color: 'error.contrastText',
              p: 1,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        </Fade>
      )}

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
