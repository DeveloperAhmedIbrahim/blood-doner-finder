import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2', // brand blue
    },
    secondary: {
      main: '#9C27B0',
    },
    success: { main: '#2E7D32' },
    error: { main: '#D32F2F' },
    warning: { main: '#ED6C02' },
    info: { main: '#0288D1' },
    background: {
      default: '#F5F7FA',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

export default theme;
