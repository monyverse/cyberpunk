# Avatar Integration Test Guide

## ✅ Build Errors Fixed

The build errors have been resolved:
- ✅ Fixed import path: `@/utils/pinata` instead of relative path
- ✅ Fixed TypeScript errors with global avatarStore
- ✅ Dev server is running properly
- ✅ API endpoints are responding

## 🧪 Testing the Avatar Integration

### 1. **Test API Endpoints**

```bash
# Test avatar store endpoint
curl -X POST http://localhost:3000/api/avatar/store \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "avatarUrl": "https://models.readyplayer.me/123456789.glb",
    "metadata": {
      "name": "Test Avatar",
      "description": "A test avatar",
      "traits": {
        "platform": "readyplayerme",
        "style": "cyberpunk",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }'
```

### 2. **Test Avatar Retrieval**

```bash
# Test getting avatar by address
curl http://localhost:3000/api/avatar/0x1234567890123456789012345678901234567890
```

### 3. **Test NFT Minting**

```bash
# Test NFT minting
curl -X POST http://localhost:3000/api/avatar/mint-nft \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "avatarId": "avatar_123"
  }'
```

## 🎭 Testing the UI

### 1. **Visit the Avatar Page**
- Go to `http://localhost:3000/avatars`
- You should see the cyberpunk-themed avatar creator

### 2. **Connect Wallet**
- Click "Connect Wallet" if not already connected
- Verify wallet status shows "Connected"

### 3. **Create Avatar**
- Click "Create Avatar" to open Ready Player Me
- Customize your avatar
- Export the avatar
- Fill in metadata (name, description)
- Click "Store on Filecoin"

### 4. **Verify Storage**
- Check the sidebar for avatar status
- Should show "Stored on Filecoin/IPFS"
- Note the IPFS hash

### 5. **Mint NFT**
- Click "Mint NFT" button
- Verify NFT minting success
- Check for token ID and contract address

## 🔧 Environment Setup

Make sure your `.env.local` has the Pinata credentials:

```bash
PINATA_API_KEY=6d6b5780109cccbd58d0
PINATA_SECRET_KEY=y9a4a6eefd91365f8ae53e54e921396c341305848be4adb04054e5c5aeeede268
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2NzY0MGU3Yi0yZmMxLTQxN2ItOTg5My1kZjY3ZTA4NDc0MmYiLCJlbWFpbCI6Im1hbngzOTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjZkNmI1NzgwMTA5Y2NjYmQ1OGQwIiwic2NvcGVkS2V5U2VjcmV0IjoiOWE0YTZlZWZkOTEzNjVmOGFlNTNlNTRlOTIxMzk2YzM0MTMwNTg0OGJlNGFkYjA0MDU0ZTVjNWFlZWVkZTI2OCIsImV4cCI6MTc4MzkyMzU0OX0.udPiplMfdB5rFrbIDk_pJqeg_OlhJSS0GIHVoFtYC64
```

## 🐛 Troubleshooting

### If you see build errors:
1. Restart the dev server: `npm run dev`
2. Clear Next.js cache: `rm -rf .next`
3. Check TypeScript compilation: `npx tsc --noEmit`

### If API calls fail:
1. Check environment variables are set
2. Verify Pinata API keys are valid
3. Check network connectivity

### If UI doesn't load:
1. Check browser console for errors
2. Verify wallet connection
3. Check if Ready Player Me is accessible

## 🎉 Success Indicators

✅ **Build Success**: No TypeScript errors in terminal
✅ **API Working**: Endpoints return proper responses
✅ **UI Loading**: Avatar page loads with cyberpunk theme
✅ **Wallet Connected**: Shows connected wallet address
✅ **Avatar Created**: Ready Player Me integration works
✅ **Filecoin Storage**: Avatar stored on IPFS with hash
✅ **NFT Minted**: NFT created with token ID

## 🚀 Next Steps

1. **Test with Real Data**: Create actual avatars and store them
2. **Verify IPFS**: Check files are accessible via IPFS gateway
3. **Test NFT**: Verify NFT metadata on Filecoin explorer
4. **Integration**: Connect with other parts of the CyberPunk app
5. **Production**: Deploy to production with proper database 