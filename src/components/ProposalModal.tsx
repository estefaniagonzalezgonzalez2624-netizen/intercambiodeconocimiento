"use client";

import React, { useState } from "react";
import { X, ArrowRightLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: any;
  targetSkill: any;
  currentUser: any;
  onSendSuccess: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  targetSkill,
  currentUser,
  onSendSuccess,
}) => {
  const [mySkillTitle, setMySkillTitle] = useState("1 hora de Tutoría o Saber");
  const [availability, setAvailability] = useState("A convenir");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !targetUser || !targetSkill) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create exchange
      const res = await fetch("/api/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user1Id: currentUser?.id || 1,
          user2Id: targetUser.id,
          user1SkillTitle: mySkillTitle,
          user2SkillTitle: targetSkill.title,
          user1Availability: availability,
          user2Availability: targetSkill.availability,
          mode: targetSkill.mode || "presencial",
          locationOrLink: targetUser.city || "Buenos Aires",
          scheduledDate: "A convenir entre las partes",
          notes: notes || "Propuesta enviada desde la sección Explorar.",
        }),
      });

      triggerConfetti();
      onSendSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white relative shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Proponer Trueque de Saberes</h3>
            <p className="text-xs text-slate-400">Para {targetUser.name}</p>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="text-teal-300 font-bold">
            Deseas aprender: <span className="text-white">{targetSkill.title}</span>
          </div>
          <div className="text-slate-400">
            Ofrecido por {targetUser.name} ({targetUser.city})
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              ¿Qué le ofreces enseñar a cambio?
            </label>
            <input
              type="text"
              required
              value={mySkillTitle}
              onChange={(e) => setMySkillTitle(e.target.value)}
              placeholder="Ej. 1 hora de Maquillaje, 1 hora de Guitarra, 1 hora de Excel"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Tu disponibilidad de horario:
            </label>
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Ej. Lunes a Viernes de 6 a 8 pm"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Mensaje personal (Opcional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Hola, me encantaría intercambiar una hora..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Enviando Propuesta..." : "¡Enviar Propuesta de Trueque!"}
          </button>
        </form>
      </div>
    </div>
  );
};
