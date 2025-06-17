'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        gap: 2,
      }}
    >
      <Typography variant="h5" color="text.primary">
        Stranica nije pronađena
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Stranica koju tražite ne postoji ili je uklonjena.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/"
      >
        Povratak na početnu
      </Button>
    </Box>
  );
} 