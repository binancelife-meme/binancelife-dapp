import { useTranslations } from "next-intl";

const LuckypotGuide = () => {
  const t = useTranslations("luckypotCreate");
  return (
    <div className="p-4 mt-2 gap-4 text-foreground-800">
      <h1 className="text-pl font-semibold">{t("guide.title")}</h1>
      <ul className="list-disc p-2 pl-4 space-y-4 text-pm">
        {t("guide.desc").split("\n").map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default LuckypotGuide;
