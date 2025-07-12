import { WalletConnect } from '../../components/databridge/walletConnect';
import Footer from '../../components/databridge/footer';
import Header from '../../components/databridge/header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function Home() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'primary.main' }}>
      <Header />
      <Container maxWidth="lg" sx={{ pt: 16, pb: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: 'common.white' }}>
        <Typography variant="h2" fontWeight={700} sx={{ mb: 4, maxWidth: { xs: '100%', md: 700 } }}>
          Cross-Chain Data Storage on Filecoin
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Effortlessly bridge your data to Filecoin from Avalanche
        </Typography>
        <WalletConnect />
      </Container>
      <Footer />
    </Box>
  );
}
