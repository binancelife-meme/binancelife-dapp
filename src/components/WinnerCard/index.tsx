import { Chip, Avatar } from "@heroui/react";
import { Trophy, Medal, Crown } from "lucide-react";
import React from "react";

import { getShortAddress } from "@/utils/address";

export interface WinnerCardProps {
  id: string;
  roundId: string;
  winnerAddress?: string;
  winnerName?: string;
  winnerAvatar?: string;
  prizeAmount: string;
  prizeUnit: string;
  winningNumbers: string[]; // e.g. ["01", "05", "12", "18", "22"]
  rank: 1 | 2 | 3 | 4; // 1=Grand Prize, 2=Second, 3=Third, 4=Consolation
  timestamp: string;
  showAvatar?: boolean;
}

const WinnerCard: React.FC<WinnerCardProps> = ({
  roundId,
  winnerAddress,
  winnerName,
  winnerAvatar,
  prizeAmount,
  prizeUnit,
  winningNumbers,
  rank,
  timestamp,
  showAvatar = true,
}) => {
  const getRankInfo = (rank: number) => {
    switch (rank) {
      case 1:
        return { 
          label: "Grand Prize", 
          color: "warning", 
          icon: <Crown className="w-3.5 h-3.5 text-yellow-500" />,
          text: "text-yellow-500",
          bg: "bg-yellow-500/10 border-yellow-500/20"
        };
      case 2:
        return { 
          label: "2nd Prize", 
          color: "default", 
          icon: <Medal className="w-3.5 h-3.5 text-gray-300" />,
          text: "text-gray-300",
          bg: "bg-gray-500/10 border-gray-500/20"
        };
      case 3:
        return { 
          label: "3rd Prize", 
          color: "danger", 
          icon: <Medal className="w-3.5 h-3.5 text-amber-600" />,
          text: "text-amber-600",
          bg: "bg-amber-500/10 border-amber-500/20"
        };
      default:
        return { 
          label: "Consolation", 
          color: "primary", 
          icon: <Trophy className="w-3.5 h-3.5 text-blue-400" />,
          text: "text-blue-400",
          bg: "bg-blue-500/10 border-blue-500/20"
        };
    }
  };

  const rankInfo = getRankInfo(rank);

  return (
    <div className={`w-full ${rankInfo.bg} border rounded-lg p-2.5 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors`}>
      {/* Left: User & Rank */}
      <div className="flex items-center gap-3 min-w-0">
        {showAvatar && (
          <Avatar 
            src={winnerAvatar} 
            className="w-9 h-9 flex-shrink-0 ring-2 ring-white/10"
          />
        )}
        <div className="min-w-0 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm truncate max-w-[100px] sm:max-w-[150px]">
              {winnerName || (winnerAddress ? getShortAddress(winnerAddress) : "Unknown")}
            </span>
            <Chip 
              size="sm" 
              variant="flat" 
              classNames={{
                base: `h-4 px-1 ${rankInfo.bg}`,
                content: `text-[10px] font-bold ${rankInfo.text} flex items-center gap-1`
              }}
            >
              {rankInfo.icon}
              <span className="hidden xs:inline">{rankInfo.label}</span>
            </Chip>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span>#{roundId}</span>
            <span>•</span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>

      {/* Right: Prize & Numbers */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold font-mono text-white">{prizeAmount}</span>
          <span className="text-[10px] text-gray-500">{prizeUnit}</span>
        </div>
        <div className="flex items-center gap-1">
          {winningNumbers.slice(0, 5).map((num, idx) => (
            <span 
              key={idx} 
              className={`
                flex items-center justify-center w-5 h-5 rounded text-[10px] font-mono font-bold
                ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-gray-300'}
              `}
            >
              {num}
            </span>
          ))}
          {winningNumbers.length > 5 && (
            <span className="text-[10px] text-gray-500">...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;
