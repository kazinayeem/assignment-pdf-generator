"use client";

import dynamic from "next/dynamic";

export const DevelopmentNoticeModal = dynamic(
  () =>
    import("./development-notice-modal").then((m) => m.DevelopmentNoticeModal),
  { ssr: false }
);
