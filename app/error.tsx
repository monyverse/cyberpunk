"use client";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', color: 'text.primary', p: 4 }}>
      <Typography variant="h3" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {error.message || 'An unexpected error occurred.'}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => reset()}>
        Try again
      </Button>
    </Box>
  );
} 