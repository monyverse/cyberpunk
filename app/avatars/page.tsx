'use client';

import React, { useState } from 'react';
import AvatarCreatorComponent from '../../components/AvatarCreator';
import { Container } from '@mui/material';

export default function AvatarsPage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarCreated = (url: string) => {
    setAvatarUrl(url);
    console.log('Avatar created:', url);
  };

  return (
    <Container maxWidth={false} sx={{ p: 0 }}>
      <AvatarCreatorComponent 
        onAvatarCreated={handleAvatarCreated}
        initialAvatarUrl={avatarUrl || undefined}
      />
    </Container>
  );
} 