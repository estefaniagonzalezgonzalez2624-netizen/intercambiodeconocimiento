"use client";

import React, { useState, useEffect } from "react";
import { X, Video, Mic, MicOff, VideoOff, MessageSquare, Clock, CheckCircle2, FileText } from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";

interface VirtualRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
}

export const VirtualRoomModal: React.FC<VirtualRoomModalProps> = ({
  isOpen,
  onClose,
  partnerName,
}) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins in seconds
  const [notes, setNotes] = useState("Notas de la lección compartida:\n- Punto 1: Introducción práctica\n- Punto 2: Ejercicio en vivo");

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-lg">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] text-white flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Top Video Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <h3 className="font-bold text-white text-sm sm:text-base">
              Sala Virtual de Trueque • Con {partnerName}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Tiempo de Clase: {timeFormatted}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Grid: Video Feeds & Whiteboard */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 overflow-hidden bg-slate-950">
          
          {/* Main Video Screen */}
          <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 relative flex flex-col items-center justify-center overflow-hidden">
            {videoOn ? (
              <div className="w-full h-full relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-24 h-24 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4 border-2 border-teal-400 shadow-xl">
                    <Video className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-lg text-white">{partnerName} está en cámara</h4>
                  <p className="text-xs text-teal-300 mt-1">Transmitiendo en HD 1080p • Audio fluido</p>
                </div>

                {/* Self Small Video Overlay */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg flex items-center justify-center">
                  <span className="text-[10px] text-slate-400">Tú (Cámara)</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm flex items-center gap-2">
                <VideoOff className="w-6 h-6" />
                <span>Cámara desactivada</span>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/80 backdrop-blur border border-slate-700 p-2 rounded-2xl">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3 rounded-xl transition-all ${
                  micOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`p-3 rounded-xl transition-all ${
                  videoOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                }`}
              >
                {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => {
                  triggerConfetti();
                  onClose();
                }}
                className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Finalizar Lección
              </button>
            </div>
          </div>

          {/* Interactive Lesson Notes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-2">
              <FileText className="w-4 h-4" />
              <span>Pizarrón de Notas Compartido</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 resize-none font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-2">
              Las notas se guardan automáticamente para ambos participantes.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
