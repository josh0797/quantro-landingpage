import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Target,
  Trophy,
  RotateCw,
  AlertTriangle,
  CheckSquare,
  Calendar,
  Network,
  Users,
  Video,
  Bot,
  Activity,
  FileText,
  DollarSign,
  Search,
  Plus,
  Download,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Clock,
  Zap,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AnimatedSection from "../AnimatedSection";
import { fadeInUp } from "../../lib/animations";
import { useLanguage } from "../../hooks/useLanguage";

/* ============================================================
   Quantro OS — Interactive Demo
   Premium Apple/Stripe/Linear-style product mock.
   Single-file component with sidebar + topbar + switchable views.
   ============================================================ */

const ACCENT = "#00F5FF";
const BG = "#050A18";
const PANEL = "#0A1020";
const BORDER = "rgba(148, 163, 184, 0.08)";
const BORDER_STRONG = "rgba(148, 163, 184, 0.14)";

/* ---------- shared atoms ---------- */

const StatusDot = ({ tone = "ok" }) => {
  const map = {
    ok: "#34D399",
    warn: "#F59E0B",
    bad: "#EF4444",
    info: "#00F5FF",
    muted: "#475569",
  };
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: map[tone] }}
    />
  );
};

const Pill = ({ tone = "muted", children }) => {
  const styles = {
    ok: { bg: "rgba(52, 211, 153, 0.1)", br: "rgba(52, 211, 153, 0.25)", c: "#34D399" },
    warn: { bg: "rgba(245, 158, 11, 0.1)", br: "rgba(245, 158, 11, 0.25)", c: "#F59E0B" },
    bad: { bg: "rgba(239, 68, 68, 0.1)", br: "rgba(239, 68, 68, 0.25)", c: "#EF4444" },
    info: { bg: "rgba(0, 245, 255, 0.08)", br: "rgba(0, 245, 255, 0.25)", c: "#00F5FF" },
    violet: { bg: "rgba(192, 132, 252, 0.1)", br: "rgba(192, 132, 252, 0.25)", c: "#C084FC" },
    muted: { bg: "rgba(148, 163, 184, 0.08)", br: "rgba(148, 163, 184, 0.18)", c: "#94A3B8" },
  }[tone];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium"
      style={{ backgroundColor: styles.bg, border: `1px solid ${styles.br}`, color: styles.c }}
    >
      {children}
    </span>
  );
};

const Avatar = ({ initials, tone = "#00F5FF", size = 24 }) => (
  <span
    className="inline-flex items-center justify-center rounded-full font-semibold"
    style={{
      width: size,
      height: size,
      fontSize: Math.round(size * 0.42),
      background: `linear-gradient(135deg, ${tone}33, ${tone}11)`,
      border: `1px solid ${tone}40`,
      color: tone,
    }}
  >
    {initials}
  </span>
);

/* ---------- sidebar ---------- */

const SIDEBAR_GROUPS = (isEs) => [
  {
    label: isEs ? "Operaciones" : "Operations",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
      { key: "scorecard", label: "Scorecard", icon: Target, active: true },
      { key: "rocks", label: "Rocks", icon: Trophy, active: true },
      { key: "cycles", label: "Cycles", icon: RotateCw, active: false },
      { key: "issues", label: "Issues", icon: AlertTriangle, active: true },
      { key: "todos", label: "To-Dos", icon: CheckSquare, active: true },
      { key: "calendar", label: isEs ? "Calendario" : "Calendar", icon: Calendar, active: false },
      { key: "org", label: isEs ? "Organigrama" : "Org chart", icon: Network, active: false },
      { key: "team", label: isEs ? "Mi Equipo" : "My Team", icon: Users, active: false },
    ],
  },
  {
    label: isEs ? "Inteligencia" : "Intelligence",
    items: [
      { key: "meeting", label: isEs ? "Reunión AI" : "AI Meeting", icon: Video, active: false },
      { key: "agents", label: isEs ? "Agentes IA" : "AI Agents", icon: Bot, active: true },
      { key: "lean", label: "Lean Analysis", icon: Activity, active: false },
      { key: "sops", label: "SOPs", icon: FileText, active: false },
      { key: "revenue", label: "Quantro Revenue", icon: DollarSign, active: true },
    ],
  },
];

const SidebarLogo = () => (
  <div className="flex items-center gap-2.5 px-3 py-4">
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: "linear-gradient(135deg, #0F172A, #030712)",
        border: "1px solid rgba(0, 245, 255, 0.35)",
        boxShadow: "0 0 16px -6px rgba(0, 245, 255, 0.45)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="31" r="11" stroke="#00F5FF" strokeWidth="4" fill="none" />
        <path d="M39 38.5 L47 47" stroke="#00F5FF" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
    <div className="leading-none">
      <div className="font-satoshi font-semibold text-sm text-white tracking-tight">Quantro</div>
      <div className="text-[10px] text-slate-500 tracking-wider uppercase mt-0.5">
        Powered by AOS
      </div>
    </div>
  </div>
);

const SidebarItem = ({ item, current, onClick }) => {
  const Icon = item.icon;
  const isActive = current === item.key;
  return (
    <button
      type="button"
      onClick={() => item.active && onClick(item.key)}
      disabled={!item.active}
      className={`group w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[12px] transition-all ${
        isActive
          ? "text-white"
          : item.active
          ? "text-slate-400 hover:text-white hover:bg-white/[0.03]"
          : "text-slate-600 cursor-default"
      }`}
      style={
        isActive
          ? {
              background:
                "linear-gradient(90deg, rgba(0, 245, 255, 0.08), rgba(0, 245, 255, 0.02))",
              border: "1px solid rgba(0, 245, 255, 0.22)",
            }
          : { border: "1px solid transparent" }
      }
      data-testid={`demo-nav-${item.key}`}
    >
      <Icon
        size={14}
        className="flex-shrink-0"
        style={{ color: isActive ? ACCENT : undefined }}
      />
      <span className="truncate">{item.label}</span>
      {isActive && (
        <span
          className="ml-auto w-1 h-1 rounded-full"
          style={{ backgroundColor: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
        />
      )}
    </button>
  );
};

const Sidebar = ({ current, onNavigate, isEs }) => {
  const groups = SIDEBAR_GROUPS(isEs);
  return (
    <aside
      className="flex-shrink-0 hidden md:flex flex-col"
      style={{
        width: 232,
        background: "linear-gradient(180deg, #070D1C 0%, #050A18 100%)",
        borderRight: `1px solid ${BORDER}`,
      }}
    >
      <SidebarLogo />
      <div className="px-3">
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] text-slate-500"
          style={{ background: "rgba(148, 163, 184, 0.04)", border: `1px solid ${BORDER}` }}
        >
          <Search size={11} />
          <span>{isEs ? "Buscar…" : "Search…"}</span>
          <span className="ml-auto text-[9px] text-slate-600">⌘K</span>
        </div>
      </div>

      <nav className="flex-1 overflow-hidden px-2 pt-5 space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-[9px] font-semibold tracking-[0.14em] uppercase text-slate-600">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.key}
                  item={item}
                  current={current}
                  onClick={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div
        className="m-2 p-2.5 rounded-lg flex items-center gap-2.5"
        style={{ background: "rgba(148, 163, 184, 0.04)", border: `1px solid ${BORDER}` }}
      >
        <Avatar initials="CO" size={28} />
        <div className="flex-1 min-w-0 leading-none">
          <div className="text-[11px] text-white font-medium truncate">contacto</div>
          <div className="text-[9px] text-slate-500 mt-0.5">contacto@quantroos.com</div>
        </div>
        <span
          className="text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded"
          style={{
            background: "linear-gradient(90deg, #00F5FF, #22D3EE)",
            color: "#0A0F1C",
          }}
        >
          ENTERPRISE
        </span>
      </div>
    </aside>
  );
};

/* ---------- topbar ---------- */

const TITLE_MAP = (isEs) => ({
  dashboard: { t: "Dashboard", s: isEs ? "Inicio · hoy" : "Home · today" },
  scorecard: {
    t: "Scorecard",
    s: isEs ? "Números que mantienen el negocio en pista" : "Numbers that keep the business on track",
  },
  rocks: { t: "Rocks", s: isEs ? "Objetivos trimestrales" : "Quarterly goals" },
  issues: { t: "Issues", s: isEs ? "Problemas operativos abiertos" : "Open operational issues" },
  todos: { t: "To-Dos", s: isEs ? "Tareas accionables" : "Actionable tasks" },
  agents: { t: isEs ? "Agentes IA" : "AI Agents", s: isEs ? "Inteligencia trabajando por ti" : "Intelligence working for you" },
  revenue: {
    t: "Quantro Revenue",
    s: isEs ? "Decision Engine · Revenue Intelligence" : "Decision Engine · Revenue Intelligence",
  },
});

const Topbar = ({ current, isEs }) => {
  const title = TITLE_MAP(isEs)[current] || { t: "Quantro", s: "" };
  return (
    <div
      className="flex items-center gap-4 px-6 py-3"
      style={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(5, 10, 24, 0.7)" }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Quantro OS</span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-300">{title.t}</span>
        </div>
        <div className="text-[10px] text-slate-600 mt-0.5 truncate">{title.s}</div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-slate-400 hover:text-white transition-colors"
          style={{ background: "rgba(148, 163, 184, 0.04)", border: `1px solid ${BORDER}` }}
        >
          <Download size={11} />
          {isEs ? "Exportar" : "Export"}
        </button>
        <button
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-slate-400 hover:text-white transition-colors"
          style={{ background: "rgba(148, 163, 184, 0.04)", border: `1px solid ${BORDER}` }}
        >
          <Filter size={11} />
          {isEs ? "Filtros" : "Filters"}
        </button>
      </div>

      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider"
        style={{
          background: "linear-gradient(90deg, rgba(0, 245, 255, 0.15), rgba(34, 211, 238, 0.1))",
          border: "1px solid rgba(0, 245, 255, 0.3)",
          color: ACCENT,
        }}
      >
        <Sparkles size={10} />
        Q2 · LEVEL 10
      </div>

      <Avatar initials="CO" size={26} />
    </div>
  );
};

/* ---------- view components ---------- */

const Card = ({ children, className = "", style = {}, ...rest }) => (
  <div
    className={`rounded-xl ${className}`}
    style={{
      background: "linear-gradient(180deg, rgba(12, 18, 34, 0.7), rgba(10, 16, 32, 0.5))",
      border: `1px solid ${BORDER}`,
      backdropFilter: "blur(8px)",
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

const KpiCard = ({ label, value, delta, tone = "ok", icon: Icon }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] text-slate-500 tracking-wider uppercase">{label}</span>
      {Icon && <Icon size={12} className="text-slate-600" />}
    </div>
    <div className="font-satoshi font-semibold text-xl text-white tabular-nums leading-none">
      {value}
    </div>
    {delta && (
      <div className="flex items-center gap-1 mt-2 text-[10px]">
        {tone === "ok" ? (
          <ArrowUpRight size={10} className="text-emerald-400" />
        ) : tone === "bad" ? (
          <ArrowDownRight size={10} className="text-red-400" />
        ) : (
          <ArrowUpRight size={10} className="text-amber-400" />
        )}
        <span
          className={
            tone === "ok"
              ? "text-emerald-400"
              : tone === "bad"
              ? "text-red-400"
              : "text-amber-400"
          }
        >
          {delta}
        </span>
      </div>
    )}
  </Card>
);

/* ============================================================
   View 1 — Dashboard
   ============================================================ */
const DashboardView = ({ isEs }) => {
  return (
    <div className="p-6 space-y-5">
      {/* Hero greeting */}
      <Card className="p-5 flex items-center gap-5">
        <div className="flex-1">
          <div className="text-[10px] text-[#00F5FF] font-medium tracking-wider uppercase mb-1">
            {isEs ? "Buenos días, Carlos" : "Good morning, Carlos"}
          </div>
          <div className="text-base font-satoshi font-semibold text-white leading-tight">
            {isEs
              ? "Tu empresa está lista para ejecutar."
              : "Your company is ready to execute."}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {isEs
              ? "Detectamos 4 prioridades y 1 riesgo mientras dormías."
              : "We detected 4 priorities and 1 risk while you slept."}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <div className="text-[9px] text-slate-600 tracking-wider uppercase">
            {isEs ? "Autonomía" : "Autonomy"}
          </div>
          <div className="font-satoshi font-bold text-xl text-white tabular-nums leading-none">
            82%
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
            <TrendingUp size={10} /> +6%
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label={isEs ? "Ingreso neto" : "Net Revenue"} value="$847K" delta="+12% MTD" tone="ok" />
        <KpiCard label={isEs ? "Margen bruto" : "Gross margin"} value="67%" delta="+2.1 pp" tone="ok" />
        <KpiCard label={isEs ? "Objetivos fuera de meta" : "Off-track goals"} value="2" delta={isEs ? "de 12" : "of 12"} tone="warn" />
        <KpiCard label={isEs ? "Problemas abiertos" : "Open issues"} value="4" delta={isEs ? "1 nuevo" : "1 new"} tone="bad" />
      </div>

      {/* 2 columns */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Centro de Acción */}
        <Card className="p-4 lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-[#00F5FF]" />
              <span className="text-[11px] font-medium text-white">
                {isEs ? "Centro de Acción" : "Action Center"}
              </span>
              <span className="text-[9px] text-slate-600">·</span>
              <span className="text-[10px] text-slate-500">{isEs ? "prioridades del día" : "today's priorities"}</span>
            </div>
            <Pill tone="info">{isEs ? "Auto-generado" : "Auto-generated"}</Pill>
          </div>
          <div className="space-y-1.5">
            {[
              {
                title: isEs ? "Enviar recordatorio a 3 clientes vencidos" : "Send reminder to 3 overdue clients",
                sub: isEs ? "Riesgo: $1,399" : "Risk: $1,399",
                tone: "bad",
                owner: "LM",
              },
              {
                title: isEs ? "Agendar llamada con cliente top" : "Schedule call with top client",
                sub: isEs ? "Actividad ↓ 23% en 14 días" : "Activity ↓ 23% in 14 days",
                tone: "warn",
                owner: "CO",
              },
              {
                title: isEs ? "Aprobar estrategia de pricing premium" : "Approve premium pricing strategy",
                sub: isEs ? "Quantro Revenue · Rock Q2" : "Quantro Revenue · Q2 Rock",
                tone: "info",
                owner: "MP",
              },
              {
                title: isEs ? "Revisar forecast Q2" : "Review Q2 forecast",
                sub: isEs ? "Margen por debajo de objetivo" : "Margin below target",
                tone: "warn",
                owner: "CO",
              },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{ background: "rgba(148, 163, 184, 0.03)", border: `1px solid ${BORDER}` }}
              >
                <StatusDot tone={row.tone} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-white font-medium truncate">{row.title}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{row.sub}</div>
                </div>
                <Avatar initials={row.owner} size={20} />
                <MoreHorizontal size={12} className="text-slate-600 flex-shrink-0" />
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue · Quantro Revenue */}
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={12} className="text-[#C084FC]" />
            <span className="text-[11px] font-medium text-white">Revenue</span>
            <span className="text-[9px] text-slate-600">·</span>
            <span className="text-[10px] text-[#C084FC]">Quantro Revenue</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">MTD</div>
              <div className="font-satoshi font-bold text-lg text-white tabular-nums">$847K</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">{isEs ? "Cash at Risk" : "Cash at Risk"}</div>
              <div className="font-satoshi font-bold text-lg text-amber-400 tabular-nums">$1,399</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
            {[
              { t: isEs ? "Subir pricing en Quad 4" : "Raise pricing on Quad 4", imp: "+$28K/mo" },
              { t: isEs ? "Eliminar descuentos clientes B" : "Remove discounts for B clients", imp: "+$14K/mo" },
              { t: isEs ? "Implementar orden mínima" : "Implement minimum order", imp: "+$9K/mo" },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <span className="w-1 h-1 rounded-full bg-[#C084FC]" />
                <span className="text-slate-300 flex-1 truncate">{row.t}</span>
                <span className="text-emerald-400 font-mono">{row.imp}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ============================================================
   View 2 — Scorecard
   ============================================================ */
const ScorecardView = ({ isEs }) => {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  const rows = [
    {
      name: isEs ? "Nuevos Leads" : "New Leads",
      owner: "MP",
      goal: "≥ 40",
      cells: ["ok", "ok", "ok", "warn", "ok", "ok", "ok", "ok"],
      trend: "up",
    },
    {
      name: isEs ? "Satisfacción del Cliente" : "Customer Satisfaction",
      owner: "LM",
      goal: "≥ 4.6",
      cells: ["ok", "ok", "ok", "ok", "warn", "warn", "bad", "warn"],
      trend: "down",
    },
    {
      name: "Revenue",
      owner: "CO",
      goal: "$820K",
      cells: ["ok", "ok", "warn", "ok", "ok", "ok", "ok", "ok"],
      trend: "up",
    },
    {
      name: isEs ? "Margen Bruto" : "Gross Margin",
      owner: "CO",
      goal: "≥ 65%",
      cells: ["ok", "ok", "ok", "ok", "warn", "ok", "ok", "warn"],
      trend: "up",
    },
    {
      name: "NPS",
      owner: "MP",
      goal: "≥ 60",
      cells: ["ok", "warn", "ok", "ok", "ok", "ok", "ok", "ok"],
      trend: "up",
    },
    {
      name: isEs ? "Churn" : "Churn",
      owner: "DR",
      goal: "≤ 2%",
      cells: ["ok", "ok", "ok", "warn", "ok", "ok", "warn", "bad"],
      trend: "down",
    },
  ];

  const cellColor = (t) =>
    t === "ok"
      ? { bg: "rgba(52, 211, 153, 0.12)", c: "#34D399" }
      : t === "warn"
      ? { bg: "rgba(245, 158, 11, 0.14)", c: "#F59E0B" }
      : { bg: "rgba(239, 68, 68, 0.14)", c: "#EF4444" };

  return (
    <div className="p-6 space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: isEs ? "Todos los departamentos" : "All Departments", icon: ChevronDown },
          { label: isEs ? "Semanas" : "Weeks", icon: ChevronDown },
          { label: "2 wks", icon: ChevronDown },
        ].map((f, i) => (
          <button
            key={i}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-slate-300"
            style={{ background: "rgba(148, 163, 184, 0.04)", border: `1px solid ${BORDER}` }}
          >
            {f.label}
            <f.icon size={10} />
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-slate-300"
            style={{ background: "rgba(148, 163, 184, 0.04)", border: `1px solid ${BORDER}` }}
          >
            CSV
          </button>
          <button
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-slate-300"
            style={{ background: "rgba(148, 163, 184, 0.04)", border: `1px solid ${BORDER}` }}
          >
            Excel
          </button>
          <button
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
            style={{
              background: "linear-gradient(90deg, rgba(0,245,255,0.16), rgba(34,211,238,0.08))",
              border: "1px solid rgba(0, 245, 255, 0.3)",
              color: ACCENT,
            }}
          >
            <Plus size={10} />
            {isEs ? "Agregar métrica" : "Add Metric"}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label={isEs ? "Métricas activas" : "Active Metrics"} value="24" />
        <KpiCard label="On Track" value="18" delta="75%" tone="ok" />
        <KpiCard label="At Risk" value="4" delta="17%" tone="warn" />
        <KpiCard label="Off Track" value="2" delta="8%" tone="bad" />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div
          className="grid items-center px-4 py-2 text-[9px] uppercase tracking-wider text-slate-600 font-semibold"
          style={{
            gridTemplateColumns: "minmax(140px, 1.4fr) 44px 60px repeat(8, minmax(28px, 1fr)) 40px",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div>{isEs ? "Measurable" : "Measurable"}</div>
          <div>Owner</div>
          <div>Goal</div>
          {weeks.map((w) => (
            <div key={w} className="text-center">
              {w}
            </div>
          ))}
          <div className="text-center">Trend</div>
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid items-center px-4 py-2.5 text-[11px] hover:bg-white/[0.015] transition-colors"
            style={{
              gridTemplateColumns: "minmax(140px, 1.4fr) 44px 60px repeat(8, minmax(28px, 1fr)) 40px",
              borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : "none",
            }}
          >
            <div className="text-white font-medium truncate pr-2">{row.name}</div>
            <div>
              <Avatar initials={row.owner} size={18} />
            </div>
            <div className="text-slate-400 tabular-nums">{row.goal}</div>
            {row.cells.map((tone, j) => {
              const s = cellColor(tone);
              return (
                <div key={j} className="px-0.5">
                  <div
                    className="h-5 rounded flex items-center justify-center text-[9px] font-semibold tabular-nums"
                    style={{ background: s.bg, color: s.c }}
                  >
                    {tone === "ok" ? "✓" : tone === "warn" ? "·" : "×"}
                  </div>
                </div>
              );
            })}
            <div className="flex justify-center">
              {row.trend === "up" ? (
                <TrendingUp size={12} className="text-emerald-400" />
              ) : (
                <TrendingDown size={12} className="text-red-400" />
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ============================================================
   View 3 — Rocks
   ============================================================ */
const RocksView = ({ isEs }) => {
  const rocks = [
    {
      title: isEs ? "Expandir pipeline comercial" : "Expand sales pipeline",
      owner: "MP",
      owner_name: "Mariana P.",
      progress: 75,
      status: "ok",
      label: "On Track",
      due: "Q2 · W10",
    },
    {
      title: isEs ? "Implementar pricing premium Q3" : "Implement Q3 premium pricing",
      owner: "CO",
      owner_name: "Carlos O.",
      progress: 45,
      status: "warn",
      label: "At Risk",
      due: "Q2 · W11",
    },
    {
      title: isEs ? "Mejorar satisfacción del cliente" : "Improve customer satisfaction",
      owner: "LM",
      owner_name: "Laura M.",
      progress: 85,
      status: "ok",
      label: "On Track",
      due: "Q2 · W10",
    },
    {
      title: isEs ? "Reducir cash at risk" : "Reduce cash at risk",
      owner: "DR",
      owner_name: "Diego R.",
      progress: 30,
      status: "bad",
      label: "Off Track",
      due: "Q2 · W9",
    },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label={isEs ? "Rocks activos" : "Active Rocks"} value="4" />
        <KpiCard label={isEs ? "Progreso trimestre" : "Quarter progress"} value="59%" delta="+8%" tone="ok" />
        <KpiCard label="On Track" value="2" tone="ok" delta="50%" />
        <KpiCard label="At Risk / Off" value="2" tone="warn" delta="50%" />
      </div>

      {/* Rocks grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {rocks.map((r, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Avatar initials={r.owner} size={22} />
                <div className="leading-none">
                  <div className="text-[10px] text-slate-500">{r.owner_name}</div>
                  <div className="text-[9px] text-slate-600 tracking-wider uppercase mt-0.5">
                    {r.due}
                  </div>
                </div>
              </div>
              <Pill tone={r.status}>
                <StatusDot tone={r.status} /> {r.label}
              </Pill>
            </div>
            <div className="text-[13px] font-medium text-white leading-tight mb-3">
              {r.title}
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(148, 163, 184, 0.1)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      r.status === "ok"
                        ? "linear-gradient(90deg, #34D399, #10B981)"
                        : r.status === "warn"
                        ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                        : "linear-gradient(90deg, #EF4444, #F87171)",
                  }}
                />
              </div>
              <div className="text-[11px] font-mono font-semibold text-white tabular-nums w-10 text-right">
                {r.progress}%
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   View 4 — Issues
   ============================================================ */
const IssuesView = ({ isEs }) => {
  const issues = [
    {
      title: isEs ? "3 facturas sin seguimiento" : "3 unfollowed invoices",
      sev: "bad",
      sev_label: isEs ? "Alta" : "High",
      owner: "LM",
      date: isEs ? "hace 2d" : "2d ago",
      status: "open",
      status_label: isEs ? "Abierto" : "Open",
    },
    {
      title: isEs ? "Leads fuera de meta" : "Leads off-target",
      sev: "warn",
      sev_label: isEs ? "Media" : "Medium",
      owner: "CO",
      date: isEs ? "hace 5d" : "5d ago",
      status: "progress",
      status_label: isEs ? "En progreso" : "In progress",
    },
    {
      title: isEs ? "Caída de satisfacción del cliente" : "Customer satisfaction drop",
      sev: "bad",
      sev_label: isEs ? "Alta" : "High",
      owner: "MP",
      date: isEs ? "hoy" : "today",
      status: "open",
      status_label: isEs ? "Abierto" : "Open",
    },
    {
      title: isEs ? "Retraso en onboarding" : "Onboarding delay",
      sev: "warn",
      sev_label: isEs ? "Media" : "Medium",
      owner: "DR",
      date: isEs ? "hace 1d" : "1d ago",
      status: "open",
      status_label: isEs ? "Abierto" : "Open",
    },
    {
      title: isEs ? "Margen por debajo en Quad 4" : "Margin below on Quad 4",
      sev: "warn",
      sev_label: isEs ? "Media" : "Medium",
      owner: "CO",
      date: isEs ? "hace 3d" : "3d ago",
      status: "progress",
      status_label: isEs ? "En progreso" : "In progress",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label={isEs ? "Abiertos" : "Open"} value="4" tone="bad" />
        <KpiCard label={isEs ? "En progreso" : "In progress"} value="2" tone="warn" />
        <KpiCard label={isEs ? "Resueltos (30d)" : "Resolved (30d)"} value="18" tone="ok" delta="+5" />
        <KpiCard label={isEs ? "Tiempo prom. resolución" : "Avg. resolution time"} value="2.4d" tone="ok" />
      </div>

      <Card className="overflow-hidden">
        <div
          className="grid items-center px-4 py-2 text-[9px] uppercase tracking-wider text-slate-600 font-semibold"
          style={{
            gridTemplateColumns: "minmax(200px, 2fr) 90px 40px 70px 110px 24px",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div>{isEs ? "Problema" : "Issue"}</div>
          <div>{isEs ? "Severidad" : "Severity"}</div>
          <div>Owner</div>
          <div>{isEs ? "Fecha" : "Date"}</div>
          <div>{isEs ? "Estado" : "Status"}</div>
          <div></div>
        </div>
        {issues.map((row, i) => (
          <div
            key={i}
            className="grid items-center px-4 py-2.5 text-[11px] hover:bg-white/[0.015]"
            style={{
              gridTemplateColumns: "minmax(200px, 2fr) 90px 40px 70px 110px 24px",
              borderBottom: i < issues.length - 1 ? `1px solid ${BORDER}` : "none",
            }}
          >
            <div className="flex items-center gap-2 text-white font-medium min-w-0">
              <StatusDot tone={row.sev} />
              <span className="truncate">{row.title}</span>
            </div>
            <div>
              <Pill tone={row.sev}>{row.sev_label}</Pill>
            </div>
            <div>
              <Avatar initials={row.owner} size={18} />
            </div>
            <div className="text-slate-500">{row.date}</div>
            <div>
              <Pill tone={row.status === "open" ? "bad" : "warn"}>{row.status_label}</Pill>
            </div>
            <div className="text-slate-600">
              <MoreHorizontal size={12} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ============================================================
   View 5 — To-Dos
   ============================================================ */
const TodosView = ({ isEs }) => {
  const todos = [
    {
      task: isEs ? "Revisar leads nuevos" : "Review new leads",
      done: false,
      owner: "CO",
      due: isEs ? "Hoy" : "Today",
      priority: "bad",
      p_label: isEs ? "Alta" : "High",
    },
    {
      task: isEs ? "Aprobar estrategia de pricing" : "Approve pricing strategy",
      done: false,
      owner: "MP",
      due: isEs ? "Mañana" : "Tomorrow",
      priority: "bad",
      p_label: isEs ? "Alta" : "High",
    },
    {
      task: isEs ? "Dar seguimiento a clientes B" : "Follow up with B clients",
      done: true,
      owner: "DR",
      due: isEs ? "Ayer" : "Yesterday",
      priority: "warn",
      p_label: isEs ? "Media" : "Medium",
    },
    {
      task: isEs ? "Actualizar SOP de onboarding" : "Update onboarding SOP",
      done: false,
      owner: "LM",
      due: isEs ? "Esta semana" : "This week",
      priority: "warn",
      p_label: isEs ? "Media" : "Medium",
    },
    {
      task: isEs ? "Agendar 1:1 con equipo de ventas" : "Schedule 1:1 with sales team",
      done: false,
      owner: "CO",
      due: isEs ? "Jueves" : "Thursday",
      priority: "muted",
      p_label: isEs ? "Baja" : "Low",
    },
    {
      task: isEs ? "Revisar contrato Grupo Nexo" : "Review Grupo Nexo contract",
      done: true,
      owner: "MP",
      due: isEs ? "Ayer" : "Yesterday",
      priority: "warn",
      p_label: isEs ? "Media" : "Medium",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label={isEs ? "Pendientes" : "Pending"} value="4" />
        <KpiCard label={isEs ? "Completadas hoy" : "Done today"} value="2" tone="ok" delta="+2" />
        <KpiCard label={isEs ? "Vencidas" : "Overdue"} value="1" tone="bad" />
        <KpiCard label={isEs ? "Tasa de ejecución" : "Execution rate"} value="87%" tone="ok" delta="+4%" />
      </div>

      <Card className="overflow-hidden">
        {todos.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.015] transition-colors"
            style={{
              borderBottom: i < todos.length - 1 ? `1px solid ${BORDER}` : "none",
            }}
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
              style={{
                background: t.done ? ACCENT : "transparent",
                border: `1px solid ${t.done ? ACCENT : "rgba(148,163,184,0.3)"}`,
              }}
            >
              {t.done && (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5 L4 7 L8 3"
                    stroke="#0A0F1C"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`text-[12px] font-medium truncate ${
                  t.done ? "text-slate-500 line-through" : "text-white"
                }`}
              >
                {t.task}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock size={9} className="text-slate-600" />
                <span className="text-[10px] text-slate-500">{t.due}</span>
              </div>
            </div>
            <Pill tone={t.priority}>{t.p_label}</Pill>
            <Avatar initials={t.owner} size={20} />
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ============================================================
   View 6 — Agentes IA
   ============================================================ */
const AgentsView = ({ isEs }) => {
  const agents = [
    {
      name: "Executive Monitor",
      tone: "#00F5FF",
      status: "active",
      status_label: "active",
      detected: isEs
        ? "Riesgo de margen en Q2 por debajo del forecast."
        : "Q2 margin risk below forecast.",
      suggestion: isEs
        ? "Ajustar pricing en Quad 4 esta semana."
        : "Adjust Quad 4 pricing this week.",
      next: isEs ? "Generar plan de pricing" : "Generate pricing plan",
    },
    {
      name: "Risk Monitor",
      tone: "#F59E0B",
      status: "monitoring",
      status_label: "monitoring",
      detected: isEs
        ? "$1,399 en CxC vencido · 3 clientes."
        : "$1,399 overdue AR · 3 clients.",
      suggestion: isEs
        ? "Enviar recordatorios y escalar al 5to día."
        : "Send reminders and escalate on day 5.",
      next: isEs ? "Disparar secuencia de cobranza" : "Trigger collection sequence",
    },
    {
      name: "CFO Quantro",
      tone: "#C084FC",
      status: "recommending",
      status_label: "recommending",
      detected: isEs
        ? "Cash runway 14 meses. Burn estable."
        : "Cash runway 14 months. Burn stable.",
      suggestion: isEs
        ? "Abrir línea de crédito preventiva $200K."
        : "Open preventive $200K credit line.",
      next: isEs ? "Preparar caso para banco" : "Prepare bank case",
    },
    {
      name: "Operations Architect",
      tone: "#34D399",
      status: "active",
      status_label: "active",
      detected: isEs
        ? "Onboarding con retraso promedio de 2.4 días."
        : "Onboarding avg. delay 2.4 days.",
      suggestion: isEs
        ? "Rediseñar SOP y automatizar paso 3."
        : "Redesign SOP and automate step 3.",
      next: isEs ? "Crear borrador de SOP" : "Draft new SOP",
    },
    {
      name: isEs ? "Coach de Ventas" : "Sales Coach",
      tone: "#00F5FF",
      status: "recommending",
      status_label: "recommending",
      detected: isEs
        ? "Cierre < 22% en segmento mid-market."
        : "Close rate < 22% in mid-market.",
      suggestion: isEs
        ? "Entrenar objeciones de precio · 3 sesiones."
        : "Train price objections · 3 sessions.",
      next: isEs ? "Agendar training" : "Schedule training",
    },
    {
      name: "Data Analyst",
      tone: "#C084FC",
      status: "monitoring",
      status_label: "monitoring",
      detected: isEs
        ? "Cliente top con actividad ↓ 23% en 14d."
        : "Top client activity ↓ 23% in 14d.",
      suggestion: isEs
        ? "Programar llamada ejecutiva esta semana."
        : "Schedule executive call this week.",
      next: isEs ? "Agendar llamada" : "Schedule call",
    },
  ];

  const statusTone = (s) => (s === "active" ? "ok" : s === "recommending" ? "info" : "warn");

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label={isEs ? "Agentes activos" : "Active agents"} value="6" tone="ok" />
        <KpiCard label={isEs ? "Detecciones hoy" : "Detections today"} value="12" delta="+4" tone="ok" />
        <KpiCard label={isEs ? "Recomendaciones" : "Recommendations"} value="5" tone="info" />
        <KpiCard label={isEs ? "Ejecutadas auto" : "Auto-executed"} value="8" tone="ok" delta="66%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {agents.map((a, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${a.tone}22, ${a.tone}08)`,
                    border: `1px solid ${a.tone}40`,
                  }}
                >
                  <Bot size={14} style={{ color: a.tone }} />
                </div>
                <div className="leading-none">
                  <div className="text-[12px] font-medium text-white">{a.name}</div>
                  <div className="text-[9px] text-slate-500 tracking-wider uppercase mt-1">
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="inline-flex items-center gap-1"
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{
                          backgroundColor:
                            a.status === "active"
                              ? "#34D399"
                              : a.status === "recommending"
                              ? "#00F5FF"
                              : "#F59E0B",
                        }}
                      />
                      {a.status_label}
                    </motion.span>
                  </div>
                </div>
              </div>
              <Pill tone={statusTone(a.status)}>{a.status_label}</Pill>
            </div>

            <div className="space-y-2">
              <div>
                <div className="text-[9px] text-slate-600 tracking-wider uppercase mb-0.5">
                  {isEs ? "Detectó" : "Detected"}
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">{a.detected}</div>
              </div>
              <div
                className="pt-2"
                style={{ borderTop: `1px solid ${BORDER}` }}
              >
                <div className="text-[9px] text-slate-600 tracking-wider uppercase mb-0.5">
                  {isEs ? "Sugerencia" : "Suggestion"}
                </div>
                <div className="text-[11px] text-white leading-snug">{a.suggestion}</div>
              </div>
              <button
                className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
                style={{
                  background: `${a.tone}14`,
                  border: `1px solid ${a.tone}30`,
                  color: a.tone,
                }}
              >
                <Zap size={10} />
                {a.next}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   View 7 — Quantro Revenue
   ============================================================ */
const RevenueView = ({ isEs }) => {
  const decisions = [
    {
      title: isEs ? "Quad 4 destruye margen" : "Quad 4 destroys margin",
      detail: isEs
        ? "Clientes en Quad 4 bajan margen consolidado 6 pp."
        : "Quad 4 clients drag consolidated margin 6 pp.",
      impact: "-$18K/mo",
      tone: "bad",
      action: isEs ? "Revisar" : "Review",
    },
    {
      title: isEs ? "Cirugía Q2: subir pricing" : "Q2 surgery: raise pricing",
      detail: isEs
        ? "Escalón +4% en Starter y Pro. Sin churn proyectado."
        : "+4% step in Starter and Pro. No projected churn.",
      impact: "+$28K/mo",
      tone: "ok",
      action: isEs ? "Aprobar" : "Approve",
    },
    {
      title: isEs ? "Eliminar descuentos a clientes B" : "Remove discounts for B clients",
      detail: isEs
        ? "12 cuentas con descuentos heredados sin justificación."
        : "12 accounts with legacy unjustified discounts.",
      impact: "+$14K/mo",
      tone: "ok",
      action: isEs ? "Aplicar" : "Apply",
    },
    {
      title: isEs ? "Implementar orden mínima" : "Implement minimum order",
      detail: isEs
        ? "$800 MOQ en líneas de bajo margen."
        : "$800 MOQ on low-margin lines.",
      impact: "+$9K/mo",
      tone: "ok",
      action: isEs ? "Publicar" : "Ship",
    },
  ];

  const quads = [
    { q: "Q1", label: isEs ? "Alto valor · Alto margen" : "High value · High margin", share: "38%", tone: "ok" },
    { q: "Q2", label: isEs ? "Alto valor · Bajo margen" : "High value · Low margin", share: "22%", tone: "warn" },
    { q: "Q3", label: isEs ? "Bajo valor · Alto margen" : "Low value · High margin", share: "28%", tone: "info" },
    { q: "Q4", label: isEs ? "Bajo valor · Bajo margen" : "Low value · Low margin", share: "12%", tone: "bad" },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(192,132,252,0.18), rgba(0,245,255,0.06))",
            border: "1px solid rgba(192,132,252,0.35)",
          }}
        >
          <DollarSign size={18} className="text-[#C084FC]" />
        </div>
        <div>
          <div className="font-satoshi font-semibold text-base text-white leading-tight">
            Quantro Revenue
          </div>
          <div className="text-[11px] text-[#C084FC]">
            Decision Engine · Revenue Intelligence
          </div>
        </div>
        <div className="ml-auto">
          <Pill tone="violet">
            <Sparkles size={10} /> {isEs ? "Decisiones listas" : "Decisions ready"}
          </Pill>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Revenue MTD" value="$847K" delta="+12%" tone="ok" />
        <KpiCard label={isEs ? "Margen Bruto" : "Gross Margin"} value="67%" delta="+2.1 pp" tone="ok" />
        <KpiCard label="Cash at Risk" value="$1,399" delta={isEs ? "3 cuentas" : "3 accounts"} tone="warn" />
        <KpiCard label="OKR Completion" value="72%" delta="+5%" tone="ok" />
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Revenue Decisions */}
        <Card className="p-4 lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-[#C084FC]" />
            <span className="text-[11px] font-medium text-white">
              {isEs ? "Revenue Decisions" : "Revenue Decisions"}
            </span>
            <span className="text-[9px] text-slate-600">·</span>
            <span className="text-[10px] text-slate-500">
              {isEs ? "workflow de aprobación" : "approval workflow"}
            </span>
          </div>
          <div className="space-y-2">
            {decisions.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: "rgba(148,163,184,0.03)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <StatusDot tone={d.tone} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] text-white font-medium truncate">{d.title}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{d.detail}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-[11px] font-mono font-semibold tabular-nums ${
                      d.tone === "ok" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {d.impact}
                  </div>
                </div>
                <button
                  className="px-2.5 py-1 rounded-md text-[10px] font-medium"
                  style={{
                    background: "linear-gradient(90deg, rgba(192,132,252,0.22), rgba(192,132,252,0.08))",
                    border: "1px solid rgba(192,132,252,0.4)",
                    color: "#C084FC",
                  }}
                >
                  {d.action}
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Quintile / Quadrant analysis */}
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={12} className="text-slate-500" />
            <span className="text-[11px] font-medium text-white">
              {isEs ? "Análisis por cuadrante" : "Quadrant analysis"}
            </span>
          </div>
          <div className="space-y-2">
            {quads.map((q, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{
                  background: "rgba(148,163,184,0.03)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background:
                      q.tone === "ok"
                        ? "rgba(52,211,153,0.14)"
                        : q.tone === "warn"
                        ? "rgba(245,158,11,0.14)"
                        : q.tone === "info"
                        ? "rgba(0,245,255,0.12)"
                        : "rgba(239,68,68,0.14)",
                    color:
                      q.tone === "ok"
                        ? "#34D399"
                        : q.tone === "warn"
                        ? "#F59E0B"
                        : q.tone === "info"
                        ? "#00F5FF"
                        : "#EF4444",
                  }}
                >
                  {q.q}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] text-slate-300 truncate">{q.label}</div>
                </div>
                <div className="text-[11px] font-mono font-semibold text-white tabular-nums">
                  {q.share}
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-3 p-2.5 rounded-lg text-[10px] text-slate-400 leading-snug"
            style={{
              background: "rgba(239, 68, 68, 0.04)",
              border: "1px solid rgba(239, 68, 68, 0.18)",
            }}
          >
            <span className="text-red-400 font-medium">Q4: </span>
            {isEs
              ? "12% de clientes consume 34% de recursos. Simplificar portafolio."
              : "12% of clients consume 34% of resources. Simplify portfolio."}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ============================================================
   Main Section
   ============================================================ */

const VIEWS = {
  dashboard: DashboardView,
  scorecard: ScorecardView,
  rocks: RocksView,
  issues: IssuesView,
  todos: TodosView,
  agents: AgentsView,
  revenue: RevenueView,
};

const TABS = (isEs) => [
  { key: "dashboard", label: "Dashboard" },
  { key: "scorecard", label: "Scorecard" },
  { key: "rocks", label: "Rocks" },
  { key: "issues", label: "Issues" },
  { key: "todos", label: "To-Dos" },
  { key: "agents", label: isEs ? "Agentes IA" : "AI Agents" },
  { key: "revenue", label: "Quantro Revenue" },
];

export const InteractiveDemoSection = () => {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [view, setView] = useState("dashboard");
  const tabs = useMemo(() => TABS(isEs), [isEs]);

  // Onboarding hint — appears ~7s after landing on the Dashboard view
  // (once per session) if the user hasn't explored other modules yet.
  const [showHint, setShowHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("quantro_demo_hint") === "dismissed";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (hintDismissed) return;
    if (view !== "dashboard") return;
    const id = setTimeout(() => setShowHint(true), 7000);
    return () => clearTimeout(id);
  }, [view, hintDismissed]);

  const dismissHint = () => {
    setShowHint(false);
    setHintDismissed(true);
    try {
      sessionStorage.setItem("quantro_demo_hint", "dismissed");
    } catch {
      /* storage may be unavailable */
    }
  };

  const handleTabClick = (key) => {
    if (showHint || !hintDismissed) dismissHint();
    setView(key);
  };

  const CurrentView = VIEWS[view] || DashboardView;

  return (
    <AnimatedSection
      id="interactive-demo"
      className="py-28 px-4 sm:px-6 relative overflow-hidden"
      data-testid="interactive-demo-section"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0, 245, 255, 0.04) 0%, transparent 55%), #030712",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[480px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0, 245, 255, 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header — bridges to AmanecerSection */}
        <motion.div variants={fadeInUp} className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/25 bg-[#00F5FF]/[0.05] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]" />
            <span className="text-[10px] font-medium text-[#00F5FF] tracking-[0.18em] uppercase">
              {isEs ? "Una pantalla · Un sistema" : "One screen · One system"}
            </span>
          </div>
          <h2 className="font-satoshi font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight">
            {isEs ? "Así se ve tu empresa" : "This is what your company"}
            <br />
            <span className="bg-gradient-to-r from-[#00F5FF] via-[#22D3EE] to-[#A020FF] bg-clip-text text-transparent">
              {isEs ? "funcionando en Quantro." : "looks like on Quantro."}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mt-5 max-w-2xl mx-auto">
            {isEs
              ? "El mismo sistema que hace posible cada amanecer ejecutivo. Operación, inteligencia y ejecución en un solo lugar."
              : "The same system behind every executive morning. Operation, intelligence and execution in one place."}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-2 mb-6"
          role="tablist"
          data-testid="demo-tabs"
        >
          {tabs.map((tab) => {
            const active = view === tab.key;
            const isAgents = tab.key === "agents";
            const button = (
              <button
                key={tab.key}
                role="tab"
                aria-selected={active}
                onClick={() => handleTabClick(tab.key)}
                data-testid={`demo-tab-${tab.key}`}
                className={`relative px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  active
                    ? "text-[#0A0F1C]"
                    : "text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="demo-tab-pill"
                    transition={{ type: "spring", duration: 0.45, bounce: 0.18 }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #00F5FF, #22D3EE)",
                      boxShadow: "0 0 22px -6px rgba(0, 245, 255, 0.6)",
                    }}
                  />
                )}
                <span className="relative">{tab.label}</span>
                {/* Pulse ring drawing attention to Agentes IA while hint is showing */}
                {isAgents && showHint && !active && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: "1px solid rgba(0, 245, 255, 0.55)" }}
                    animate={{ scale: [1, 1.14, 1], opacity: [0.9, 0.2, 0.9] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </button>
            );

            if (!isAgents) return button;

            return (
              <div key={tab.key} className="relative">
                {button}
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.95 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 z-40"
                      style={{ top: "calc(100% + 14px)" }}
                      data-testid="demo-hint-tooltip"
                    >
                      {/* Caret */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rotate-45"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0, 245, 255, 0.95), rgba(34, 211, 238, 0.9))",
                          boxShadow: "0 0 12px -2px rgba(0, 245, 255, 0.6)",
                        }}
                      />
                      {/* Bubble */}
                      <div
                        className="relative rounded-xl px-4 py-2.5"
                        style={{
                          width: 300,
                          background:
                            "linear-gradient(135deg, rgba(0, 245, 255, 0.97), rgba(34, 211, 238, 0.92))",
                          boxShadow:
                            "0 12px 40px -10px rgba(0, 245, 255, 0.55), 0 0 0 1px rgba(0, 245, 255, 0.35)",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissHint();
                          }}
                          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[#0A0F1C] hover:bg-[#0A0F1C]/15 transition-colors"
                          aria-label={isEs ? "Cerrar" : "Dismiss"}
                          data-testid="demo-hint-dismiss"
                        >
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path
                              d="M1 1 L7 7 M7 1 L1 7"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <div className="flex items-start gap-2 pr-4">
                          <Sparkles size={13} className="text-[#0A0F1C] flex-shrink-0 mt-[2px]" />
                          <p className="text-[12px] font-semibold text-[#0A0F1C] leading-snug m-0">
                            {isEs
                              ? "Haz clic aquí para ver cómo Quantro piensa por ti"
                              : "Click here to see how Quantro thinks for you"}{" "}
                            <motion.span
                              className="inline-block text-[#0A0F1C] font-bold"
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                              aria-hidden
                            >
                              ↑
                            </motion.span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Window */}
        <motion.div
          variants={fadeInUp}
          className="relative mx-auto rounded-2xl overflow-hidden"
          style={{
            maxWidth: 1200,
            background: BG,
            border: `1px solid ${BORDER_STRONG}`,
            boxShadow:
              "0 40px 80px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 245, 255, 0.05), 0 0 80px -10px rgba(0, 245, 255, 0.12)",
          }}
          data-testid="demo-window"
        >
          {/* macOS-style traffic lights */}
          <div
            className="flex items-center gap-1.5 px-4 py-2.5"
            style={{
              borderBottom: `1px solid ${BORDER}`,
              background: "rgba(5, 10, 24, 0.7)",
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="flex-1 flex justify-center">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] text-slate-500"
                style={{ background: "rgba(148, 163, 184, 0.06)" }}
              >
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                app.quantroos.com
              </div>
            </div>
            <span className="text-[9px] text-slate-600 tabular-nums hidden sm:inline">
              v 2.6 · synced
            </span>
          </div>

          <div className="flex" style={{ minHeight: 620 }}>
            <Sidebar current={view} onNavigate={handleTabClick} isEs={isEs} />

            <div className="flex-1 flex flex-col min-w-0" style={{ background: PANEL }}>
              <Topbar current={view} isEs={isEs} />
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    data-testid={`demo-view-${view}`}
                  >
                    <CurrentView isEs={isEs} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center text-[13px] text-slate-500 mt-8 max-w-xl mx-auto"
        >
          {isEs
            ? "Explora cada módulo. Esto es exactamente lo que ves dentro de Quantro."
            : "Explore each module. This is exactly what you see inside Quantro."}
        </motion.p>
      </div>
    </AnimatedSection>
  );
};

export default InteractiveDemoSection;
