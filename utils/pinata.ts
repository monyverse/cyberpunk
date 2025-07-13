// Pinata API utilities for Filecoin/IPFS integration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface PinataMetadata {
  name: string;
  keyvalues?: Record<string, string>;
}

export async function pinFileToIPFS(file: Blob, name: string): Promise<PinataResponse> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error('Pinata API credentials not configured');
  }

  const formData = new FormData();
  formData.append('file', file, name);

  const metadata = JSON.stringify({
    name: name,
    keyvalues: {
      platform: 'cyberpunk-metaverse',
      type: 'avatar',
      timestamp: new Date().toISOString()
    }
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
    wrapWithDirectory: false
  });
  formData.append('pinataOptions', options);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata upload failed: ${error}`);
  }

  return await response.json();
}

export async function pinJSONToIPFS(json: any, name?: string): Promise<PinataResponse> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error('Pinata API credentials not configured');
  }

  const metadata: PinataMetadata = {
    name: name || 'cyberpunk-avatar-metadata',
    keyvalues: {
      platform: 'cyberpunk-metaverse',
      type: 'metadata',
      timestamp: new Date().toISOString()
    }
  };

  const data = {
    pinataContent: json,
    pinataMetadata: metadata,
    pinataOptions: {
      cidVersion: 0
    }
  };

  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata JSON upload failed: ${error}`);
  }

  return await response.json();
}

export async function unpinFromIPFS(hash: string): Promise<boolean> {
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error('Pinata API credentials not configured');
  }

  const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${hash}`, {
    method: 'DELETE',
    headers: {
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    }
  });

  return response.ok;
}

export function getIPFSGatewayUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

export function getFilecoinGatewayUrl(cid: string): string {
  return `https://filecoin.io/ipfs/${cid}`;
} 