import React from "react";

export default function Footer(): React.ReactNode {
  return (
    <footer className="w-full py-4 bg-[#181e2a] text-center border-t border-[#232c43] text-[#bdb89c] text-sm">
      © {new Date().getFullYear()} CyberPunk Metaverse. All rights reserved.
    </footer>
  );
}
