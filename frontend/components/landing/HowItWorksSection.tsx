import { motion } from "framer-motion";
import { MapPin, RefreshCw, ArrowRight, FileCheck, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  return (
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
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl w-full max-w-[320px] aspect-[4/3] p-6 shadow-xl shadow-gray-200/50 border border-white flex flex-col justify-between mb-8 relative transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-[#08A8E8]/10 overflow-hidden ring-1 ring-black/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -right-4 -bottom-6 text-[120px] font-black text-gray-50/80 leading-none select-none transition-transform duration-500 group-hover:scale-110">01</div>
                
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
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl w-full max-w-[320px] aspect-[4/3] p-6 shadow-xl shadow-gray-200/50 border border-white flex flex-col justify-between mb-8 relative transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-[#08A8E8]/10 overflow-hidden ring-1 ring-black/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -right-4 -bottom-6 text-[120px] font-black text-gray-50/80 leading-none select-none transition-transform duration-500 group-hover:scale-110">02</div>
                
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
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl w-full max-w-[320px] aspect-[4/3] p-6 shadow-xl shadow-gray-200/50 border border-white flex flex-col justify-between mb-8 relative transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:shadow-[#35C98A]/10 overflow-hidden ring-1 ring-black/5">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -right-4 -bottom-6 text-[120px] font-black text-gray-50/80 leading-none select-none transition-transform duration-500 group-hover:scale-110">03</div>
                
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
  );
}
