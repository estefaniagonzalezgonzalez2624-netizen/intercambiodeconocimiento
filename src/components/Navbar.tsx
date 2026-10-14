"use client";

import React from "react";
import { Sparkles, Compass, MessageSquare, Clock, User, ArrowRightLeft, ShieldCheck, PlusCircle } from "lucide-react";

interface UserType {
  id: number;
  name: string;
  avatar: string;
  hoursBalance: number;
  city: string;
}

interface NavbarProps {
  activeTab: "match" | "explore" | "messages" | "timebank" | "profile";
  setActiveTab: (tab: "match" | "explore" | "messages" | "timebank" | "profile") => void;
  currentUser: UserType | null;
  allUsers: UserType[];
  onSelectUser: (userId: number) => void;
  onOpenNewSkillModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  onSelectUser,
  onOpenNewSkillModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab("match")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <ArrowRightLeft className="w-5 h-5 text-slate-900 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                  TRUEQUE DE SABERES
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  SaberXSaber
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Intercambia horas de aprendizaje libre de dinero
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab("match")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === "match"
                  ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Modo Match</span>
            </button>

            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === "explore"
                  ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Explorar Saberes</span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition-all relative ${
                activeTab === "messages"
                  ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Mensajes</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab("timebank")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === "timebank"
                  ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Banco de Horas</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === "profile"
                  ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <User className="w-4 h-4 text-purple-400" />
              <span>Mi Perfil</span>
            </button>
          </nav>

          {/* Right Controls: User Switcher & Add Skill */}
          <div className="flex items-center gap-3">
            {/* Quick Add Skill button */}
            <button
              onClick={onOpenNewSkillModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400 transition-all shadow-md shadow-teal-500/10 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Ofrecer Saber</span>
            </button>

            {/* Hours balance pill */}
            {currentUser && (
              <div 
                onClick={() => setActiveTab("timebank")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-teal-500/30 text-teal-300 text-xs font-bold cursor-pointer hover:bg-slate-800 transition-all"
                title="Tus horas de trueque disponibles"
              >
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>{currentUser.hoursBalance} hrs</span>
              </div>
            )}

            {/* User Switcher Dropdown */}
            {currentUser && (
              <div className="relative group">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-teal-400"
                  />
                  <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
                  <div className="px-3 py-1.5 border-b border-slate-700/70 mb-1">
                    <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      Cambiar Usuario Demo:
                    </p>
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => onSelectUser(u.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-700/60 transition-colors ${
                        currentUser.id === u.id ? "bg-teal-500/20 text-teal-300 font-bold" : "text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="truncate">{u.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{u.city}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around bg-slate-900 border-t border-slate-800 py-2.5 px-1 fixed bottom-0 left-0 right-0 z-50">
        <button
          onClick={() => setActiveTab("match")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "match" ? "text-teal-400 font-bold" : "text-slate-400"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Match</span>
        </button>
        <button
          onClick={() => setActiveTab("explore")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "explore" ? "text-teal-400 font-bold" : "text-slate-400"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Buscar</span>
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "messages" ? "text-teal-400 font-bold" : "text-slate-400"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Mensajes</span>
        </button>
        <button
          onClick={() => setActiveTab("timebank")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "timebank" ? "text-teal-400 font-bold" : "text-slate-400"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Horas</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium ${
            activeTab === "profile" ? "text-teal-400 font-bold" : "text-slate-400"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Perfil</span>
        </button>
      </div>
    </header>
  );
};
