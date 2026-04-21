// Demo Data for Quantro Morning Demo
// Easy to connect to real API later

export const demoStates = {
  initial: {
    revenue: -384,
    risk: "high",
    riskColor: "red",
    message: {
      es: "Tu negocio está perdiendo dinero y esto es lo que debes hacer hoy.",
      en: "Your business is losing money and this is what you need to do today."
    },
    alertTitle: {
      es: "Riesgo financiero detectado",
      en: "Financial risk detected"
    },
    priorities: [
      {
        id: 1,
        type: "urgent",
        title: { es: "Estás perdiendo dinero", en: "You're losing money" },
        detail: { es: "Ingreso neto:", en: "Net income:" },
        value: "-$384",
        expanded: false
      },
      {
        id: 2,
        type: "attention",
        title: { es: "3 problemas sin resolver", en: "3 unresolved issues" },
        detail: { es: "Requiere atención inmediata", en: "Requires immediate attention" },
        value: null,
        expanded: false
      },
      {
        id: 3,
        type: "goal",
        title: { es: "Leads fuera de meta", en: "Leads off target" },
        detail: { es: "Actual: 50 · Meta: 100", en: "Current: 50 · Goal: 100" },
        value: null,
        expanded: false
      }
    ],
    suggestions: [
      { id: 1, text: { es: "Procesar nuevos leads", en: "Process new leads" }, executed: false },
      { id: 2, text: { es: "Enviar seguimiento automático", en: "Send automatic follow-up" }, executed: false },
      { id: 3, text: { es: "Reasignar oportunidades", en: "Reassign opportunities" }, executed: false },
      { id: 4, text: { es: "Agendar reunión clave", en: "Schedule key meeting" }, executed: false }
    ]
  },
  
  afterCostReduction: {
    revenue: -120,
    risk: "medium",
    riskColor: "amber",
    message: {
      es: "Plan de reducción activado. Los gastos están siendo optimizados.",
      en: "Cost reduction plan activated. Expenses are being optimized."
    },
    alertTitle: {
      es: "Plan de ahorro en proceso",
      en: "Savings plan in progress"
    },
    priorities: [
      {
        id: 1,
        type: "progress",
        title: { es: "Gastos optimizándose", en: "Expenses optimizing" },
        detail: { es: "Ingreso neto:", en: "Net income:" },
        value: "-$120",
        expanded: false
      },
      {
        id: 2,
        type: "attention",
        title: { es: "2 problemas sin resolver", en: "2 unresolved issues" },
        detail: { es: "Mejorando...", en: "Improving..." },
        value: null,
        expanded: false
      },
      {
        id: 3,
        type: "goal",
        title: { es: "Leads en seguimiento", en: "Leads in follow-up" },
        detail: { es: "Actual: 65 · Meta: 100", en: "Current: 65 · Goal: 100" },
        value: null,
        expanded: false
      }
    ]
  },
  
  afterRevenueIncrease: {
    revenue: 240,
    risk: "low",
    riskColor: "emerald",
    message: {
      es: "Estrategia de ingresos activa. Las ventas están mejorando.",
      en: "Revenue strategy active. Sales are improving."
    },
    alertTitle: {
      es: "Crecimiento en proceso",
      en: "Growth in progress"
    },
    priorities: [
      {
        id: 1,
        type: "success",
        title: { es: "Ingresos creciendo", en: "Revenue growing" },
        detail: { es: "Ingreso neto:", en: "Net income:" },
        value: "+$240",
        expanded: false
      },
      {
        id: 2,
        type: "progress",
        title: { es: "1 problema pendiente", en: "1 pending issue" },
        detail: { es: "Casi resuelto", en: "Almost resolved" },
        value: null,
        expanded: false
      },
      {
        id: 3,
        type: "success",
        title: { es: "Leads en meta", en: "Leads on target" },
        detail: { es: "Actual: 102 · Meta: 100", en: "Current: 102 · Goal: 100" },
        value: null,
        expanded: false
      }
    ]
  },
  
  automated: {
    revenue: 520,
    risk: "optimal",
    riskColor: "cyan",
    message: {
      es: "Quantro Flow está ejecutando acciones automáticamente.",
      en: "Quantro Flow is executing actions automatically."
    },
    alertTitle: {
      es: "Sistema automatizado activo",
      en: "Automated system active"
    },
    priorities: [
      {
        id: 1,
        type: "automated",
        title: { es: "Flujo de caja positivo", en: "Positive cash flow" },
        detail: { es: "Ingreso neto:", en: "Net income:" },
        value: "+$520",
        expanded: false
      },
      {
        id: 2,
        type: "automated",
        title: { es: "Sin problemas activos", en: "No active issues" },
        detail: { es: "Todo bajo control", en: "Everything under control" },
        value: null,
        expanded: false
      },
      {
        id: 3,
        type: "automated",
        title: { es: "Leads superando meta", en: "Leads exceeding goal" },
        detail: { es: "Actual: 118 · Meta: 100", en: "Current: 118 · Goal: 100" },
        value: null,
        expanded: false
      }
    ]
  }
};

export const actionButtons = {
  reduceCosts: {
    es: "Reducir gastos ahora",
    en: "Reduce costs now"
  },
  increaseRevenue: {
    es: "Aumentar ingresos",
    en: "Increase revenue"
  }
};

export const flowMessage = {
  es: "Quantro Flow ya está ejecutando estas acciones por ti",
  en: "Quantro Flow is already executing these actions for you"
};
