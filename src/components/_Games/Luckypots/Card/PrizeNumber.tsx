import { FirstPrizeBag, FourthPrizeBag, SecondPrizeBag, ThirdPrizeBag } from "@/components/Icons/LuckyBags";
import { cn } from "@/utils/cn";

export type PrizeLevel = 0 | 1 | 2 | 3;

interface PrizeNumberProps {
  level: number;
  number: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PrizeNumber = ({ level, number, size = "md", className }: PrizeNumberProps) => {
  // 根据索引选择不同的福袋图标
  const BagIcon = [FirstPrizeBag, SecondPrizeBag, ThirdPrizeBag, FourthPrizeBag][level] || FourthPrizeBag;

  // 定义不同奖项的背景样式
  const styles = [
    "border-yellow-500/20 text-yellow-500", // 一等奖：金色系
    "border-gray-500/20 text-gray-300", // 二等奖：紫色系
    "border-amber-500/20 text-amber-600", // 三等奖：橙色系
    "border-blue-500/20 text-blue-400",       // 四等奖：蓝色系
  ][level] || "bg-default-50 border-default-200";

  // 定义不同奖项的文字样式
  const textStyles = [
    "text-yellow-500",
    "text-gray-300",
    "text-amber-600",
    "text-blue-400",
  ][level] || "text-default-700";

  // 尺寸配置
  const sizeConfig = {
    sm: {
      icon: 16,
      padding: "pl-1 pr-2 py-0.5",
      text: "text-xs",
      bg: "bg-black/40"
    },
    md: {
      icon: 20,
      padding: "pl-1.5 pr-2.5 py-1",
      text: "text-sm",
      bg: "bg-black/40"
    },
    lg: {
      icon: 24,
      padding: "pl-2 pr-3 py-1.5",
      text: "text-base",
      bg: "bg-black/40"
    }
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border shadow-sm shrink-0",
        config.padding,
        config.bg,
        styles,
        className
      )}
    >
      <BagIcon size={config.icon} className="drop-shadow-sm shrink-0" />
      <span className={cn("font-bold font-mono leading-none", config.text, textStyles)}>
        {number}
      </span>
    </div>
  );
};

export default PrizeNumber;
