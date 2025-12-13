"use client";

import { Suspense } from "react";

import Container from "@/components/Container";

import Leaderboard from "./Leaderboard";

const LeaderboardPage = () => {
  return (
    <Container>
      <Suspense>
        <Leaderboard />
      </Suspense>
    </Container>
  );
};

export default LeaderboardPage;
