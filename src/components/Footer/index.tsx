import { Divider } from "@heroui/react";

import Container from "@/components/Container";
import SocialMedia from "@/components/SocialMedia";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const year = currentYear > 2025 ? `2025-${currentYear}` : `${currentYear}`;

  return (
    <Container className="bg-[#09090b] border-t border-white/5 py-8 mt-auto">
      <div className="flex flex-col items-center gap-6">
        <SocialMedia className="flex gap-4 text-gray-400 hover:text-[#F0B90B] transition-colors" />
        
        <Divider className="w-full max-w-sm bg-white/5" />
        
        <div className="text-xs text-gray-500 text-center">
          Copyright © {year} BinanceLife.Meme All rights reserved
        </div>
      </div>
    </Container>
  );
};

export default Footer;
