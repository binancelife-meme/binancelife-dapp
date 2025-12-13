import type { Luckypot } from "@/types";

const Description = ({ item }: { item: Luckypot }) => {
  return (
    item?.note && (
      <div
        className="flex px-4 py-3 bg-[#18181b] border border-white/5 rounded-2xl text-foreground-800 whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: `${item?.note}` }}
      ></div>
    )
  );
};

export default Description;
