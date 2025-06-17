'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Tooltip, Paper, Collapse, Chip, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import { useChatContext } from '../context/ChatContext';

const quickReplies = [
  'Objasni mi ovo detaljnije',
  'Možeš li da mi daš primer?',
  'Kako se ovo povezuje sa...',
  'Da li možeš da mi pokažeš korak po korak?',
];

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useChatContext();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
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

  const insertMarkdown = (type: 'bold' | 'italic' | 'code' | 'link') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    let newText = '';

    switch (type) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      case 'link':
        newText = `[${selectedText}](url)`;
        break;
    }

    const newMessage = message.substring(0, start) + newText + message.substring(end);
    setMessage(newMessage);

    // Fokusiraj textarea i postavi kursor na kraj umetnutog teksta
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Bold">
              <IconButton size="small" onClick={() => insertMarkdown('bold')}>
                <FormatBoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton size="small" onClick={() => insertMarkdown('italic')}>
                <FormatItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Code">
              <IconButton size="small" onClick={() => insertMarkdown('code')}>
                <CodeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Link">
              <IconButton size="small" onClick={() => insertMarkdown('link')}>
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Priloži fajl">
              <IconButton size="small">
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <TextField
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            placeholder="Napišite poruku..."
            inputRef={textareaRef}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.default',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              },
            }}
          />

          <Collapse in={isExpanded}>
            <Fade in={isExpanded}>
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
            </Fade>
          </Collapse>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Pošalji (Enter)">
              <IconButton
                type="submit"
                color="primary"
                disabled={!message.trim()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </form>
    </Paper>
  );
}
