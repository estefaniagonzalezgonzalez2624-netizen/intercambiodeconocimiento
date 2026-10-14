"use client";

import React, { useState, useEffect } from "react";
import { 
  Clock, ShieldCheck, Award, Star, CheckCircle2, 
  ArrowUpRight, ArrowDownLeft, Calendar, MapPin, MessageSquare 
} from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";

interface TimeBankViewProps {
  currentUser: any;
  onRefreshUser: () => void;
}

export const TimeBankView: React.FC<TimeBankViewProps> = ({
  currentUser,
  onRefreshUser,
}) => {
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const fetchExchanges = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/exchanges?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.exchanges) {
        setExchanges(data.exchanges);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, [currentUser]);

  const handleMarkCompleted = async (ex: any) => {
    setSelectedExchangeForReview(ex);
    setReviewModalOpen(true);
  };

  const handleSubmitReviewAndComplete = async () => {
    if (!selectedExchangeForReview || !currentUser) return;

    try {
      // 1. Mark exchange as completed
      await fetch("/api/exchanges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchangeId: selectedExchangeForReview.id,
          status: "completed",
        }),
      });

      // 2. Submit review for partner
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchangeId: selectedExchangeForReview.id,
          fromUserId: currentUser.id,
          toUserId: selectedExchangeForReview.partner.id,
          rating: reviewRating,
          comment: reviewComment || "Excelente intercambio de saberes. Puntual y muy didáctico.",
          skillTaught: selectedExchangeForReview.partnerSkill,
        }),
      });

      triggerConfetti();
      setReviewModalOpen(false);
      setReviewComment("");
      onRefreshUser();
      fetchExchanges();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      
      {/* Top Banner: Time Bank Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hours Balance Card */}
        <div className="bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-black/20 px-3 py-1 rounded-full">
                BANCO DE HORAS
              </span>
              <Clock className="w-6 h-6 text-teal-200" />
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-black">{currentUser?.hoursBalance || 3}</span>
              <span className="text-lg font-bold text-teal-100">Horas de Trueque</span>
            </div>
            <p className="text-xs text-teal-100 mt-2">
              1 hora impartida = 1 crédito de tiempo ganado para aprender cualquier otro saber.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
            <span>Intercambios Realizados: {currentUser?.totalReviews || 12}</span>
            <span className="font-bold bg-white text-teal-900 px-2.5 py-1 rounded-lg">Verificado</span>
          </div>
        </div>

        {/* Level & Reputation Badge Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                NIVEL COMUNITARIO
              </span>
              <Award className="w-6 h-6 text-amber-400" />
            </div>

            <h3 className="text-2xl font-black mt-4 text-amber-300">Maestro del Trueque</h3>
            <p className="text-xs text-slate-400 mt-1">
              Calificación Promedio: <strong className="text-amber-400 font-bold">{currentUser?.rating?.toFixed(1) || "5.0"} ★</strong>
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Reputación de Confianza</span>
              <span>100% Positiva</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[95%] h-full bg-gradient-to-r from-amber-400 to-teal-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Rule info box */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              FILOSOFÍA DE TRUEQUE
            </span>
            <h3 className="text-lg font-bold mt-3 text-white">El tiempo de todos vale lo mismo</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Sin importar si enseñas física cuántica, maquillaje o afinación de guitarra: 1 hora de tu tiempo equivale exactamente a 1 hora de otra persona.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-300">
            🤝 Economía circular del conocimiento
          </div>
        </div>

      </div>

      {/* Active Exchanges & Trade History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>Tus Trueques e Intercambios Acordados</span>
        </h2>

        {loading ? (
          <p className="text-slate-400 text-sm">Cargando trueques...</p>
        ) : exchanges.length === 0 ? (
          <p className="text-slate-400 text-sm">No tienes trueques activos aún. ¡Inicia un match para acordar uno!</p>
        ) : (
          <div className="space-y-4">
            {exchanges.map((ex) => {
              const isCompleted = ex.status === "completed";
              return (
                <div
                  key={ex.id}
                  className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                        }`}
                      >
                        {isCompleted ? "✓ Completado (+1 hr)" : "🤝 En Curso / Confirmado"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {ex.scheduledDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={ex.partner?.avatar}
                        alt={ex.partner?.name}
                        className="w-10 h-10 rounded-full object-cover border border-teal-400"
                      />
                      <div>
                        <h4 className="font-bold text-white text-base">
                          Trueque con {ex.partner?.name}
                        </h4>
                        <p className="text-xs text-teal-300 font-semibold">
                          Tú enseñas: {ex.mySkill} ↔️ {ex.partner?.name} enseña: {ex.partnerSkill}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{ex.locationOrLink}</span>
                    </p>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => handleMarkCompleted(ex)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg active:scale-95"
                    >
                      ¡Marcar Trueque como Completado!
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review & Complete Modal */}
      {reviewModalOpen && selectedExchangeForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full text-white space-y-4">
            <h3 className="text-xl font-bold text-teal-400">
              🎉 ¡Felicidades por completar el Trueque!
            </h3>
            <p className="text-xs text-slate-300">
              Califica la sesión con <strong>{selectedExchangeForReview.partner?.name}</strong> para acreditar la hora en tu Banco de Horas.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Calificación en estrellas:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Comentario para el perfil:</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="¿Qué tal estuvo la clase? ¿Salió todo bien?"
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitReviewAndComplete}
                className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-black text-xs shadow-lg"
              >
                Acreditar Hora & Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
