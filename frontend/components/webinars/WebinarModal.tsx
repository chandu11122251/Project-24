"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Video, Calendar, Clock, User, Tag, Layout } from "lucide-react";
import BorderGlow from "@/components/effects/BorderGlow";

interface WebinarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WebinarType = "recorded" | "scheduled" | "live";

export default function WebinarModal({ isOpen, onClose }: WebinarModalProps) {
  const [activeType, setActiveType] = useState<WebinarType>("scheduled");

  const typeConfig: Record<WebinarType, { icon: any; color: string; label: string }> = {
    recorded: { icon: Video, color: "emerald", label: "Add Recorded" },
    scheduled: { icon: Calendar, color: "indigo", label: "Schedule" },
    live: { icon: Clock, color: "rose", label: "Host Live" },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="webinar-modal-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="webinar-modal-container"
        >
          <BorderGlow
            edgeSensitivity={32}
            glowColor={activeType === "recorded" ? "160 80 65" : activeType === "scheduled" ? "250 80 65" : "340 80 65"}
            backgroundColor="#0a0e1a"
            borderRadius={24}
            glowRadius={28}
            glowIntensity={0.65}
            coneSpread={24}
            animated={true}
            colors={
              activeType === "recorded"
                ? ["#10b981", "#34d399", "#059669"]
                : activeType === "scheduled"
                ? ["#6366f1", "#818cf8", "#4f46e5"]
                : ["#f43f5e", "#fb7185", "#e11d48"]
            }
            className="w-full h-full"
          >
            <div className="webinar-modal-content">
              {/* Header */}
              <div className="webinar-modal-header">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Plus className="h-6 w-6 text-indigo-400" />
                    Host a Webinar
                  </h2>
                  <p className="text-white/45 text-sm mt-1">Share your knowledge with the Project 24 community.</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/50 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Type Switcher */}
              <div className="webinar-modal-tabs">
                {(Object.keys(typeConfig) as WebinarType[]).map((type) => {
                  const Icon = typeConfig[type].icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`webinar-modal-tab ${activeType === type ? "active" : ""}`}
                      data-type={type}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{typeConfig[type].label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Area */}
              <div className="webinar-modal-form mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <Layout className="h-3 w-3" />
                      Webinar Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mastering Next.js Performance"
                      className="webinar-modal-input"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      Description
                    </label>
                    <textarea
                      placeholder="What should participants expect to learn?"
                      className="webinar-modal-input min-h-[100px] resize-none py-3"
                    />
                  </div>

                  {/* Meta 1 */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                      <User className="h-3 w-3" />
                      Speaker Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="webinar-modal-input"
                    />
                  </div>

                  {/* Meta 2 */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
                      {activeType === "recorded" ? <Video className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                      {activeType === "recorded" ? "Video URL" : "Date & Time"}
                    </label>
                    <input
                      type={activeType === "recorded" ? "text" : "datetime-local"}
                      placeholder={activeType === "recorded" ? "YouTube/Vimeo link" : ""}
                      className="webinar-modal-input"
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-4 mt-10">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white/40 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button className={`webinar-modal-submit ${activeType}`}>
                    {activeType === "recorded" ? "Add Webinar" : activeType === "scheduled" ? "Schedule Session" : "Start Hosting"}
                  </button>
                </div>
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
