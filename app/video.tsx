import VideoPlayer from "../components/VideoPlayer";

export default function VideoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#181e2a] text-[#bdb89c] p-8">
      <h1 className="text-4xl font-bold mb-4">Cyberpunk Metaverse Video Player</h1>
      <p className="mb-8 text-lg max-w-xl text-center">
      CyberPunk WildNet is an AR-driven real-world metaverse game that lets players remotely control drones to explore wildlife zones, discover virtual collectibles, interact with AI NPCs, contribute real conservation data, and fly to earn. Demo link:
        <br />
        <span className="text-[#6ec1c8] break-all">https://cyberpunk-metaverse.vercel.app/modular-worlds-video.mp4</span>
      </p>
      <VideoPlayer
        src="/modular-worlds-video.mp4"
        poster="/cyberpunk-logo.png"
        title="Modular Worlds Hackathon Video"
      />
    </div>
  );
} 