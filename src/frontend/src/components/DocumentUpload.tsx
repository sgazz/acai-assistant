'use client';

import React, { useState, useRef } from 'react';
import { Box, Button, Typography, LinearProgress, IconButton, Tooltip, Paper, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';

export default function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'text/plain') {
      setSelectedFile(file);
      simulateUpload();
    } else {
      alert('Podržani formati su: PDF, DOC, DOCX, TXT');
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'application/pdf':
        return <PictureAsPdfIcon />;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <ArticleIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 2,
        bgcolor: isDragging ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        accept=".pdf,.doc,.docx,.txt"
      />

      {!selectedFile ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 3,
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Prevucite dokument ovde ili{' '}
            <Button
              variant="text"
              onClick={() => fileInputRef.current?.click()}
              sx={{ textTransform: 'none' }}
            >
              izaberite fajl
            </Button>
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center">
            Podržani formati: PDF, DOC, DOCX, TXT
          </Typography>
        </Box>
      ) : (
        <Fade in={!!selectedFile}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: 'text.secondary' }}>
                {getFileIcon(selectedFile.type)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" noWrap>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
              <Tooltip title="Obriši">
                <IconButton size="small" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {uploadProgress < 100 && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {uploadProgress}% otpremljeno
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      )}
    </Paper>
  );
} 