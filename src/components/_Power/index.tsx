"use client";

import { Suspense } from "react";

import Container from "@/components/Container";

import LuckyPower from "./LuckyPower";

const PowerPage = () => {
  return (
    <Container>
      <Suspense>
        <LuckyPower />
      </Suspense>
    </Container>
  );
};

export default PowerPage;
