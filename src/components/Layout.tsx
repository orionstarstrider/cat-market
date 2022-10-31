import type { FC } from "react";
import Container from "@mui/material/Container";
import { styled } from '@mui/material/styles';

const Stack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: theme.spacing(3, 0),
  '& > *:not(:only-child)': {
    '&:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
  },
}));

const Layout: FC = ({ children }) => (
  <Container>
    <Stack>
      {children}
    </Stack>
  </Container>
);

export default Layout;
