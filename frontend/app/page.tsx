"use client";

import { Variants } from "framer-motion";
import { HeroSection } from "../components/landing/HeroSection";
import { AboutSection } from "../components/landing/AboutSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export default function LandingPage() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
  };
  const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
  };

  return (
    <div className="overflow-x-hidden">
      <HeroSection fadeUp={fadeUp} stagger={stagger} />
      <AboutSection />
      <HowItWorksSection />
    </div>
  );
}
