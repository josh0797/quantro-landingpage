import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  KeyRound,
  GraduationCap,
  Calendar,
  History,
  Search,
  UserPlus,
  Shield,
  Eye,
  Crown,
  UserCog,
  UsersRound,
  Sparkles,
  ArrowRight,
  Check,
  Building2,
  Filter,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

/**
 * People OS — "Las personas correctas, donde generan impacto"
 *
 * Two-column layout:
 *   Left  — narrative (eyebrow + headline + bullets)
 *   Right — interactive app mockup with 5 clickable tabs:
 *           Directorio · Accesos · Onboarding · Permisos (Próximo) · Auditoría
 */

const TAB_KEYS = ["directorio", "accesos", "onboarding", "permisos", "auditoria"];

const TAB_ICONS = {
  directorio: Users,
  accesos: KeyRound,
  onboarding: GraduationCap,
  permisos: Calendar,
  auditoria: History,
};

const TAB_LABELS = {
  directorio: { es: "Directorio", en: "Directory" },
  accesos: { es: "Accesos", en: "Access" },
  onboarding: { es: "Onboarding", en: "Onboarding" },
  permisos: { es: "Permisos", en: "Permissions" },
  auditoria: { es: "Auditoría", en: "Audit" },
};

const ROLE_CARDS = [
  { key: "owner", icon: Crown, accent: "#FACC15", es: { name: "Owner", copy: "Control total" }, en: { name: "Owner", copy: "Full control" } },
  { key: "leader", icon: Shield, accent: "#00F5FF", es: { name: "Leader", copy: "Gestiona operaciones" }, en: { name: "Leader", copy: "Runs operations" } },
  { key: "member", icon: UserCog, accent: "#A5F3FC", es: { name: "Member", copy: "Acceso operativo" }, en: { name: "Member", copy: "Operational access" } },
  { key: "viewer", icon: Eye, accent: "#94A3B8", es: { name: "Viewer", copy: "Solo lectura" }, en: { name: "Viewer", copy: "Read-only" } },
];

const AUDIT_SAMPLE = [
  { at: "10:42", esAction: "Rol cambiado a Leader", enAction: "Role changed to Leader", who: "María G.", accent: "#00F5FF" },
  { at: "09:18", esAction: "Nuevo acceso otorgado", enAction: "New access granted", who: "Carlos R.", accent: "#A5F3FC" },
  { at: "Ayer", esAction: "Onboarding completado", enAction: "Onboarding completed", who: "Diego T.", accent: "#86EFAC" },
  { at: "Ayer", esAction: "Permiso de vacaciones aprobado", enAction: "Vacation request approved", who: "Laura P.", accent: "#FACC15" },
];

// =========================================================================
// Tab bodies
// =========================================================================

const TabDirectorio = ({ isEs }) => (
  <div className="space-y-4" data-testid="people-tab-directorio">
    {/* Search */}
    <div className="relative">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        type="text"
        readOnly
        placeholder={isEs ? "Buscar persona, rol o departamento…" : "Search by name, role or team…"}
        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-[12px] text-white placeholder-slate-500 focus:outline-none"
      />
    </div>

    {/* Departamentos */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-500">
          {isEs ? "Departamentos" : "Teams"}
        </p>
        <span className="text-[10px] text-slate-600">0</span>
      </div>
      <div className="rounded-lg border border-dashed border-white/[0.09] bg-white/[0.015] p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={14} className="text-slate-500" />
        </div>
        <div className="text-[11.5px] text-slate-400 leading-snug">
          {isEs
            ? "Sin departamentos creados. Añádelos para estructurar tu organización."
            : "No teams yet. Add them to structure your organization."}
        </div>
      </div>
    </div>

    {/* Personas */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-500">
          {isEs ? "Personas" : "People"}
        </p>
        <span className="text-[10px] text-slate-600">0</span>
      </div>
      <div className="rounded-lg border border-dashed border-white/[0.09] bg-white/[0.015] p-5 text-center">
        <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-2">
          <UsersRound size={16} className="text-slate-500" />
        </div>
        <p className="text-[12px] text-white font-medium">
          {isEs ? "Aún no hay personas" : "No people yet"}
        </p>
        <p className="text-[11px] text-slate-500 leading-snug mt-1">
          {isEs ? "Agrega personas desde Accesos" : "Add people from Access"}
        </p>
      </div>
    </div>
  </div>
);

const TabAccesos = ({ isEs }) => (
  <div className="space-y-4" data-testid="people-tab-accesos">
    <div className="flex items-center justify-between gap-2">
      <div>
        <p className="text-[13px] font-semibold text-white leading-tight">
          {isEs ? "Control de accesos" : "Access control"}
        </p>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
          {isEs
            ? "Define qué puede ver y hacer cada persona."
            : "Define what each person can see and do."}
        </p>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] text-[11px] font-semibold shadow-lg shadow-[#00F5FF]/20"
        data-testid="people-invite-btn"
      >
        <UserPlus size={12} />
        {isEs ? "Invitar persona" : "Invite"}
      </button>
    </div>

    {/* Filter chips */}
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      <Filter size={11} className="text-slate-500 flex-shrink-0" />
      {[
        { es: "Todos", en: "All", active: true },
        { es: "Roles", en: "Roles" },
        { es: "Departamentos", en: "Teams" },
        { es: "Ubicación", en: "Location" },
      ].map((f) => (
        <span
          key={f.es}
          className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full border whitespace-nowrap ${
            f.active
              ? "bg-[#00F5FF]/10 text-[#7FF5FF] border-[#00F5FF]/30"
              : "bg-white/[0.02] text-slate-400 border-white/10"
          }`}
        >
          {isEs ? f.es : f.en}
        </span>
      ))}
    </div>

    {/* Role cards */}
    <div className="grid grid-cols-2 gap-2.5">
      {ROLE_CARDS.map((r) => {
        const Icon = r.icon;
        const label = isEs ? r.es : r.en;
        return (
          <div
            key={r.key}
            className="rounded-lg p-3 bg-white/[0.015] border border-white/[0.06] hover:border-white/15 transition-colors"
            data-testid={`people-role-${r.key}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{
                  background: `${r.accent}18`,
                  border: `1px solid ${r.accent}40`,
                }}
              >
                <Icon size={12} style={{ color: r.accent }} />
              </span>
              <span className="text-[12px] font-semibold text-white">{label.name}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {label.copy}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

const TabOnboarding = ({ isEs }) => {
  const metrics = [
    { key: "active", es: "Activos", en: "Active", value: "0", accent: "#86EFAC" },
    { key: "pending", es: "Pendientes", en: "Pending", value: "0", accent: "#FACC15" },
    { key: "noaccess", es: "Sin acceso", en: "No access", value: "0", accent: "#94A3B8" },
    { key: "progress", es: "% Onboarding", en: "% Onboarding", value: "—", accent: "#00F5FF" },
  ];

  return (
    <div className="space-y-4" data-testid="people-tab-onboarding">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {metrics.map((m) => (
          <div
            key={m.key}
            className="rounded-lg p-3 bg-white/[0.015] border border-white/[0.06]"
          >
            <div className="text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500 leading-none mb-2">
              {isEs ? m.es : m.en}
            </div>
            <div
              className="font-satoshi font-bold text-xl tabular-nums leading-none"
              style={{ color: m.accent }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-white/[0.09] bg-white/[0.015] p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-2">
          <GraduationCap size={16} className="text-slate-500" />
        </div>
        <p className="text-[12px] text-white font-medium">
          {isEs ? "Sin onboardings en curso" : "No onboardings in progress"}
        </p>
        <p className="text-[11px] text-slate-500 leading-snug mt-1 max-w-[280px] mx-auto">
          {isEs
            ? "Invita personas desde Accesos para ver su progreso aquí."
            : "Invite people from Access to track their progress here."}
        </p>
      </div>
    </div>
  );
};

const TabPermisos = ({ isEs }) => {
  const items = isEs
    ? [
        "Solicitudes de vacaciones",
        "Registro de ausencias",
        "Calendario del equipo",
        "Políticas por rol",
      ]
    : [
        "Vacation requests",
        "Absence tracking",
        "Team calendar",
        "Role-based policies",
      ];

  return (
    <div className="space-y-4" data-testid="people-tab-permisos">
      <div
        className="relative rounded-xl p-5 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(160, 32, 255, 0.08), rgba(12, 18, 34, 0.92))",
          border: "1px solid rgba(160, 32, 255, 0.35)",
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#A020FF]/15 border border-[#A020FF]/40">
            <Calendar size={16} className="text-[#C084FC]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white leading-tight">
              {isEs ? "Permisos y ausencias" : "Permissions & leave"}
            </p>
            <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
              {isEs
                ? "Un solo módulo para gestionar el tiempo del equipo."
                : "One place to manage your team's time."}
            </p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#A020FF]/15 border border-[#A020FF]/40 text-[9px] font-bold tracking-wider uppercase text-[#C084FC]">
            <Sparkles size={9} />
            {isEs ? "Próximo" : "Soon"}
          </span>
        </div>
        <ul className="space-y-2 mt-4">
          {items.map((it) => (
            <li
              key={it}
              className="flex items-center gap-2 text-[12px] text-slate-300"
            >
              <span className="w-1 h-1 rounded-full bg-[#C084FC]" />
              {it}
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled
          className="mt-5 w-full py-2 rounded-lg bg-[#A020FF]/10 border border-[#A020FF]/30 text-[#C084FC] text-[11.5px] font-semibold cursor-not-allowed"
          data-testid="people-permisos-cta"
        >
          {isEs ? "Próximamente" : "Coming soon"}
        </button>
      </div>
    </div>
  );
};

const TabAuditoria = ({ isEs }) => (
  <div className="space-y-3" data-testid="people-tab-auditoria">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[13px] font-semibold text-white leading-tight">
          {isEs ? "Registro de actividad" : "Activity log"}
        </p>
        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
          {isEs
            ? "Cada cambio queda registrado. Rastreable y exportable."
            : "Every change is logged. Traceable and exportable."}
        </p>
      </div>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-semibold text-emerald-300">
        <ShieldCheck size={10} />
        {isEs ? "Activo" : "Live"}
      </span>
    </div>

    <ul className="divide-y divide-white/[0.05] rounded-lg border border-white/[0.06] bg-white/[0.015] overflow-hidden">
      {AUDIT_SAMPLE.map((e, i) => (
        <li key={i} className="flex items-center gap-3 px-3 py-2.5">
          <span
            className="w-1 h-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: e.accent, boxShadow: `0 0 6px ${e.accent}80` }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-white leading-tight">
              {isEs ? e.esAction : e.enAction}
              <span className="text-slate-500 font-normal"> · {e.who}</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 tabular-nums flex-shrink-0">
            <Clock size={10} />
            {e.at}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const TAB_BODIES = {
  directorio: TabDirectorio,
  accesos: TabAccesos,
  onboarding: TabOnboarding,
  permisos: TabPermisos,
  auditoria: TabAuditoria,
};

// =========================================================================
// Main section
// =========================================================================

export const PeopleOSSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [tab, setTab] = useState("directorio");

  const TabBody = TAB_BODIES[tab];

  const bullets = isEs
    ? [
        "Directorio centralizado de todo tu equipo",
        "Control de accesos por rol y departamento",
        "Onboarding estructurado y medible",
        "Permisos y políticas en un solo lugar",
        "Auditoría completa de cambios y accesos",
      ]
    : [
        "Centralized directory of your whole team",
        "Access control by role and team",
        "Structured, measurable onboarding",
        "Permissions and policies in one place",
        "Full audit of changes and access",
      ];

  return (
    <AnimatedSection
      id="people-os"
      className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden"
      data-testid="people-os-section"
      style={{
        background:
          "radial-gradient(ellipse at 15% 30%, rgba(0,245,255,0.04) 0%, transparent 55%), #030712",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 85% 70%, rgba(160, 32, 255, 0.035), transparent 45%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto grid xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-10 sm:gap-12 xl:gap-14 items-start">
        {/* Left — narrative */}
        <motion.div variants={fadeInUp} className="xl:pt-4 min-w-0" data-testid="people-narrative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/[0.05] text-[10px] font-bold tracking-[0.22em] uppercase text-[#00F5FF] mb-5">
            <Users size={11} />
            {isEs ? "People OS" : "People OS"}
          </span>

          <h2
            className="font-satoshi font-bold text-white leading-[1.1] tracking-tight [text-wrap:balance] break-words"
            style={{ fontSize: "clamp(26px, 5.4vw, 44px)" }}
            data-testid="people-headline"
          >
            {isEs ? (
              <>
                Las personas correctas,{" "}
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                  donde generan impacto.
                </span>
              </>
            ) : (
              <>
                The right people,{" "}
                <span className="bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] bg-clip-text text-transparent">
                  where they create impact.
                </span>
              </>
            )}
          </h2>

          <p className="text-[15px] sm:text-[15px] text-slate-400 leading-[1.55] mt-5 max-w-lg">
            {isEs
              ? "Gestiona accesos, roles, onboarding y estructura organizacional sin hojas de cálculo, sin herramientas separadas."
              : "Manage access, roles, onboarding and org structure without spreadsheets or scattered tools."}
          </p>

          <ul className="space-y-2 sm:space-y-3 mt-6 sm:mt-7" data-testid="people-bullets">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 sm:gap-3 text-[13px] sm:text-[13.5px] text-slate-300 leading-snug"
              >
                <span className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#00F5FF]/10 border border-[#00F5FF]/25 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-[#00F5FF]" strokeWidth={2.8} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div
            className="mt-8 pt-5 border-t border-white/[0.06] text-[12.5px] text-slate-500 leading-relaxed max-w-md"
          >
            {isEs ? (
              <>
                Antes, tu equipo vivía en múltiples herramientas.
                <br />
                <span className="text-slate-300 font-medium">
                  Ahora vive dentro de Quantro.
                </span>
              </>
            ) : (
              <>
                Your team used to live across many tools.
                <br />
                <span className="text-slate-300 font-medium">
                  Now it lives inside Quantro.
                </span>
              </>
            )}
          </div>
        </motion.div>

        {/* Right — app mockup */}
        <motion.div
          variants={fadeInUp}
          className="relative"
          data-testid="people-mockup"
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(14, 22, 40, 0.92) 0%, rgba(5, 10, 24, 0.88) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.12)",
              boxShadow:
                "0 40px 80px -30px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 245, 255, 0.04), 0 0 60px -10px rgba(0, 245, 255, 0.12)",
            }}
          >
            {/* App chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                <span className="ml-3 text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500">
                  Quantro OS · People
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-300 font-semibold">
                <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                {isEs ? "En vivo" : "Live"}
              </span>
            </div>

            {/* Tabs */}
            <div
              className="flex items-center gap-1.5 px-3 py-3 border-b border-white/[0.05] overflow-x-auto"
              role="tablist"
              data-testid="people-tabs"
            >
              {TAB_KEYS.map((key) => {
                const Icon = TAB_ICONS[key];
                const isActive = tab === key;
                const isSoon = key === "permisos";
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setTab(key)}
                    data-testid={`people-tab-btn-${key}`}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#00F5FF]/10 text-[#7FF5FF] border border-[#00F5FF]/35 shadow-[0_0_0_1px_rgba(0,245,255,0.05)]"
                        : "text-slate-400 hover:text-white border border-transparent hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon size={12} />
                    <span>{TAB_LABELS[key][isEs ? "es" : "en"]}</span>
                    {isSoon && (
                      <span
                        className="text-[8px] font-bold tracking-wider uppercase px-1 py-0.5 rounded-sm bg-[#A020FF]/15 text-[#C084FC] border border-[#A020FF]/30 ml-0.5"
                        data-testid="people-permisos-badge"
                      >
                        {isEs ? "Próximo" : "Soon"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Body — auto-sized, no heavy mask to avoid clipping content */}
            <div className="relative p-4 sm:p-5" role="tabpanel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TabBody isEs={isEs} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Subtle caption below mockup */}
          <div className="mt-3 flex items-center justify-end gap-1.5 text-[10.5px] text-slate-500">
            <ArrowRight size={10} />
            {isEs
              ? "Haz clic en cualquier pestaña para explorar"
              : "Click any tab to explore"}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default PeopleOSSection;
