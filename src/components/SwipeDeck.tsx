"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, X, Star, MapPin, Calendar, CheckCircle2, Zap, 
  BookOpen, Wrench, Music, Laptop, ShieldCheck, RefreshCw, MessageCircle, Sparkles 
} from "lucide-react";

interface CardCandidate {
  user: {
    id: number;
    name: string;
    avatar: string;
    bio: string;
    city: string;
    address: string;
    age: number;
    rating: number;
    totalReviews: number;
    verified: boolean;
  };
  primaryOffer: {
    title: string;
    category: string;
    availability: string;
    mode: string;
    description: string;
  };
  primaryWanted: {
    title: string;
    category: string;
  };
  isRelevanceHigh: boolean;
}

interface SwipeDeckProps {
  cards: CardCandidate[];
  onSwipe: (toUserId: number, action: "like" | "pass" | "superlike") => void;
  onRefreshCards: () => void;
  currentUser: any;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  cards,
  onSwipe,
  onRefreshCards,
  currentUser,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const currentCard = cards[currentIndex];

  const handleAction = (action: "like" | "pass" | "superlike") => {
    if (!currentCard) return;
    setDirection(action === "pass" ? "left" : "right");

    setTimeout(() => {
      onSwipe(currentCard.user.id, action);
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 200);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tech":
        return <Laptop className="w-5 h-5 text-emerald-600" />;
      case "music":
        return <Music className="w-5 h-5 text-amber-600" />;
      case "trades":
        return <Wrench className="w-5 h-5 text-blue-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-teal-600" />;
    }
  };

  if (!currentCard || currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-slate-900/60 rounded-3xl border border-slate-800 backdrop-blur-md">
        <div className="w-20 h-20 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mb-6 animate-pulse">
          <Sparkles className="w-10 h-10 text-teal-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">¡Has visto todos los Saberes por ahora!</h3>
        <p className="text-slate-400 max-w-md mb-8 text-sm">
          No hay más perfiles en tu zona en este momento. Intenta explorar la lista completa o comparte tu propio saber para recibir nuevas propuestas.
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            onRefreshCards();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-teal-500/20"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Reiniciar Tarjetas</span>
        </button>
      </div>
    );
  }

  const { user, primaryOffer, primaryWanted, isRelevanceHigh } = currentCard;

  return (
    <div className="w-full max-w-md mx-auto relative px-2 py-4">
      
      {/* Top Deck Banner */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-300">
            Tarjeta {currentIndex + 1} de {cards.length}
          </span>
        </div>
        <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
          📍 {user.city}
        </span>
      </div>

      {/* Main Card Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={user.id}
          initial={{ scale: 0.95, opacity: 0.8, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{
            x: direction === "right" ? 300 : direction === "left" ? -300 : 0,
            opacity: 0,
            rotate: direction === "right" ? 15 : -15,
          }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 relative flex flex-col"
        >
          {/* Match Alert Badge */}
          {isRelevanceHigh && (
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-teal-500 text-white text-xs font-extrabold px-4 py-1.5 flex items-center justify-center gap-2 shadow-md">
              <Zap className="w-4 h-4 fill-white animate-bounce" />
              <span>¡POTENCIAL MATCH DIRECTO DE SABERES!</span>
            </div>
          )}

          {/* User Header Section */}
          <div className="p-6 bg-gradient-to-b from-teal-50/80 via-white to-slate-50/50 border-b border-slate-100 relative">
            <div className="flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
                  />
                  {user.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white rounded-full p-1 shadow">
                      <CheckCircle2 className="w-4 h-4 fill-teal-500 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                    <span className="text-slate-500 font-semibold text-base">, {user.age}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{user.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      ({user.totalReviews} trueques)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate max-w-[200px]">{user.address || user.city}</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Bio quote */}
            {user.bio && (
              <p className="mt-4 text-xs text-slate-600 italic bg-white/80 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                "{user.bio}"
              </p>
            )}
          </div>

          {/* Skill Trade Cards Section (Matching exact screenshot layout) */}
          <div className="p-6 space-y-4 bg-slate-50/50">
            
            {/* TE OFRECE Card */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 shadow-sm relative">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-full">
                TE OFRECE
              </span>

              <div className="flex items-start gap-3 mt-2.5">
                <div className="p-2.5 rounded-xl bg-white text-emerald-700 shadow-sm border border-emerald-100">
                  {getCategoryIcon(primaryOffer.category)}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {primaryOffer.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {primaryOffer.description}
                  </p>
                  
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-900 font-medium bg-white/90 px-2.5 py-1 rounded-lg border border-emerald-200/60 w-fit">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Disponibilidad: {primaryOffer.availability}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* A CAMBIO DE Card */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 shadow-sm relative">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                A CAMBIO DE
              </span>

              <div className="flex items-start gap-3 mt-2.5">
                <div className="p-2.5 rounded-xl bg-white text-amber-700 shadow-sm border border-amber-100">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {primaryWanted.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Modo preferido: {primaryOffer.mode === "virtual" ? "Virtual por videollamada" : "Presencial o Virtual"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Action Buttons Section */}
          <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
            
            {/* Pass button */}
            <button
              onClick={() => handleAction("pass")}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all active:scale-95"
            >
              <X className="w-5 h-5 text-rose-500 stroke-[2.5]" />
              <span>Pasar</span>
            </button>

            {/* Superlike button */}
            <button
              onClick={() => handleAction("superlike")}
              className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 transition-all active:scale-95 shadow-sm"
              title="Enviar Super Trueque"
            >
              <Star className="w-5 h-5 fill-sky-500 text-sky-500" />
            </button>

            {/* Connect & Exchange Button */}
            <button
              onClick={() => handleAction("like")}
              className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-sm transition-all shadow-lg shadow-teal-500/25 active:scale-95"
            >
              <Zap className="w-5 h-5 fill-white text-white" />
              <span>Conectar e Intercambiar</span>
            </button>

          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
