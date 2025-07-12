import type { NextApiRequest, NextApiResponse } from 'next';

// Mock data for demonstration; replace with real Filecoin logic
const mockProofSets = [
  {
    id: '1',
    name: 'Drone Mission Proof',
    type: 'Mission Verification',
    status: 'verified',
    createdAt: '2024-01-15 14:30',
    size: '2.5 MB',
    hash: '0x1234567890abcdef...',
    description: 'Proof of successful drone mission completion'
  },
  // ... more mock data
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const proof = mockProofSets.find(p => p.id === id);
    if (!proof) {
      return res.status(404).json({ error: 'Proof set not found' });
    }
    res.status(200).json(proof);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 