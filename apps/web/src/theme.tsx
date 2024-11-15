import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';
import { PropsWithChildren } from 'react';

const theme = createTheme({
  spacing: 8,
  components: {
    MuiBreadcrumbs: {
      defaultProps: {},
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiIcon: {
      defaultProps: {
        fontSize: 'inherit',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiStack: {
      defaultProps: {
        spacing: 2,
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'inherit',
      },
      styleOverrides: {
        root: {
          verticalAlign: 'text-top',
        },
      },
    },
  },
});

export const ThemeProvider = (props: PropsWithChildren) => (
  <MUIThemeProvider theme={theme} {...props} />
);
