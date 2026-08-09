"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, MapPin, Search, BarChart3, Zap, Shield, Brain, Activity, CheckCircle2, Target, Clock, LayoutGrid, AlertCircle, Wrench, ChevronRight, FileCheck, RefreshCw } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import Image from "next/image";

// Hero carousel — original issue images
const carouselItems = [
  { id: 1, title: "Report Potholes",       category: "Road",        img: "/scene_pothole.png" },
  { id: 2, title: "Water Leaks",            category: "Water",       img: "/scene_water.png" },
  { id: 3, title: "Broken Streetlights",    category: "Electricity", img: "/scene_electricity.png" },
  { id: 4, title: "Waste Management",       category: "Waste",       img: "/scene_garbage.png" }
];

// About section — human story carousel
const storySlides = [
  { img: "/citizen_scene.png",      label: "Road Issue",       title: "She spotted it. AI routed it." },
  { img: "/scene_electricity.png",  label: "Electricity",      title: "Dark street? Not for long." },
  { img: "/scene_water.png",        label: "Water Leak",       title: "One tap. City takes note." },
  { img: "/scene_pothole.png",      label: "Pothole",          title: "Reported. Tracked. Resolved." },
  { img: "/scene_garbage.png",      label: "Waste",            title: "Community speaks. City listens." },
];

const stats = [
  { value: "2.4K+",  label: "Issues Resolved",    icon: <Activity className="w-5 h-5" />, color: "#0EA5E9" },
  { value: "87%",    label: "AI Accuracy",         icon: <Brain className="w-5 h-5" />,    color: "#3B82F6" },
  { value: "< 3hrs", label: "Avg Response",        icon: <Zap className="w-5 h-5" />,      color: "#16A34A" },
  { value: "14",     label: "Issue Categories",    icon: <Shield className="w-5 h-5" />,   color: "#D97706" },
];

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

      {/* ============ HERO — off-white #F7F6F2 ============ */}
      <section className="relative bg-[#F7F6F2] pt-44 pb-28 overflow-hidden">

        {/* Subtle orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-cyan absolute -top-16 -left-16 w-[320px] h-[320px] rounded-full opacity-30" />
          <div className="orb-purple absolute top-10 right-0 w-[260px] h-[260px] rounded-full opacity-20" />
          <div className="grid-dots absolute inset-0" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">



          {/* Editorial Hero Content */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 md:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Copy & CTA */}
              <div className="lg:col-span-6 flex flex-col pt-10 lg:pt-0">
                {/* Top Eyebrow */}
                <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#0EA5E9] opacity-60"></span>
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">Human-Centred Civic Platform</span>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="text-5xl lg:text-[5rem] font-bold text-gray-900 leading-[1.05] tracking-tight mb-6"
                >
                  Your city, <span className="text-[#0EA5E9] italic pr-2 font-serif">finally</span> listening.
                </motion.h1>

                <motion.p variants={fadeUp} className="text-lg text-gray-500 mb-10 max-w-lg leading-relaxed">
                  Snap a photo of that pothole, broken pipe, or flickering streetlight. Our system handles the classification, routing it directly to the right department so your neighborhood gets fixed, faster.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                  <Link href="/report" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-[#0EA5E9] hover:bg-[#0284c7] text-white px-7 py-3.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)] hover:-translate-y-0.5">
                      Report an Issue via AI 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/#services" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-transparent border border-[#0EA5E9] hover:bg-blue-50 text-[#0EA5E9] px-7 py-3.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-[#0EA5E9] border-b-[4px] border-b-transparent ml-0.5" />
                      </div>
                      See How It Works
                    </button>
                  </Link>
                </motion.div>
                
                {/* Integrated Horizontal Stats */}
                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-gray-100">
                  <div className="flex flex-col">
                    <div className="text-2xl font-extrabold text-gray-900 tracking-tight">2.4K+</div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Issues Resolved</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold text-gray-900">87%</div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">AI Accuracy</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold text-gray-900">&lt; 3hrs</div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Response</div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Civic Activity Visualization */}
              <div className="lg:col-span-6 relative h-[500px] w-full mt-10 lg:mt-0 flex items-center justify-center">
                
                {/* Subtle City Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
                
                <div className="relative w-full max-w-md h-[400px]">
                  
                  {/* Step 1: Citizen Report */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute top-4 left-4 bg-white border border-gray-100 shadow-sm rounded-xl p-4 w-64 z-20"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">Streetlight out</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> Block 7, Main Ave</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">Reported just now</div>
                  </motion.div>

                  {/* SVG Connection Lines */}
                  <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
                    <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 448 400">
                      {/* Line 1: Citizen to AI */}
                      <motion.path 
                        d="M 144 96 L 144 142 Q 144 152 154 152 L 208 152" 
                        fill="none" 
                        stroke="#0EA5E9" 
                        strokeWidth="2" 
                        strokeDasharray="6 6" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                      />
                      {/* Line 2: AI to Resolution */}
                      <motion.path 
                        d="M 320 176 L 320 240 Q 320 250 310 250 L 234 250 Q 224 250 224 260 L 224 290" 
                        fill="none" 
                        stroke="#22C55E" 
                        strokeWidth="2" 
                        strokeDasharray="6 6" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 2.5, duration: 0.8 }}
                      />
                    </svg>
                  </div>

                  {/* Step 2: AI Routing / City Department */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                    className="absolute top-[120px] right-4 bg-white border border-gray-100 shadow-sm rounded-xl p-3 w-56 z-20 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      <Brain className="w-4 h-4 text-[#0EA5E9]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-900">AI Classification</h4>
                      <p className="text-[10px] text-gray-500">Routing to <span className="text-[#0EA5E9] font-medium">Electrical Dept</span></p>
                    </div>
                  </motion.div>

                  {/* Step 3: Resolution */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.2, duration: 0.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white border border-green-100 shadow-[0_8px_30px_rgba(34,197,94,0.12)] rounded-xl p-4 w-64 z-20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Issue Resolved</h4>
                        <p className="text-xs text-gray-500">Fixed by City Maintenance</p>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ ABOUT — white background ============ */}
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

      {/* ============ HOW IT WORKS — Dimensional Journey ============ */}
      <section id="services" className="py-32 bg-[#F8F8F5] relative z-10 overflow-hidden">
        
        {/* Very subtle civic-grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(11,18,32,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(11,18,32,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-widest uppercase text-[#08A8E8] mb-6">
              <span className="w-8 h-px bg-[#08A8E8] opacity-60"></span>
              How It Works
              <span className="w-8 h-px bg-[#08A8E8] opacity-60"></span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1220] mb-6 tracking-tight">How it works.</h2>
            <p className="text-[#8792A5] max-w-2xl mx-auto text-lg leading-relaxed">
              Three simple steps. Real results. No bureaucratic maze — just a direct line from your phone to city hall.
            </p>
          </div>

          <div className="relative">
            
            {/* Connecting Journey Line (Desktop only) */}
            <div className="hidden lg:block absolute top-[120px] left-[15%] right-[15%] h-px bg-gray-200 z-0">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#08A8E8]" 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              />
              {/* Traveling dot */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#08A8E8] shadow-[0_0_8px_#08A8E8]"
                initial={{ left: "0%" }}
                whileInView={{ left: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
              
              {/* STEP 01 - PINPOINT ISSUE */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="group flex flex-col items-center"
              >
                {/* Dimensional Object */}
                <div className="bg-white rounded-2xl w-full max-w-[320px] aspect-[4/3] p-6 shadow-[0_12px_40px_rgba(11,18,32,0.06)] border border-gray-100 flex flex-col justify-between mb-8 relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(11,18,32,0.1)] overflow-hidden">
                  
                  <div className="absolute -right-4 -bottom-6 text-[120px] font-black text-gray-50 leading-none select-none">01</div>
                  
                  <div className="flex items-center gap-3 relative z-10 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                      <MapPin className="w-5 h-5 text-red-500 group-hover:animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Citizen Report</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-[#101828]">Pothole reported</h4>
                      <span className="text-[9px] text-[#8792A5] font-medium bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm">Just now</span>
                    </div>
                    <p className="text-xs text-[#8792A5] flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Block 7, Karachi</p>
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center px-4">
                  <h3 className="text-xl font-bold text-[#101828] mb-3 flex items-center justify-center gap-2">
                    <span className="text-[#08A8E8]">01.</span> Pinpoint Issue
                  </h3>
                  <p className="text-[#8792A5] text-sm leading-relaxed">
                    Upload an image. AI auto-detects your location and analyses the problem type instantly.
                  </p>
                </div>
              </motion.div>

              {/* STEP 02 - AI TRIAGE */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group flex flex-col items-center"
              >
                {/* Dimensional Object */}
                <div className="bg-white rounded-2xl w-full max-w-[320px] aspect-[4/3] p-6 shadow-[0_12px_40px_rgba(11,18,32,0.06)] border border-gray-100 flex flex-col justify-between mb-8 relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(11,18,32,0.1)] overflow-hidden">
                  
                  <div className="absolute -right-4 -bottom-6 text-[120px] font-black text-gray-50 leading-none select-none">02</div>
                  
                  <div className="flex items-center gap-3 relative z-10 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      <RefreshCw className="w-5 h-5 text-[#08A8E8] group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">System Processing</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative z-10 flex flex-col gap-2.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-[10px] text-[#8792A5] uppercase tracking-wider font-semibold">Issue:</span>
                      <span className="text-xs font-semibold text-[#101828]">Road Damage</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="text-[10px] text-[#8792A5] uppercase tracking-wider font-semibold">Priority:</span>
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Medium</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[#8792A5] uppercase tracking-wider font-semibold">Route to:</span>
                      <span className="text-[10px] font-semibold text-[#08A8E8] flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Road Maint.</span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center px-4">
                  <h3 className="text-xl font-bold text-[#101828] mb-3 flex items-center justify-center gap-2">
                    <span className="text-[#08A8E8]">02.</span> AI Triage
                  </h3>
                  <p className="text-[#8792A5] text-sm leading-relaxed">
                    Smart backend categorises the issue and assigns a priority level based on severity.
                  </p>
                </div>
              </motion.div>

              {/* STEP 03 - TRACK PROGRESS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="group flex flex-col items-center"
              >
                {/* Dimensional Object */}
                <div className="bg-white rounded-2xl w-full max-w-[320px] aspect-[4/3] p-6 shadow-[0_12px_40px_rgba(11,18,32,0.06)] border border-gray-100 flex flex-col justify-between mb-8 relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(11,18,32,0.1)] overflow-hidden">
                  
                  <div className="absolute -right-4 -bottom-6 text-[120px] font-black text-gray-50 leading-none select-none">03</div>
                  
                  <div className="flex items-center justify-between relative z-10 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                        <FileCheck className="w-5 h-5 text-[#35C98A] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Resolution</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <div className="flex flex-col gap-3 relative">
                      {/* Vertical line connecting status points */}
                      <div className="absolute left-[7px] top-[10px] bottom-[10px] w-px bg-gray-200" />
                      
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full bg-gray-200 border-2 border-white relative z-10" />
                        <span className="text-xs text-[#8792A5] font-medium">Reported</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full bg-gray-200 border-2 border-white relative z-10" />
                        <span className="text-xs text-[#8792A5] font-medium">In Progress</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#35C98A] shadow-[0_0_6px_rgba(53,201,138,0.4)] border-2 border-white relative z-10" />
                        <span className="text-xs font-bold text-[#101828]">Resolved <span className="text-[#35C98A]">✓</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center px-4">
                  <h3 className="text-xl font-bold text-[#101828] mb-3 flex items-center justify-center gap-2">
                    <span className="text-[#08A8E8]">03.</span> Track Progress
                  </h3>
                  <p className="text-[#8792A5] text-sm leading-relaxed">
                    Monitor your complaint's status in real-time. Get notifications when it's resolved.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Transition area into footer */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#08A8E8]/30 to-transparent" />
      </section>

    </div>
  );
}
