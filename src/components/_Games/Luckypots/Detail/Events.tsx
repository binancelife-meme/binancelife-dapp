import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";

import type { Luckypot } from "@/types";

import Activity from "./Activity";
import MyTickets from './MyTickets';
import Participants from "./Participants";
import SponsorsList from "./SponsorsList";

const Events = ({ item }: { item: Luckypot }) => {
  const t = useTranslations("luckypot.detail.tabs");
  return (
    <div className="flex-grow-1">
      <Tabs 
        classNames={{
          cursor: "bg-[#F0B90B] shadow-[0_0_10px_rgba(240,185,11,0.5)]",
          tabContent: "group-data-[selected=true]:text-black font-semibold",
          tabList: "bg-[#18181b] border border-white/10 p-1"
        }}
        variant="light"
      >
        <Tab key="activity" title={t('activity')}>
          <Card className="bg-[#18181b] border border-white/5 shadow-none rounded-xl">
            <CardBody className="p-0 overflow-hidden">
              <Activity item={item} />
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="participants"
          title={`${t('participants')}${item.participants && `(${item.participants})`}`}
        >
          <Card className="bg-[#18181b] border border-white/5 shadow-none rounded-xl">
            <CardBody className="p-0 overflow-hidden">
              <Participants item={item} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="myticket" title={t('my_tickets')}>
          <Card className="bg-[#18181b] border border-white/5 shadow-none rounded-xl">
            <CardBody className="p-0 overflow-hidden">
              <MyTickets item={item} />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="sponsors" title={t('sponsors')}>
          <Card className="bg-[#18181b] border border-white/5 shadow-none rounded-xl">
            <CardBody className="p-0 overflow-hidden">
              <SponsorsList item={item} className="!bg-transparent !border-none !p-4" />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Events;
