"use client";

import React, { useState } from "react";
import { X, PlusCircle, Sparkles } from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onSkillAdded: () => void;
}

export const AddSkillModal: React.FC<AddSkillModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSkillAdded,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("tech");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("Lunes a Viernes, 6:00 p.m. - 8:00 p.m.");
  const [mode, setMode] = useState("ambos");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !currentUser) return;
    setSubmitting(true);

    try {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "offered",
          userId: currentUser.id,
          title: title.startsWith("1 hora de") ? title : `1 hora de ${title}`,
          category,
          description,
          availability,
          mode,
          durationHours: 1,
        }),
      });

      triggerConfetti();
      onSkillAdded();
      onClose();
      setTitle("");
      setDescription("");
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
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Publicar Nuevo Saber</h3>
            <p className="text-xs text-slate-400">¿Qué puedes enseñar a la comunidad?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Nombre de la Habilidad:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Maquillaje Profesional, Reparación de PC, Excel, Guitarra..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Categoría:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
            >
              <option value="tech">💻 Tecnología & IT</option>
              <option value="languages">🗣️ Idiomas & Conversación</option>
              <option value="music">🎸 Música & Canto</option>
              <option value="beauty">💄 Belleza & Cuidados</option>
              <option value="trades">🔧 Oficios & Reparaciones</option>
              <option value="fitness">🧘 Yoga & Bienestar</option>
              <option value="cooking">🍳 Cocina & Gastronomía</option>
              <option value="business">📊 Negocios & Finanzas</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Descripción de lo que enseñarás:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica brevemente qué temas abarcas en tu clase de 1 hora..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Disponibilidad Horaria:
            </label>
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Modalidad:
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
            >
              <option value="ambos">Ambos (Presencial o Virtual)</option>
              <option value="presencial">Presencial únicamente</option>
              <option value="virtual">Virtual por videollamada</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Publicando..." : "¡Publicar Saber en Trueque!"}
          </button>
        </form>
      </div>
    </div>
  );
};
