import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'GET') {
    // Replace with real Filecoin share logic
    const shareUrl = `https://yourapp.com/proofsets/${id}/share`;
    res.status(200).json({ shareUrl });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 