import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';

export default function Footer() {
  return (
    <Box sx={{ position: 'fixed', bottom: 0, width: '100%', bgcolor: 'primary.main', display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, px: 2, py: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center', mb: { xs: 2, lg: 0 } }}>
        <MuiLink href="https://x.com/FILBuilders" sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: 'background.paper', border: 2, borderColor: 'text.primary', borderRadius: '50%', boxShadow: 3, px: 1, py: 1, transition: 'all 0.2s', '&:hover': { bgcolor: 'text.primary', color: 'background.paper' } }}>
          <Image src="/assets/logos/x-logo.png" width={30} height={30} alt="X Logo" />
        </MuiLink>
        <MuiLink href="https://discord.com/invite/filecoin" sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: 'background.paper', border: 2, borderColor: 'text.primary', borderRadius: '50%', boxShadow: 3, px: 1, py: 1, transition: 'all 0.2s', '&:hover': { bgcolor: 'text.primary', color: 'background.paper' } }}>
          <Image src="/assets/logos/discord-logo.png" width={30} height={30} alt="Discord Logo" />
        </MuiLink>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="common.white">Made with</Typography>
        <Image src="/assets/icons/heart.png" width={30} height={30} alt="Heart Icon" />
        <Typography variant="body2" color="common.white">by Team FIL-B</Typography>
      </Box>
    </Box>
  );
}