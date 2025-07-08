import dynamic from 'next/dynamic';

export default function DataBridgePage() {
  // If databridge is a Next.js app, you could use an iframe or dynamic import
  // For now, just a placeholder
  return (
    <div className="card w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cross-Chain Data Bridge</h1>
      <p className="mb-4">This module allows you to bridge data from Avalanche and other chains to Filecoin. (UI integration coming soon)</p>
      {/* TODO: Embed or link to databridge UI here */}
    </div>
  );
} 