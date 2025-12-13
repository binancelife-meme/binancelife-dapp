"use client";

import { Chip, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";
import Slider from "react-slick";

import LuckypotCard from "@/components/_Games/Luckypots/Card";
import LuckypotListLoading from "@/components/_Games/Luckypots/List/loading";
import type { Luckypot } from "@/types";

import SlickArrow from "./CardSlickArrow";

const settings = {
  infinite: false,
  speed: 700,
  slidesToShow: 3,
  swipeToSlide: true,
  nextArrow: (
    <SlickArrow>
      <Icon
        className="text-foreground-600 bg-gradient-dark rounded-full"
        height={36}
        width={36}
        icon="iconoir:page-right"
      />
    </SlickArrow>
  ),
  prevArrow: (
    <SlickArrow>
      <Icon
        className="text-foreground-600 bg-gradient-dark rounded-full"
        height={36}
        icon="iconoir:page-left"
        width={36}
      />
    </SlickArrow>
  ),
  responsive: [
    {
      breakpoint: 1179,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 639,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const LuckypotCardSlider = ({
  className,
  title,
  isLoading,
  items,
}: {
  className?: string;
  title?: string;
  isLoading?: boolean;
  items?: Luckypot[];
}) => {
  return (
    <div className="relative w-full">
      <Spacer y={4} />
      {isLoading && (
        <div className="grid mt-3 w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          <LuckypotListLoading length={3} />
        </div>
      )}
      {!isLoading && (
        <Slider className={className} {...settings}>
          {items?.length &&
            items?.map((x, index) => (
              <LuckypotCard key={index} item={x} linkPrefix="luck" />
            ))}
        </Slider>
      )}
    </div>
  );
};

export default LuckypotCardSlider;
