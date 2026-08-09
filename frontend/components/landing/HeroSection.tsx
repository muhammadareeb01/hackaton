import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, MapPin, Brain, CheckCircle2, AlertCircle } from "lucide-react";

export function HeroSection({ fadeUp, stagger }: { fadeUp: Variants, stagger: Variants }) {
  return (
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
              <motion.div variants={fadeUp} className="grid grid-cols-3 divide-x divide-gray-200 pt-8 border-t border-gray-100 w-full mt-8">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-1 sm:pr-8 sm:pl-0">
                  <div className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">2.4K+</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Issues Resolved</div>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-1 sm:px-8">
                  <div className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">87%</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">AI Accuracy</div>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left px-1 sm:px-8">
                  <div className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">&lt; 3hrs</div>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Avg Response</div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Civic Activity Visualization */}
            <div className="lg:col-span-6 relative h-auto sm:h-[500px] w-full mt-8 lg:mt-0 py-6 sm:py-0 flex items-center justify-center">
              
              {/* Subtle City Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
                         <div className="relative w-full max-w-[320px] sm:max-w-md flex flex-col gap-4 sm:block sm:h-[420px] mx-auto sm:mx-0">
                
                {/* Step 1: Citizen Report */}
                <motion.div 
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="relative sm:absolute sm:top-2 sm:left-0 bg-white/40 backdrop-blur-2xl rounded-3xl p-4 w-full sm:w-64 z-30 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/80 ring-1 ring-black/5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <motion.div 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center shrink-0 shadow-[0_8px_16px_rgba(225,29,72,0.4),inset_0_-3px_0_rgba(159,18,57,0.5),inset_0_2px_0_rgba(255,255,255,0.4)] border border-red-400/30"
                    >
                      <AlertCircle className="w-5 h-5 text-white drop-shadow-md" />
                    </motion.div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-tight">Streetlight out</h4>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1 font-medium"><MapPin className="w-3 h-3 text-red-500" /> Block 7, Main Ave</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-900/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Reported just now</span>
                    <div className="flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                      <span className="text-[9px] text-red-600 font-bold">LIVE</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </div>
                  </div>
                </motion.div>

                {/* SVG Connection Lines */}
                <div className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
                  <style>{`
                    @keyframes dash {
                      to { stroke-dashoffset: -24; }
                    }
                    .animate-dash {
                      animation: dash 1.5s linear infinite;
                    }
                  `}</style>
                  <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 448 400">
                    {/* Line 1: Citizen to AI */}
                    <motion.path 
                      className="animate-dash"
                      d="M 160 80 L 160 142 Q 160 152 170 152 L 230 152" 
                      fill="none" 
                      stroke="#0EA5E9" 
                      strokeWidth="2" 
                      strokeDasharray="6 6" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    />
                    {/* Line 2: AI to Resolution */}
                    <motion.path 
                      className="animate-dash"
                      d="M 330 200 L 330 260 Q 330 270 320 270 L 234 270 Q 224 270 224 280 L 224 300" 
                      fill="none" 
                      stroke="#22C55E" 
                      strokeWidth="2" 
                      strokeDasharray="6 6" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 2.5, duration: 0.8 }}
                    />
                  </svg>
                </div>

                {/* Step 2: AI Routing / City Department */}
                <motion.div 
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="relative sm:absolute sm:top-[140px] sm:-right-4 bg-white/40 backdrop-blur-2xl rounded-3xl p-3.5 w-[90%] self-end sm:w-60 z-20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/80 ring-1 ring-black/5 flex items-center gap-3"
                >
                  <motion.div 
                    animate={{ rotateY: [0, 15, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shrink-0 shadow-[0_8px_16px_rgba(6,182,212,0.4),inset_0_-3px_0_rgba(30,58,138,0.5),inset_0_2px_0_rgba(255,255,255,0.4)] border border-cyan-400/30"
                  >
                    <Brain className="w-5 h-5 text-white drop-shadow-md" />
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900">AI Classification</h4>
                    <p className="text-[10px] text-gray-600 mt-0.5 font-medium">Routing to <span className="text-blue-600 font-bold">Electrical Dept</span></p>
                  </div>
                </motion.div>

                {/* Step 3: Resolution */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 2.6, duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="relative sm:absolute sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 bg-white/40 backdrop-blur-2xl rounded-3xl p-4 w-full sm:w-64 z-30 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/80 ring-1 ring-black/5"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shrink-0 shadow-[0_8px_16px_rgba(16,185,129,0.4),inset_0_-3px_0_rgba(6,78,59,0.5),inset_0_2px_0_rgba(255,255,255,0.4)] border border-green-400/30 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse" />
                      <CheckCircle2 className="w-5 h-5 text-white relative z-10 drop-shadow-md" />
                    </motion.div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">Issue Resolved</h4>
                      <p className="text-[10px] text-gray-600 mt-0.5 font-medium">Fixed by <span className="text-emerald-600 font-bold">City Maintenance</span></p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
