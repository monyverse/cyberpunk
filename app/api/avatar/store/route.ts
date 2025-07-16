import { NextRequest, NextResponse } from 'next/server';
import { pinFileToIPFS, pinJSONToIPFS } from '@/utils/pinata';

interface AvatarMetadata {
  name: string;
  description: string;
  traits: {
    platform: string;
    style: string;
    createdAt: string;
    [key: string]: any;
  };
}

interface StoreAvatarRequest {
  walletAddress: string;
  avatarUrl: string;
  metadata: AvatarMetadata;
}

export async function POST(request: NextRequest) {
  try {
    const body: StoreAvatarRequest = await request.json();
    const { walletAddress, avatarUrl, metadata } = body;

    if (!walletAddress || !avatarUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Download the avatar file from Ready Player Me
    const avatarResponse = await fetch(avatarUrl);
    if (!avatarResponse.ok) {
      throw new Error('Failed to download avatar from Ready Player Me');
    }

    const avatarBuffer = await avatarResponse.arrayBuffer();
    const avatarBlob = new Blob([avatarBuffer], { type: 'application/octet-stream' });

    // Upload avatar file to IPFS via Pinata
    const ipfsResult = await pinFileToIPFS(avatarBlob, `${metadata.name}.glb`);

    // Create metadata JSON for the avatar
    const avatarMetadata = {
      name: metadata.name,
      description: metadata.description,
      image: `ipfs://${ipfsResult.IpfsHash}`,
      external_url: avatarUrl,
      attributes: [
        {
          trait_type: 'Platform',
          value: metadata.traits.platform
        },
        {
          trait_type: 'Style',
          value: metadata.traits.style
        },
        {
          trait_type: 'Created At',
          value: metadata.traits.createdAt
        }
      ],
      properties: {
        files: [
          {
            type: 'model/gltf-binary',
            uri: `ipfs://${ipfsResult.IpfsHash}`
          }
        ],
        category: 'avatar',
        wallet_address: walletAddress
      }
    };

    // Upload metadata to IPFS
    const metadataResult = await pinJSONToIPFS(avatarMetadata);

    // Store avatar record in database (in-memory for demo)
    const avatarRecord = {
      id: `avatar_${Date.now()}`,
      walletAddress,
      avatarUrl,
      ipfsHash: ipfsResult.IpfsHash,
      filecoinCid: ipfsResult.IpfsHash, // Same as IPFS hash for Filecoin
      metadata: {
        ...metadata,
        ipfsMetadataHash: metadataResult.IpfsHash
      },
      storedAt: new Date().toISOString(),
    };

    // In a real app, you'd store this in a database
    // For demo purposes, we'll use a simple in-memory store
    if (!(global as unknown as { avatarStore: Map<string, any> }).avatarStore) {
      (global as unknown as { avatarStore: Map<string, any> }).avatarStore = new Map();
    }
    (global as unknown as { avatarStore: Map<string, any> }).avatarStore.set(walletAddress, avatarRecord);

    return NextResponse.json({
      success: true,
      avatar: avatarRecord,
      ipfs: {
        fileHash: ipfsResult.IpfsHash,
        metadataHash: metadataResult.IpfsHash,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${ipfsResult.IpfsHash}`,
        metadataUrl: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`
      }
    });

  } catch (error) {
    console.error('Error storing avatar:', error);
    return NextResponse.json(
      { error: 'Failed to store avatar' },
      { status: 500 }
    );
  }
} 