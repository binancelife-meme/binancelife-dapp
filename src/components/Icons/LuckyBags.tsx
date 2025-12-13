import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// 乾坤袋基础形状：上窄下宽，中间有绳子束口
// 在袋身中央增加中文数字标识 (一, 二, 三, 四)，更符合东方玄幻风格

// 一等奖 - 乾坤袋·至尊金 (金色，中文数字 一)
export const FirstPrizeBag = ({ size = 32, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* 袋身主体 */}
    <path d="M12 5C9 5 7 6.5 6.5 8C5.5 11 4 16 6 19C7.5 21.2 10 22 12 22C14 22 16.5 21.2 18 19C20 16 18.5 11 17.5 8C17 6.5 15 5 12 5Z" fill="#F59E0B"/>
    {/* 袋口褶皱 */}
    <path d="M8 4C8 3 9.5 2 12 2C14.5 2 16 3 16 4C16 5 14.5 6 12 6C9.5 6 8 5 8 4Z" fill="#FCD34D"/>
    {/* 金色系带 */}
    <path d="M7 8C7 8 9 9 12 9C15 9 17 8 17 8" stroke="#FFFBEB" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 9L10 11M13 9L14 11" stroke="#FFFBEB" strokeWidth="1.5" strokeLinecap="round"/>
    {/* 数字 一 */}
    <text x="12" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFBEB" style={{ fontFamily: 'sans-serif' }}>一</text>
  </svg>
);

// 二等奖 - 乾坤袋·紫金葫 (紫色，中文数字 二)
export const SecondPrizeBag = ({ size = 32, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* 袋身 */}
    <path d="M12 5C9.5 5 7.5 6.5 7 8C6 11 5 16 6.5 19C7.8 21.2 10 22 12 22C14 22 16.2 21.2 17.5 19C19 16 18 11 17 8C16.5 6.5 14.5 5 12 5Z" fill="#9333EA"/>
    {/* 袋口 */}
    <path d="M8.5 4C8.5 3 9.8 2 12 2C14.2 2 15.5 3 15.5 4C15.5 5 14.2 6 12 6C9.8 6 8.5 5 8.5 4Z" fill="#C084FC"/>
    {/* 银色系带 */}
    <path d="M7.5 8C7.5 8 9.5 9 12 9C14.5 9 16.5 8 16.5 8" stroke="#E9D5FF" strokeWidth="1.5" strokeLinecap="round"/>
    {/* 数字 二 */}
    <text x="12" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#E9D5FF" style={{ fontFamily: 'sans-serif' }}>二</text>
  </svg>
);

// 三等奖 - 乾坤袋·如意红 (橙红，中文数字 三)
export const ThirdPrizeBag = ({ size = 32, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* 袋身 */}
    <path d="M12 5C9.5 5 7.5 6.5 7 8C6 11 5 16 6.5 19C7.8 21.2 10 22 12 22C14 22 16.2 21.2 17.5 19C19 16 18 11 17 8C16.5 6.5 14.5 5 12 5Z" fill="#EA580C"/>
    {/* 袋口 */}
    <path d="M8.5 4C8.5 3 9.8 2 12 2C14.2 2 15.5 3 15.5 4C15.5 5 14.2 6 12 6C9.8 6 8.5 5 8.5 4Z" fill="#FB923C"/>
    {/* 黄色系带 */}
    <path d="M7.5 8C7.5 8 9.5 9 12 9C14.5 9 16.5 8 16.5 8" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round"/>
    {/* 数字 三 */}
    <text x="12" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FEF3C7" style={{ fontFamily: 'sans-serif' }}>三</text>
  </svg>
);

// 四等奖 - 乾坤袋·聚灵蓝 (蓝色，中文数字 四)
export const FourthPrizeBag = ({ size = 32, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* 袋身 */}
    <path d="M12 5C9.5 5 7.5 6.5 7 8C6 11 5 16 6.5 19C7.8 21.2 10 22 12 22C14 22 16.2 21.2 17.5 19C19 16 18 11 17 8C16.5 6.5 14.5 5 12 5Z" fill="#2563EB"/>
    {/* 袋口 */}
    <path d="M8.5 4C8.5 3 9.8 2 12 2C14.2 2 15.5 3 15.5 4C15.5 5 14.2 6 12 6C9.8 6 8.5 5 8.5 4Z" fill="#60A5FA"/>
    {/* 浅蓝系带 */}
    <path d="M7.5 8C7.5 8 9.5 9 12 9C14.5 9 16.5 8 16.5 8" stroke="#DBEAFE" strokeWidth="1.5" strokeLinecap="round"/>
    {/* 数字 四 */}
    <text x="12" y="18" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#DBEAFE" style={{ fontFamily: 'sans-serif' }}>四</text>
  </svg>
);
