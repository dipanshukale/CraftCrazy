import React, { useEffect, useRef, useState } from "react";

const reels = [

  { id: 1, src: "/Scrapbook.mp4" },
  { id: 2, src: "/Dad.mp4" },
  { id: 3, src: "/Hishamper.mp4" },
  { id: 4, src: "/liveframe.mp4" },
  { id: 5, src: "/Tray.mp4" },
  { id: 6, src: "/flower.mp4" },

  
];

const ReelsRow = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [visibleVideos, setVisibleVideos] = useState<number[]>([]);

  // Lazy load videos using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting && !visibleVideos.includes(index)) {
            setVisibleVideos((prev) => [...prev, index]);
          }
        });
      },
      { root: scrollRef.current, threshold: 0.25 }
    );

    const videos = scrollRef.current?.querySelectorAll("video");
    videos?.forEach((v) => observer.observe(v));

    return () => observer.disconnect();
  }, [visibleVideos]);

  // Smooth infinite auto-scroll
  const startScrolling = () => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPos = container.scrollLeft;
    const speed = window.innerWidth < 640 ? 0.8 : window.innerWidth < 1024 ? 1.2 : 1.8;

    const scroll = () => {
      if (!container) return;
      scrollPos += speed;
      if (scrollPos >= container.scrollWidth / 2) {
        scrollPos = 0;
        container.scrollLeft = 0;
      } else {
        container.scrollLeft = scrollPos;
      }
      rafRef.current = requestAnimationFrame(scroll);
    };

    rafRef.current = requestAnimationFrame(scroll);
  };

  const stopScrolling = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  useEffect(() => {
    startScrolling();
    return () => stopScrolling();
  }, []);

  return (
    <div className="w-full bg-[#FBFAF7] py-12">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#432818] mb-12">
        Handmade Wonders That Speak Stories
      </h2>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 cursor-grab"
        onMouseEnter={stopScrolling}
        onMouseLeave={startScrolling}
        onTouchStart={stopScrolling}
        onTouchEnd={startScrolling}
      >
        {[...reels, ...reels].map((reel, index) => (
          <video
            key={index}
            data-index={index}
            
            src={visibleVideos.includes(index) ? reel.src : ""}
            autoPlay={visibleVideos.includes(index)}
            muted
            loop
            playsInline
            className="w-[200px] sm:w-[220px] md:w-[250px] h-[350px] sm:h-[380px] md:h-[400px] rounded-2xl object-cover flex-shrink-0 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
};

export default ReelsRow;
