'use client';

import { Box, Typography, Button } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <Typography variant="h5" color="error">
        Došlo je do greške!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {error.message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => reset()}
      >
        Pokušaj ponovo
      </Button>
    </Box>
  );
} 