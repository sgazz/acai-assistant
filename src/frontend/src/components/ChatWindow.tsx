'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip, CircularProgress, Fade, TextField } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
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

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const isEditing = message.id === editMessageId;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%' }}
      >
        <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', width: '100%' }}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              mb: 3,
              maxWidth: 700,
              width: '100%',
              bgcolor: isUser ? 'primary.main' : 'background.paper',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: isUser ? 3 : 1,
              position: 'relative',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              fontSize: '1.08rem',
              fontFamily: 'inherit',
              transition: 'background 0.2s',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  variant="outlined"
                  size="small"
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                    },
                  }}
                />
              ) : (
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
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isUser ? 'flex-end' : 'flex-start', mt: 0.5 }}>
                <Typography variant="caption" color={isUser ? 'primary.contrastText' : 'text.secondary'} sx={{ opacity: 0.7 }}>
                  {new Date(message.timestamp).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                {isUser && (
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
                        <Tooltip title="Izmeni">
                          <IconButton
                            size="small"
                            onClick={() => handleStartEdit(message.id)}
                            sx={{
                              ml: 1,
                              opacity: 0.5,
                              transition: 'opacity 0.2s',
                              '&:hover': {
                                opacity: 1,
                                color: 'primary.contrastText',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={copiedMessageId === message.id ? 'Kopirano!' : 'Kopiraj'}>
                          <IconButton
                            size="small"
                            onClick={() => handleCopyMessage(message.id)}
                            sx={{
                              ml: 1,
                              opacity: 0.5,
                              transition: 'opacity 0.2s',
                              '&:hover': {
                                opacity: 1,
                                color: 'primary.contrastText',
                              },
                            }}
                          >
                            {copiedMessageId === message.id ? <CheckIcon /> : <ContentCopyIcon />}
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Paper>
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
              right: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'background.paper',
              p: 1,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <CircularProgress size={20} />
            <Typography variant="body2">AI piše...</Typography>
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
    </Box>
  );
}
