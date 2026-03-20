"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Try multiple known free Lottie animation URLs (travel/transport themed)
const ANIMATION_URLS = [
  "https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json",
  "https://assets10.lottiefiles.com/packages/lf20_myejiggj.json",
  "https://assets2.lottiefiles.com/packages/lf20_qdbb21wb.json",
  "https://assets9.lottiefiles.com/packages/lf20_soCRuE.json",
  "https://assets5.lottiefiles.com/packages/lf20_rbtawnux.json",
];

export default function HeroAnimation() {
  const [animData, setAnimData] = useState<object | null>(null);

  useEffect(() => {
    // Try each URL until one works
    const tryLoad = async () => {
      for (const url of ANIMATION_URLS) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("json") || contentType.includes("javascript")) {
              const data = await res.json();
              if (data && data.v) { // Valid Lottie has "v" field
                setAnimData(data);
                return;
              }
            }
          }
        } catch {
          continue;
        }
      }
    };
    tryLoad();
  }, []);

  if (!animData) return null; // Don't show anything if no animation loads — clean fallback

  return (
    <div className="w-full max-w-sm mx-auto h-32 sm:h-40 flex items-center justify-center mt-2 mb-4">
      <Lottie
        animationData={animData}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
