"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Calendar, MapPin, CheckCircle2, ArrowRightLeft, 
  Video, Star, User, ShieldCheck, Sparkles 
} from "lucide-react";
import { triggerConfetti } from "@/lib/confetti";

interface ChatViewProps {
  currentUser: any;
  allUsers: any[];
  onOpenVirtualRoom: (partnerName: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  allUsers,
  onOpenVirtualRoom,
}) => {
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Available chat partners (all users except current user)
  const chatPartners = allUsers.filter((u) => u.id !== currentUser?.id);

  useEffect(() => {
    if (chatPartners.length > 0 && !selectedPartner) {
      // Default to Carlos if active is Sofía, or first available partner
      const defaultPartner = chatPartners.find(u => u.name.includes("Carlos")) || chatPartners[0];
      setSelectedPartner(defaultPartner);
    }
  }, [chatPartners, currentUser]);

  const fetchMessages = async () => {
    if (!currentUser || !selectedPartner) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?userId1=${currentUser.id}&userId2=${selectedPartner.id}`);
      const data = await res.json();
      if (data.messages) {
        setMessagesList(data.messages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentUser, selectedPartner]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesList]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !selectedPartner) return;

    const textToSend = inputText;
    setInputText("");

    // Optimistic update
    const tempMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: selectedPartner.id,
      text: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessagesList((prev) => [...prev, tempMsg]);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedPartner.id,
          text: textToSend,
        }),
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[700px]">
        
        {/* Sidebar Chat List */}
        <div className="w-full md:w-80 bg-slate-950 border-r border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800">
            <h2 className="font-extrabold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Mis Conversaciones</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Personas con las que tienes un match de saber</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {chatPartners.map((partner) => {
              const isSelected = selectedPartner?.id === partner.id;
              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition-all ${
                    isSelected ? "bg-teal-500/15 border-l-4 border-teal-400" : "hover:bg-slate-900"
                  }`}
                >
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-11 h-11 rounded-full object-cover border border-teal-400 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm truncate">{partner.name}</h4>
                      <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {partner.rating?.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      📍 {partner.city}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Main Area */}
        {selectedPartner ? (
          <div className="flex-1 flex flex-col bg-slate-900">
            
            {/* Chat Partner Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPartner.avatar}
                  alt={selectedPartner.name}
                  className="w-10 h-10 rounded-full object-cover border border-teal-400"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{selectedPartner.name}</h3>
                  <p className="text-xs text-teal-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Perfil Verificado • {selectedPartner.address || selectedPartner.city}</span>
                  </p>
                </div>
              </div>

              {/* Action: Open Virtual Room */}
              <button
                onClick={() => onOpenVirtualRoom(selectedPartner.name)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all shadow-md"
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Sala Virtual de Intercambio</span>
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messagesList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm">No hay mensajes aún. ¡Inicia la conversación para coordinar el trueque!</p>
                </div>
              ) : (
                messagesList.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  let proposal = null;
                  if (msg.proposalData) {
                    try {
                      proposal = JSON.parse(msg.proposalData);
                    } catch (e) {}
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm ${
                          isMe
                            ? "bg-teal-600 text-white rounded-br-none shadow"
                            : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* Proposal Card Attachment */}
                        {proposal && (
                          <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-teal-500/40 text-slate-200">
                            <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs mb-1">
                              <ArrowRightLeft className="w-4 h-4" />
                              <span>Acuerdo de Trueque de Saberes</span>
                            </div>
                            <p className="text-xs font-bold text-white">
                              {proposal.user1SkillTitle} ↔️ {proposal.user2SkillTitle}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              📍 {proposal.locationOrLink} • {proposal.scheduledDate}
                            </p>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Escribe un mensaje para ${selectedPartner.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                className="p-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Selecciona una conversación
          </div>
        )}

      </div>
    </div>
  );
};
