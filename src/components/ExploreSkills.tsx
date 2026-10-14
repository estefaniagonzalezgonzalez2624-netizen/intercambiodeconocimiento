"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Filter, MapPin, Calendar, Star, Laptop, 
  Music, Wrench, Languages, Sparkles, Heart, Clock, ArrowRightLeft 
} from "lucide-react";

interface SkillItem {
  skill: {
    id: number;
    title: string;
    category: string;
    description: string;
    durationHours: number;
    availability: string;
    mode: string;
    level: string;
  };
  user: {
    id: number;
    name: string;
    avatar: string;
    city: string;
    address: string;
    rating: number;
    totalReviews: number;
  };
}

interface ExploreSkillsProps {
  currentUser: any;
  onProposeTrade: (targetUser: any, targetSkill: any) => void;
}

const CATEGORIES = [
  { id: "all", label: "Todos los Saberes", icon: "✨" },
  { id: "tech", label: "Tecnología & IT", icon: "💻" },
  { id: "languages", label: "Idiomas", icon: "🗣️" },
  { id: "music", label: "Música & Arte", icon: "🎸" },
  { id: "beauty", label: "Belleza & Estética", icon: "💄" },
  { id: "trades", label: "Oficios & Reparación", icon: "🔧" },
  { id: "fitness", label: "Yoga & Deporte", icon: "🧘" },
  { id: "cooking", label: "Cocina & Pastelería", icon: "🍳" },
  { id: "business", label: "Negocios & Finanzas", icon: "📊" },
];

export const ExploreSkills: React.FC<ExploreSkillsProps> = ({
  currentUser,
  onProposeTrade,
}) => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedMode !== "all") params.append("mode", selectedMode);
      if (searchQuery) params.append("q", searchQuery);
      if (currentUser?.id) params.append("excludeUserId", currentUser.id.toString());

      const res = await fetch(`/api/skills?${params.toString()}`);
      const data = await res.json();
      if (data.skills) {
        setSkills(data.skills);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory, selectedMode, searchQuery, currentUser]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl mb-8">
        <div className="max-w-2xl">
          <span className="text-teal-400 font-extrabold text-xs uppercase tracking-wider bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
            Directorio de Habilidades
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">
            ¿Qué quieres aprender hoy sin usar dinero?
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            Explora cientos de habilidades ofrecidas por personas cerca de ti o por videollamada.
          </p>
        </div>

        {/* Search & Mode Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por habilidad (ej. Excel, Guitarra, Maquillaje, Inglés...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-teal-400"
            >
              <option value="all">Todas las Modalidades</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual / Online</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20 scale-105"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-800/50 animate-pulse border border-slate-700/50"></div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-base">No se encontraron saberes con estos criterios.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedMode("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 bg-teal-500/20 text-teal-300 rounded-xl text-xs font-bold border border-teal-500/30"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(({ skill, user }) => (
            <div
              key={skill.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl group"
            >
              <div>
                {/* User info row */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-teal-400"
                    />
                    <div>
                      <h4 className="text-white font-bold text-sm">{user.name}</h4>
                      <p className="text-slate-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                        <span>{user.city}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{user.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Skill Details */}
                <div className="py-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 uppercase">
                      {skill.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {skill.mode === "virtual" ? "Virtual" : skill.mode === "presencial" ? "Presencial" : "Ambos"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                    {skill.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {skill.description || "Sin descripción detallada."}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>{skill.availability}</span>
                  </div>
                </div>
              </div>

              {/* Propose Trade Action Button */}
              <button
                onClick={() => onProposeTrade(user, skill)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-teal-300 font-bold text-xs transition-all border border-teal-500/30 flex items-center justify-center gap-2 mt-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Proponer Intercambio Directo</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
