import Image from "next/image";
import { motion } from "framer-motion";
import { Zap, CheckCircle2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { storySlides } from "../../data/landing";

export function AboutSection() {
  return (
    <section id="about" className="py-28 bg-white relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm font-semibold text-[#0EA5E9] mb-6">
              <Zap className="w-4 h-4" />
              Human-Centred Civic Platform
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontStyle: "italic" }}>
              Your voice,{" "}
              <span className="shimmer-text">heard by the city.</span>
            </h2>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              SmartCity isn't just a reporting tool — it's a bridge between people and the
              institutions that serve them. Instant AI triage means your complaint reaches the
              right desk in seconds, not days.
            </p>
            <ul className="space-y-4">
              {[
                "Real-time status tracking on every report.",
                "Smart AI triage prevents duplicate tickets.",
                "Direct integration with city maintenance APIs.",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <div className="w-6 h-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Story Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 w-full"
          >
            <Swiper
              grabCursor centeredSlides slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              modules={[Pagination, Autoplay]}
              className="w-full h-[380px] rounded-3xl overflow-hidden shadow-xl"
            >
              {storySlides.map((slide, i) => (
                <SwiperSlide key={i} className="relative h-[380px]">
                  <Image src={slide.img} alt={slide.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-7">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30 mb-3 inline-block">
                      {slide.label}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight" style={{ fontStyle: "italic" }}>
                      {slide.title}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
