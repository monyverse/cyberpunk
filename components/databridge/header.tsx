'use client';

import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';

import { NavbarWalletComponent } from './navbarWalletComponent';

const Header = () => {
  return (
    <Box sx={{ position: 'fixed', top: 0, width: '100%', bgcolor: 'primary.main', height: 80, display: 'flex', alignItems: 'center', zIndex: 10 }}>
      <Box sx={{ position: 'relative', left: 16 }}>
        <Link href="/" passHref legacyBehavior>
          <Box component="a" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Image src="/assets/logos/fil-b-logo.png" width={250} height={250} alt="FIL-B Logo" />
            </Box>
            <Box sx={{ display: { xs: 'block', lg: 'none' }, bgcolor: 'background.paper', border: 2, borderColor: 'text.primary', borderRadius: '50%', boxShadow: 3, px: 1, py: 1, ml: 2 }}>
              <Image src="/assets/logos/fil-b-mini-logo.png" width={30} height={30} alt="FIL-B Logo" />
            </Box>
          </Box>
        </Link>
      </Box>
      <Box sx={{ position: 'fixed', right: 24 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
          <NavbarWalletComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
