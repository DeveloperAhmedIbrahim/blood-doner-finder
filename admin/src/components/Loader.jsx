import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export default function Loader({ open = false }) {
  return (
    <Backdrop open={open} sx={{ zIndex: 1300 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
