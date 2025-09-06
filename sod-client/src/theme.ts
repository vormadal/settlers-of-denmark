import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
      fontSize: '1.1rem',
    },
    body1: {
      fontWeight: 600,
      fontSize: '0.95rem',
    },
    body2: {
      fontWeight: 700,
      fontSize: '1.2rem',
    },
  },
  palette: {
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;