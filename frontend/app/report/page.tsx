"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Camera, Loader2, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "@/lib/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  category: z.string().optional(),
  location: z.string().min(5, "Location must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters")
});
type FormValues = z.infer<typeof formSchema>;

export default function ReportPage() {
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [aiResult, setAiResult] = useState<any>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{name: string}[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  
  const { register, handleSubmit: hookFormSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      category: "",
      location: "",
      description: ""
    }
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/categories/`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to load categories"));
      
    // Check if user is logged in
    const token = Cookies.get("user_token");
    setIsLoggedIn(!!token);
    setMounted(true);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
  };

  const onSubmit = async (data: FormValues) => {
    setStep("loading");
    
    try {
      const token = Cookies.get("user_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/complaints/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          citizen_name: data.name,
          citizen_email: data.email,
          citizen_phone: data.phone,
          location: data.location,
          description: data.description,
          category: data.category || null,
          image_base64: imageBase64
        })
      });
      
      if (!response.ok) throw new Error("Backend error");
      const responseData = await response.json();
      
      setAiResult({
        id: responseData.id,
        category: responseData.category,
        priority: responseData.priority,
        confidence: responseData.confidence,
        summary: responseData.summary,
        estimated_resolution_days: responseData.estimated_resolution_days,
        keywords: []
      });
      setStep("success");
      toast.success("Complaint analyzed and submitted to database!");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(`Error: ${error.message || "Failed to connect to AI Engine."}`);
      setStep("form");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative py-12 px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-10 text-center">
                <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-blue-600 tracking-wide">AI-Powered Intake</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] mb-4 tracking-tight drop-shadow-sm">Report an Issue</h1>
                <p className="text-[var(--color-text-muted)] text-lg max-w-xl mx-auto">Help us build a smarter, safer city. Provide details and let our AI handle the routing.</p>
              </div>

              <Card className="backdrop-blur-xl bg-white/80 shadow-2xl border-0 ring-1 ring-black/5 overflow-hidden rounded-[2rem]">
                <div className="h-2 w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"></div>
                <CardContent className="p-8 sm:p-12">
                  <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-6">
                    {mounted && !isLoggedIn && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[var(--color-text-primary)]">Your Name <span className="text-red-500">*</span></label>
                          <Input {...register("name")} placeholder="John Doe" className="bg-gray-50/50" />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--color-primary)]">Email Address (Optional)</label>
                          <Input type="email" {...register("email")} placeholder="john@example.com" className="bg-gray-50/50" />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mounted && !isLoggedIn && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-[var(--color-primary)]">Phone Number (Optional)</label>
                          <Input type="tel" {...register("phone")} placeholder="+1 234 567 890" className="bg-gray-50/50" />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--color-text-primary)]">Category (Optional)</label>
                        <div className="relative group">
                          <select 
                            {...register("category")}
                            className="flex h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white/50 pl-4 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 hover:bg-white focus:bg-white transition-colors cursor-pointer shadow-sm"
                          >
                            <option value="">Let AI decide</option>
                            {categories.map((c, i) => (
                              <option key={i} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[var(--color-primary)] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--color-text-primary)]">Location <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                        <Input {...register("location")} placeholder="E.g., 123 Main St, Near Central Park" className="pl-12 h-12 rounded-xl bg-white/50 border-gray-200 hover:bg-white focus:bg-white transition-colors" />
                      </div>
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--color-text-primary)]">Description <span className="text-red-500">*</span></label>
                      <Textarea {...register("description")} placeholder="Describe the problem in detail... What exactly happened?" className="min-h-[150px] resize-y bg-white/50 border-gray-200 rounded-xl hover:bg-white focus:bg-white p-4 transition-colors" />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[var(--color-text-primary)]">Photo (Optional)</label>
                      {!imagePreview ? (
                        <div className="relative border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer group">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                          />
                          <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                            <Camera className="w-8 h-8 text-blue-500" />
                          </div>
                          <span className="text-base font-bold text-blue-700">Click to upload or drag and drop</span>
                          <span className="text-sm text-blue-400 mt-2">High resolution photos preferred (PNG, JPG up to 5MB)</span>
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border border-[var(--color-border)] inline-block">
                          <img src={imagePreview} alt="Preview" className="h-48 w-auto object-cover" />
                          <button 
                            type="button" 
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <Button type="submit" size="lg" className="w-full text-lg font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:from-[var(--color-primary)] hover:to-[var(--color-primary)] text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all h-14 rounded-xl mt-4">
                      Submit to AI Engine
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
              <Loader2 className="w-16 h-16 text-[var(--color-primary)] animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">CitySync AI is analyzing...</h2>
              <p className="text-[var(--color-text-muted)]">Classifying category, estimating priority, and routing ticket.</p>
            </motion.div>
          )}

          {step === "success" && aiResult && (
            <motion.div key="success" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, type: "spring" }} className="py-8 max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-4 tracking-tight">Report Submitted!</h2>
                <p className="text-lg text-gray-500 bg-gray-100 inline-block px-5 py-2 rounded-full font-medium shadow-inner border border-gray-200/60">
                  Ticket <span className="font-mono font-bold text-[var(--color-primary)]">#{aiResult.id}</span>
                </p>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border-0 shadow-2xl bg-white overflow-hidden rounded-[2rem] relative z-10 group">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] via-purple-500 to-[var(--color-accent)]"></div>
                  <CardContent className="p-8 md:p-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner">
                          <Info className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">AI Analysis</h3>
                          <p className="text-sm text-gray-500 font-medium">Automated classification</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000 ease-out" style={{ width: `${aiResult.confidence}%` }}></div>
                          </div>
                          <span className="font-mono text-sm font-black text-[var(--color-primary)]">{aiResult.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 hover:shadow-md transition-shadow group-hover:border-blue-100 flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category</p>
                        <p className="text-xl font-black text-gray-800 line-clamp-1">{aiResult.category}</p>
                      </div>
                      <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-center items-start group-hover:border-blue-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Urgency Level</p>
                        <PriorityBadge priority={aiResult.priority} className="text-sm px-3 py-1 shadow-sm" />
                      </div>
                      <div className="bg-green-50/50 rounded-3xl p-5 border border-green-100 hover:shadow-md transition-shadow flex flex-col justify-center group-hover:border-green-200 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-200/50 rounded-full blur-xl pointer-events-none"></div>
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1.5">Est. Resolution</p>
                        <p className="text-xl font-black text-green-700 flex items-baseline gap-1">
                          {aiResult.estimated_resolution_days || 7} 
                          <span className="text-sm font-bold text-green-600/70">Days</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-3xl p-7 border border-blue-100/60 mb-8 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                      <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-sm"></span> Analysis Summary
                      </p>
                      <p className="text-gray-700 font-medium leading-relaxed italic text-lg">&quot;{aiResult.summary}&quot;</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-2 border-t border-gray-50">
                      {isLoggedIn && (
                        <Link href="/my-complaints" className="w-full">
                          <Button className="w-full h-14 text-base font-bold bg-[var(--color-primary)] hover:bg-blue-700 shadow-xl shadow-blue-500/20 rounded-2xl transition-all hover:-translate-y-1">
                            Track My Complaint
                          </Button>
                        </Link>
                      )}
                      <Link href="/" className="w-full">
                        <Button variant={isLoggedIn ? "outline" : "default"} className={`w-full h-14 text-base font-bold rounded-2xl transition-all hover:-translate-y-1 ${!isLoggedIn ? "bg-[var(--color-primary)] hover:bg-blue-700 shadow-xl shadow-blue-500/20 text-white" : "border-2 border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900"}`}>
                          Return to Home
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
