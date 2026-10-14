"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { SwipeDeck } from "@/components/SwipeDeck";
import { MatchModal } from "@/components/MatchModal";
import { ExploreSkills } from "@/components/ExploreSkills";
import { ChatView } from "@/components/ChatView";
import { TimeBankView } from "@/components/TimeBankView";
import { ProfileView } from "@/components/ProfileView";
import { ProposalModal } from "@/components/ProposalModal";
import { AddSkillModal } from "@/components/AddSkillModal";
import { VirtualRoomModal } from "@/components/VirtualRoomModal";
import { triggerConfetti } from "@/lib/confetti";
import { Sparkles, ArrowRightLeft, ShieldCheck, Clock, BookOpen } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"match" | "explore" | "messages" | "timebank" | "profile">("match");
  
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [swipeCards, setSwipeCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);

  // Modals state
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [currentMatchData, setCurrentMatchData] = useState<any>(null);

  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalTargetUser, setProposalTargetUser] = useState<any>(null);
  const [proposalTargetSkill, setProposalTargetSkill] = useState<any>(null);

  const [addSkillModalOpen, setAddSkillModalOpen] = useState(false);

  const [virtualRoomOpen, setVirtualRoomOpen] = useState(false);
  const [virtualPartnerName, setVirtualPartnerName] = useState("Carlos Gómez");

  // Initial load
  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        setAllUsers(data.users);
        if (!currentUser) {
          setCurrentUser(data.users[0]); // Sofía Martínez
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadCardsForUser = async (userId: number) => {
    setLoadingCards(true);
    try {
      const res = await fetch(`/api/matches?userId=${userId}`);
      const data = await res.json();
      if (data.cards) {
        setSwipeCards(data.cards);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      loadCardsForUser(currentUser.id);
    }
  }, [currentUser?.id]);

  const handleSelectUser = (userId: number) => {
    const selected = allUsers.find((u) => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
    }
  };

  const refreshCurrentUser = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users?id=${currentUser.id}`);
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwipe = async (toUserId: number, action: "like" | "pass" | "superlike") => {
    if (!currentUser) return;

    try {
      const res = await fetch("/api/swipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUser.id,
          toUserId,
          action,
        }),
      });

      const data = await res.json();

      if (data.isMatch && data.matchData) {
        setCurrentMatchData(data.matchData);
        setIsMatchModalOpen(true);
        triggerConfetti();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmExchangeFromModal = async (exchangeData: any) => {
    try {
      await fetch("/api/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exchangeData),
      });
      setActiveTab("messages");
      refreshCurrentUser();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenProposal = (user: any, skill: any) => {
    setProposalTargetUser(user);
    setProposalTargetSkill(skill);
    setProposalModalOpen(true);
  };

  const handleOpenVirtualRoom = (partnerName: string) => {
    setVirtualPartnerName(partnerName);
    setVirtualRoomOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-8">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        onOpenNewSkillModal={() => setAddSkillModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "match" && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            
            {/* Banner Header */}
            <div className="text-center max-w-lg mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Trueque de Saberes • Modo Tinder</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Desliza y encuentra tu próximo intercambio
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Encuentra personas que enseñan lo que quieres aprender y buscan lo que tú sabes.
              </p>
            </div>

            {/* Swipe Deck */}
            {loadingCards ? (
              <div className="max-w-md mx-auto h-[500px] rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse flex items-center justify-center text-slate-500 text-sm">
                Cargando tarjetas de saberes...
              </div>
            ) : (
              <SwipeDeck
                cards={swipeCards}
                onSwipe={handleSwipe}
                onRefreshCards={() => currentUser && loadCardsForUser(currentUser.id)}
                currentUser={currentUser}
              />
            )}

            {/* Sub banner features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-900 max-w-3xl mx-auto">
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center space-y-1">
                <div className="text-teal-400 text-lg font-bold">100% Gratuito</div>
                <p className="text-[11px] text-slate-400">Intercambio de horas sin dinero de por medio</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center space-y-1">
                <div className="text-amber-400 text-lg font-bold">Garantía de Tiempo</div>
                <p className="text-[11px] text-slate-400">Banco de horas comunitario respaldado</p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center space-y-1">
                <div className="text-cyan-400 text-lg font-bold">Modalidad Flexible</div>
                <p className="text-[11px] text-slate-400">Clases presenciales en tu ciudad o por videollamada</p>
              </div>
            </div>

          </div>
        )}

        {activeTab === "explore" && (
          <ExploreSkills
            currentUser={currentUser}
            onProposeTrade={handleOpenProposal}
          />
        )}

        {activeTab === "messages" && (
          <ChatView
            currentUser={currentUser}
            allUsers={allUsers}
            onOpenVirtualRoom={handleOpenVirtualRoom}
          />
        )}

        {activeTab === "timebank" && (
          <TimeBankView
            currentUser={currentUser}
            onRefreshUser={refreshCurrentUser}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            currentUser={currentUser}
            onOpenNewSkillModal={() => setAddSkillModalOpen(true)}
            onRefreshUser={refreshCurrentUser}
          />
        )}
      </main>

      {/* Match Overlay Modal */}
      <MatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        matchData={currentMatchData}
        onConfirmExchange={handleConfirmExchangeFromModal}
      />

      {/* Proposal Modal */}
      <ProposalModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        targetUser={proposalTargetUser}
        targetSkill={proposalTargetSkill}
        currentUser={currentUser}
        onSendSuccess={() => {
          setActiveTab("messages");
          refreshCurrentUser();
        }}
      />

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={addSkillModalOpen}
        onClose={() => setAddSkillModalOpen(false)}
        currentUser={currentUser}
        onSkillAdded={() => {
          refreshCurrentUser();
          if (currentUser) loadCardsForUser(currentUser.id);
        }}
      />

      {/* Virtual Classroom Simulator */}
      <VirtualRoomModal
        isOpen={virtualRoomOpen}
        onClose={() => setVirtualRoomOpen(false)}
        partnerName={virtualPartnerName}
      />

    </div>
  );
}
