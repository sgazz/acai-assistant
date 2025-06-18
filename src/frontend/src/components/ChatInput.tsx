'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Tooltip, Paper, Collapse, Chip, Fade, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useChatContext } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';

const quickReplies = [
  'Objasni mi ovo detaljnije',
  'Možeš li da mi daš primer?',
  'Kako se ovo povezuje sa...',
  'Da li možeš da mi pokažeš korak po korak?',
];

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, state: { isTyping, isLoading }, stopGenerating } = useChatContext();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
      setIsExpanded(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        // TODO: Implementirati upload fajlova
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessage(prev => `${prev}\nUploaded: ${files[0].name}`);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implementirati snimanje glasa
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Tooltip title="Priloži fajl">
              <IconButton
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <CircularProgress size={24} />
                ) : (
                  <AttachFileIcon />
                )}
              </IconButton>
            </Tooltip>
            
            <TextField
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder={isTyping ? 'AI kuca odgovor...' : 'Napišite poruku...'}
              disabled={isTyping}
              inputRef={textareaRef}
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: 3,
                  bgcolor: 'background.default',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                },
                endAdornment: (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isLoading && (
                      <Tooltip title="Prekini generisanje">
                        <IconButton
                          color="error"
                          onClick={stopGenerating}
                        >
                          <StopIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={isRecording ? 'Zaustavi snimanje' : 'Glasovna poruka'}>
                      <IconButton
                        color={isRecording ? 'error' : 'primary'}
                        onClick={handleVoiceRecord}
                      >
                        {isRecording ? <StopIcon /> : <MicIcon />}
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      type="submit"
                      color="primary"
                      disabled={!message.trim() || isTyping}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark',
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                ),
              }}
            />
          </Box>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {quickReplies.map((reply, index) => (
                    <Chip
                      key={index}
                      label={reply}
                      onClick={() => {
                        setMessage(reply);
                        setIsExpanded(false);
                      }}
                      sx={{
                        '&:hover': {
                          bgcolor: 'action.selected',
                        },
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </form>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt"
      />
    </Paper>
  );
}
