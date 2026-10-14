"use client";

import React, { useState, useEffect } from "react";
import { 
  User, MapPin, Calendar, Plus, Star, CheckCircle2, 
  Trash2, ShieldCheck, Clock, BookOpen, Laptop, Sparkles 
} from "lucide-react";

interface ProfileViewProps {
  currentUser: any;
  onOpenNewSkillModal: () => void;
  onRefreshUser: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onOpenNewSkillModal,
  onRefreshUser,
}) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users?id=${currentUser.id}`);
      const data = await res.json();
      if (data.user) {
        setProfileData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  if (loading || !profileData) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-slate-400">
        Cargando perfil...
      </div>
    );
  }

  const { user, skillsOffered, skillsWanted } = profileData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-teal-400 shadow-xl"
            />
            {user.verified && (
              <div className="absolute -bottom-2 -right-2 bg-teal-500 text-slate-950 p-1.5 rounded-full shadow">
                <CheckCircle2 className="w-5 h-5 fill-teal-500 text-slate-950 stroke-[2.5]" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black">{user.name}, {user.age}</h1>
                <p className="text-xs text-teal-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.address || user.city}</span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{user.rating?.toFixed(1)} ★</span>
                </div>
                <div className="bg-teal-500/10 border border-teal-500/20 text-teal-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span>{user.hoursBalance} hrs</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              "{user.bio || "Entusiasta del aprendizaje colaborativo y el Trueque de Saberes."}"
            </p>
          </div>
        </div>
      </div>

      {/* Skills Offered Section ("Lo que sé / Enseño") */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>Saberes que Ofrezco (Lo que Sé)</span>
            </h2>
            <p className="text-xs text-slate-400">Estas habilidades aparecen en el mazo de intercambio</p>
          </div>

          <button
            onClick={onOpenNewSkillModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Agregar Saber</span>
          </button>
        </div>

        {skillsOffered.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Aún no has registrado saberes para ofrecer.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillsOffered.map((sk: any) => (
              <div
                key={sk.id}
                className="bg-slate-950 border border-teal-500/30 rounded-2xl p-4 space-y-2 text-white"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">
                    {sk.category}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {sk.durationHours} hr de duración
                  </span>
                </div>
                <h3 className="font-bold text-sm text-teal-300">{sk.title}</h3>
                <p className="text-xs text-slate-400">{sk.description}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>{sk.availability}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Wanted Section ("Lo que quiero aprender") */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-lg font-extrabold text-white mb-2 flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <span>Saberes que Deseo Aprender</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">Nos ayuda a sugerirte matches relevantes</p>

        {skillsWanted.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No has agregado saberes que buscas.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skillsWanted.map((w: any) => (
              <span
                key={w.id}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-xs flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{w.title}</span>
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
