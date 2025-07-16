import { NextRequest, NextResponse } from 'next/server';

type GlobalWithAvatarStore = typeof globalThis & { avatarStore: Map<string, any> };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, avatarId } = body;

    if (!walletAddress || !avatarId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get avatar from store
    if (!(globalThis as GlobalWithAvatarStore).avatarStore) {
      (globalThis as GlobalWithAvatarStore).avatarStore = new Map();
    }
    const avatar = (globalThis as GlobalWithAvatarStore).avatarStore.get(walletAddress);

    if (!avatar) {
      return NextResponse.json(
        { error: 'Avatar not found' },
        { status: 404 }
      );
    }

    // In a real implementation, you would:
    // 1. Deploy or use an existing NFT contract on Filecoin
    // 2. Call the contract's mint function
    // 3. Store the transaction hash and token ID

    // For demo purposes, we'll simulate NFT minting
    const mockNFTData = {
      tokenId: `cyberpunk_${Date.now()}`,
      contractAddress: '0x1234567890123456789012345678901234567890', // Mock contract address
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      metadata: {
        name: avatar.metadata.name,
        description: avatar.metadata.description,
        image: `ipfs://${avatar.ipfsHash}`,
        attributes: [
          {
            trait_type: 'Platform',
            value: avatar.metadata.traits.platform
          },
          {
            trait_type: 'Style',
            value: avatar.metadata.traits.style
          },
          {
            trait_type: 'Created At',
            value: avatar.metadata.traits.createdAt
          }
        ]
      }
    };

    // Update avatar with NFT data
    const updatedAvatar = {
      ...avatar,
      nftTokenId: mockNFTData.tokenId,
      nftContractAddress: mockNFTData.contractAddress
    };

    (globalThis as GlobalWithAvatarStore).avatarStore.set(walletAddress, updatedAvatar);

    return NextResponse.json({
      success: true,
      nft: {
        tokenId: mockNFTData.tokenId,
        contractAddress: mockNFTData.contractAddress,
        transactionHash: mockNFTData.transactionHash,
        blockNumber: mockNFTData.blockNumber
      },
      message: 'Avatar NFT minted successfully on Filecoin'
    });

  } catch (error) {
    console.error('Error minting NFT:', error);
    return NextResponse.json(
      { error: 'Failed to mint NFT' },
      { status: 500 }
    );
  }
} 