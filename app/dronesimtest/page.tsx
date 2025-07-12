'use client'

import { Container, Typography } from '@mui/material'
import DroneSimCanvas from '../../components/DroneSimCanvas'

export default function DroneSimTestPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        DroneSimTest 3D Demo
      </Typography>
      <DroneSimCanvas />
    </Container>
  )
}