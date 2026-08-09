import { Brain, Activity, Zap, Shield } from "lucide-react";

export const carouselItems = [
  { id: 1, title: "Report Potholes",       category: "Road",        img: "/scene_pothole.png" },
  { id: 2, title: "Water Leaks",            category: "Water",       img: "/scene_water.png" },
  { id: 3, title: "Broken Streetlights",    category: "Electricity", img: "/scene_electricity.png" },
  { id: 4, title: "Waste Management",       category: "Waste",       img: "/scene_garbage.png" }
];

export const storySlides = [
  { img: "/citizen_scene.png",      label: "Road Issue",       title: "She spotted it. AI routed it." },
  { img: "/scene_electricity.png",  label: "Electricity",      title: "Dark street? Not for long." },
  { img: "/scene_water.png",        label: "Water Leak",       title: "One tap. City takes note." },
  { img: "/scene_pothole.png",      label: "Pothole",          title: "Reported. Tracked. Resolved." },
  { img: "/scene_garbage.png",      label: "Waste",            title: "Community speaks. City listens." },
];

export const stats = [
  { value: "2.4K+",  label: "Issues Resolved",    icon: <Activity className="w-5 h-5" />, color: "#0EA5E9" },
  { value: "87%",    label: "AI Accuracy",         icon: <Brain className="w-5 h-5" />,    color: "#3B82F6" },
  { value: "< 3hrs", label: "Avg Response",        icon: <Zap className="w-5 h-5" />,      color: "#16A34A" },
  { value: "14",     label: "Issue Categories",    icon: <Shield className="w-5 h-5" />,   color: "#D97706" },
];
