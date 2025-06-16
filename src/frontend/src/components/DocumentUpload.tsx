import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface DocumentUploadProps {
  onUploadSuccess?: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8001/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus(`Success: ${data.message}`);
        onUploadSuccess?.();
      } else {
        setUploadStatus(`Error: ${data.detail}`);
      }
    } catch (error) {
      setUploadStatus('Error: Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <input
        accept=".pdf,.docx"
        style={{ display: 'none' }}
        id="document-upload"
        type="file"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <label htmlFor="document-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={isUploading}
        >
          Upload Document
        </Button>
      </label>
      
      {isUploading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {uploadStatus && (
        <Typography
          variant="body2"
          color={uploadStatus.startsWith('Error') ? 'error' : 'success'}
          sx={{ mt: 1 }}
        >
          {uploadStatus}
        </Typography>
      )}
    </Box>
  );
};

export default DocumentUpload; 