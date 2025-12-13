"use client";

import { Suspense } from "react";

import LatestWinner from "@/components/_Winners/LatestWinner";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { useWindowSize } from "@/hooks";

import FAQs from "../FAQ";

import AuditSection from "./AuditSection";
import HotLuckypot from "./HotLuckypot";
import IntroSection from "./IntroSection";
import Landscape from "./Landscape";


const HomePage = () => {
  const { isMobile } = useWindowSize();
  return (
    <>
      <Container>
        <Landscape />
      </Container>

      <Container>
        <Suspense>
          <HotLuckypot />
        </Suspense>
      </Container>

      <Container>
        <LatestWinner />
      </Container>

      <Container>
        <AuditSection />
        <IntroSection />
      </Container>

      <Container>
        <FAQs />
      </Container>
      {isMobile && <Footer />}
    </>
  );
};

export default HomePage;
