import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Gift, Star, Play, Volume2, VolumeX } from "lucide-react";
import { useInView } from "react-intersection-observer";

const AboutUs: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

 
  const toggleVideo = () => {
    const video = document.getElementById("aboutVideo") as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const video = document.getElementById("aboutVideo") as HTMLVideoElement;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const video = document.getElementById("aboutVideo") as HTMLVideoElement;
    if (video && inView) {
      video.play().catch(() => {});
      setIsPlaying(true);
    }

    return () => {
      if (video) {
        video.pause();
        setIsPlaying(false);
      }
    };
  }, [inView]);

  return (
    <section className="py-12 px-4 sm:px-6 md:px-12 bg-white">
      <div
        ref={ref}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full md:w-1/3 flex justify-center md:justify-start relative"
        >
          <div className="relative w-64 sm:w-72 md:w-80 lg:w-96 rounded-2xl overflow-hidden shadow-xl">
            <video
              id="aboutVideo"
              src="/about.mp4"
              loop
              muted={isMuted}
              playsInline
              className="w-full h-auto object-cover"
            />

            <button
              onClick={toggleVideo}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
            >
              {!isPlaying && <Play className="w-12 h-12 text-white" />}
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="absolute cursor-pointer bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* ----------- TEXT SECTION ----------- */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="w-full md:w-2/3 flex flex-col justify-center text-center md:text-left"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-[#C45A36]">CraftiCrazy</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-700 mb-3 font-serif leading-relaxed">
            At{" "}
            <span className="font-semibold text-gray-900">CraftiCrazy</span>, we
            craft gifts that speak the language of emotions. From handmade
            hampers to keepsakes, rakhis, photo frames, and more — every
            creation celebrates moments and memories.
          </p>

          <p className="text-base sm:text-lg text-gray-700 mb-5 font-serif leading-relaxed">
            Perfect for birthdays, anniversaries, festivals, or any special
            occasion where love, thoughtfulness, and quality matter.
          </p>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 font-serif">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Heart className="text-[#C45A36] w-6 h-6" />
              <span className="text-gray-800 font-medium">Made with Love</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Gift className="text-[#C45A36] w-6 h-6" />
              <span className="text-gray-800 font-medium">Unique Gifts</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Star className="text-[#C45A36] w-6 h-6" />
              <span className="text-gray-800 font-medium">Premium Quality</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
