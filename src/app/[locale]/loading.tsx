"use client";

import Loading from "@/components/Loading";

export default function LoadingPage() {
  return (
    <div className="h-dvh w-full flex justify-center items-center content-center bg-background">
      <Loading className="mx-auto mb-4 w-24 h-24" />
    </div>
  );
}
