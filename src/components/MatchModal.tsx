"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CheckCircle2, ArrowLeftRight, Calendar, MapPin, 
  Sparkles, Star, Wrench, Laptop, Music, BookOpen 
} from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchData: {
    user1: any;
    user2: any;
    user1Offer?: any;
    user2Offer?: any;
    user1Wanted?: any;
    user2Wanted?: any;
  } | null;
  onConfirmExchange: (exchangeData: any) => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  matchData,
  onConfirmExchange,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !matchData) return null;

  const { user1, user2, user1Offer, user2Offer } = matchData;

  const handleNextStep = () => {
    setStep(2);
    triggerConfetti();
  };

  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    triggerConfetti();

    try {
      await onConfirmExchange({
        user1Id: user1?.id || 1,
        user2Id: user2?.id || 2,
        user1SkillTitle: user1Offer?.title || "1 hora de Maquillaje Profesional",
        user2SkillTitle: user2Offer?.title || "1 hora de Reparación de PC y Hardware",
        user1Availability: user1Offer?.availability || "Lunes a Viernes, 6:00 p.m. - 8:00 p.m.",
        user2Availability: user2Offer?.availability || "Sábados y Domingos, 10:00 a.m. - 12:00 p.m.",
        mode: "presencial",
        locationOrLink: user1?.address || user1?.city || "Buenos Aires",
        scheduledDate: "A convenir entre las partes",
        notes: "Intercambio confirmado en Trueque de Saberes.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-teal-50 via-sky-50 to-emerald-50 rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-200 text-slate-800 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 1 ? (
            /* STEP 1: ¡Ya hay Conexión! 🎉 (Matching Image 2) */
            <div className="flex flex-col items-center text-center">
              
              {/* Header Logo & Title */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📚⚙️</span>
                <span className="font-extrabold text-teal-800 tracking-tight text-lg">
                  SaberXSaber
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 flex items-center gap-2">
                <span>¡Ya hay Conexión!</span>
                <span className="text-3xl">🎉</span>
              </h2>

              {/* Profiles Row */}
              <div className="grid grid-cols-2 gap-4 w-full my-6 items-center">
                
                {/* Sofía / User 1 Card */}
                <div className="bg-teal-100/70 border border-teal-300/80 rounded-2xl p-4 flex flex-col items-center shadow-sm">
                  <div className="relative mb-2">
                    <img
                      src={user1?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"}
                      alt={user1?.name || "Sofía"}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>{user1?.rating?.toFixed(1) || "4.9"}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{user1?.name || "Sofía Martínez"}, {user1?.age || 24}</h3>
                  <p className="text-[11px] text-slate-600 truncate max-w-full mt-0.5">
                    {user1?.address || "Calle Principal 123, Madrid"}
                  </p>
                </div>

                {/* Exchange Icon Divider */}
                <div className="hidden">
                  <ArrowLeftRight className="w-6 h-6 text-teal-600 animate-pulse" />
                </div>

                {/* Carlos / User 2 Card */}
                <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl p-4 flex flex-col items-center shadow-sm">
                  <div className="relative mb-2">
                    <img
                      src={user2?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"}
                      alt={user2?.name || "Carlos"}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>{user2?.rating?.toFixed(1) || "5.0"}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{user2?.name || "Carlos Gómez"}, {user2?.age || 28}</h3>
                  <p className="text-[11px] text-slate-600 truncate max-w-full mt-0.5">
                    {user2?.address || "Av. Libertad 456, Madrid"}
                  </p>
                </div>

              </div>

              {/* Offer Comparison Box */}
              <div className="grid grid-cols-2 gap-3 w-full text-left mb-6">
                <div className="bg-white/90 border border-teal-200 rounded-2xl p-3.5 shadow-sm">
                  <span className="text-[10px] font-black uppercase text-teal-700 tracking-wider">TE OFRECE:</span>
                  <p className="font-bold text-slate-900 text-xs mt-1">
                    📊 {user1Offer?.title || "1 hora de Excel"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Disponibilidad: {user1Offer?.availability || "Martes 4:00 PM - 6:00 PM"}
                  </p>
                </div>

                <div className="bg-white/90 border border-amber-200 rounded-2xl p-3.5 shadow-sm">
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">A CAMBIO DE:</span>
                  <p className="font-bold text-slate-900 text-xs mt-1">
                    🎸 {user2Offer?.title || "1 hora de Guitarra"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Disponibilidad: {user2Offer?.availability || "Martes 4:00 PM - 6:00 PM"}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleNextStep}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-700 hover:to-emerald-800 text-white font-black text-base shadow-xl shadow-teal-600/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Conectar e Intercambiar</span>
              </button>

            </div>
          ) : (
            /* STEP 2: ¡Intercambio Confirmado! (Matching Image 1 & 3) */
            <div className="flex flex-col items-center text-center">
              
              <h2 className="text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
                <span>¡Intercambio Confirmado!</span>
              </h2>
              
              <p className="text-xs text-slate-600 mt-2 max-w-sm">
                Prestada oferta de saberes para los intercambios enriquecedores de conocimientos.
              </p>

              {/* Circle Avatars with Bidirectional Green Arrows */}
              <div className="flex items-center justify-center gap-4 my-6">
                
                {/* Sofía Avatar */}
                <div className="relative">
                  <img
                    src={user1?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"}
                    alt={user1?.name}
                    className="w-24 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Transfer Icon */}
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-white rounded-full shadow border border-teal-200">
                    <ArrowLeftRight className="w-7 h-7 text-emerald-600 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-extrabold text-teal-800 mt-1">SaberXSaber</span>
                </div>

                {/* Carlos Avatar */}
                <div className="relative">
                  <img
                    src={user2?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"}
                    alt={user2?.name}
                    className="w-24 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

              </div>

              {/* Two Column Detailed Profile Table (Exactly matching image 1 layout) */}
              <div className="bg-white/95 border border-teal-200 rounded-2xl p-4 w-full text-left text-xs mb-6 shadow-sm">
                
                {/* Names Row */}
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100 text-center font-bold text-slate-900 text-sm">
                  <div>{user1?.name || "Sofía Martínez"}</div>
                  <div>{user2?.name || "Carlos Gómez"}</div>
                </div>

                {/* Table Details */}
                <div className="grid grid-cols-2 gap-4 pt-3 divide-x divide-slate-100">
                  
                  {/* Left Person Details */}
                  <div className="space-y-3 pr-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="p-1 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">24</span>
                      <span>{user1?.age || 24} años</span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium leading-tight">
                        {user1?.address || "Av. Libertador 1230, Buenos Aires"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium leading-tight">
                        {user1Offer?.availability || "Lunes a Viernes, 6:00 p.m. - 8:00 p.m."}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <span className="text-base">💄</span>
                      <span className="font-bold text-slate-900 text-[11px]">
                        {user1Offer?.title || "1 hora de Maquillaje Profesional"}
                      </span>
                    </div>
                  </div>

                  {/* Right Person Details */}
                  <div className="space-y-3 pl-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="p-1 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">28</span>
                      <span>{user2?.age || 28} años</span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium leading-tight">
                        {user2?.address || "Calle Corrientes 450, Buenos Aires"}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium leading-tight">
                        {user2Offer?.availability || "Sábados y Domingos, 10:00 a.m. - 12:00 p.m."}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                      <span className="text-base">💻</span>
                      <span className="font-bold text-slate-900 text-[11px]">
                        {user2Offer?.title || "1 hora de Reparación de PC y Hardware"}
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Confirm Intercambio Button */}
              <button
                onClick={handleFinalConfirm}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg shadow-xl shadow-emerald-500/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Guardando Trueque..." : "¡Confirmar Intercambio!"}
              </button>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
