"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search, BarChart3, Zap } from "lucide-react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const carouselItems = [
  { id: 1, title: "Report Potholes", category: "Infrastructure", img: "/pothole.png" },
  { id: 2, title: "Water Leaks", category: "Utilities", img: "/water_leak.png" },
  { id: 3, title: "Broken Utilities", category: "Safety", img: "/streetlight.png" }
];

export default function LandingPage() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans overflow-x-hidden relative">
      
      {/* Huge blurry color meshes for advanced UI background */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[60%] bg-[#0ea5e9]/20 rounded-[100%] blur-[120px] mix-blend-multiply opacity-70"></div>
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[70%] bg-[#8b5cf6]/20 rounded-[100%] blur-[140px] mix-blend-multiply opacity-70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-60"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-48 lg:pb-32 flex flex-col items-center">

        <div className="max-w-7xl mx-auto px-6 text-center w-full relative">
          
          {/* Floating UI Chips for Advanced Feel */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [0, -15, 0], opacity: 1 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:flex absolute top-10 left-0 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white rounded-full px-5 py-3 items-center gap-3 z-10"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800">Water Leak Reported</p>
              <p className="text-xs text-gray-500">2 mins ago in Downtown</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [0, 15, 0], opacity: 1 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden lg:flex absolute top-32 right-0 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white rounded-full px-5 py-3 items-center gap-3 z-10"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800">Pothole Fixed</p>
              <p className="text-xs text-gray-500">Status updated to Resolved</p>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-4xl mx-auto relative z-20">
            <motion.div variants={fadeUpVariants} className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md shadow-sm border border-gray-200 rounded-full px-4 py-1.5 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-sm font-bold text-gray-700 tracking-wide">Community-Driven Action</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariants} className="text-5xl md:text-7xl lg:text-[5rem] font-['var(--font-syne)'] font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Got a civic problem? <br className="hidden md:block" />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Let's get it fixed.
                </span>
                <div className="absolute bottom-2 left-0 w-full h-4 bg-blue-200/50 -z-10 -rotate-2 scale-110"></div>
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Nobody likes dodging massive potholes or stepping over broken sidewalks. Snap a quick picture, tell us what's wrong, and we'll instantly route it to the right city department to get it sorted out.
            </motion.p>
            
            <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/report">
                <button className="group bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-[0_8px_20px_rgba(15,23,42,0.3)] hover:shadow-[0_12px_25px_rgba(15,23,42,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border border-slate-700">
                  Start a Report
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="bg-white/80 backdrop-blur-md border border-gray-200 text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
                See How It Works
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* 3D Carousel Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-6xl mx-auto mt-8 px-4"
        >
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            initialSlide={1}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 250,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="w-full py-12"
          >
            {carouselItems.map((item) => (
              <SwiperSlide key={item.id} className="w-[320px] md:w-[600px] h-[220px] md:h-[400px] rounded-3xl overflow-hidden relative group shadow-2xl border border-[var(--color-border)]">
                <Image 
                  src={item.img} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Floating Content inside Card */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="bg-white/90 text-[var(--color-primary)] shadow-sm text-xs font-bold px-3 py-1 rounded-full w-max mb-3 backdrop-blur-md border border-white/20">
                    {item.category}
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-md">{item.title}</h3>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-4">
                    <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-md text-sm font-semibold py-2 px-6 rounded-full flex items-center gap-2 transition-all">
                      Report This <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </section>

      {/* About Section (Split Layout) */}
      <section id="about" className="py-24 bg-white relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                <Zap className="w-4 h-4" />
                <span>Next-Gen Civic Platform</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-['var(--font-syne)'] leading-tight">
                Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">citizens and the city.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                CitySync isn't just a reporting tool; it's a living ecosystem powered by Artificial Intelligence. 
                By automatically categorizing issues, routing them to the exact department needed, and keeping you in the loop, we eliminate bureaucratic delays.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Real-time status tracking on every report.",
                  "Smart AI triage prevents duplicate tickets.",
                  "Direct integration with city maintenance APIs."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative w-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-blue-50 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
              <div className="bg-white p-4 sm:p-8 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden group">
                <Image src="/dashboard-mockup.png" alt="CitySync Dashboard" width={800} height={600} className="rounded-[2rem] w-full h-auto object-cover shadow-inner group-hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none rounded-[3rem]"></div>
              </div>
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-4 sm:-left-8 bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                   <Zap className="w-6 h-6 text-green-400" />
                </div>
                <div>
                   <p className="font-bold text-lg">99.9%</p>
                   <p className="text-xs text-gray-400">Uptime Reliability</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-32 bg-slate-50 border-t border-[var(--color-border)] relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-['var(--font-syne)']">How CitySync Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">Our AI-driven pipeline ensures that your complaint reaches the right department in seconds, not days.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Card 1 */}
            <div className="bg-slate-900 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full transition-transform duration-500 group-hover:scale-150"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-[0_10px_20px_rgba(59,130,246,0.3)] relative z-10">
                <MapPin className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 relative z-10">1. Pinpoint Issue</h3>
              <p className="text-slate-400 leading-relaxed text-lg relative z-10">Simply upload an image and our app will automatically detect your location and analyze the problem.</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-slate-900 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full transition-transform duration-500 group-hover:scale-150"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-[0_10px_20px_rgba(99,102,241,0.3)] relative z-10">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 relative z-10">2. AI Triage</h3>
              <p className="text-slate-400 leading-relaxed text-lg relative z-10">Our smart backend categorizes the issue (e.g. Water, Roads) and assigns a priority level based on severity.</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-slate-900 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full transition-transform duration-500 group-hover:scale-150"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-[0_10px_20px_rgba(16,185,129,0.3)] relative z-10">
                <BarChart3 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 relative z-10">3. Track Progress</h3>
              <p className="text-slate-400 leading-relaxed text-lg relative z-10">Monitor your complaint's status in real-time. Get instant email notifications when the issue is resolved.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Image src="/logo.png" alt="CitySync Logo" width={48} height={48} className="rounded-xl brightness-0 invert opacity-90" />
                <span className="text-3xl font-black text-white tracking-tight font-['var(--font-syne)']">CitySync</span>
              </div>
              <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
                Building smarter, safer, and highly responsive urban environments through community engagement and artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link href="/#about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/#services" className="text-slate-400 hover:text-white transition-colors">How it Works</Link></li>
                <li><Link href="/report" className="text-slate-400 hover:text-white transition-colors">Report an Issue</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Connect</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter (X)</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="font-medium text-slate-500 mb-4 md:mb-0">© 2026 CitySync Smart Initiative. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
