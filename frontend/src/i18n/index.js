// Quantro i18n System
// Simple translation system for ES/EN

const translations = {
  es: {
    // Hero Section
    "hero.eyebrow": "Quantro OS · Powered by AOS",
    "hero.title": "Despierta con decisiones listas para actuar.",
    "hero.subtitle": "Quantro OS conecta tus datos, detecta oportunidades y te propone acciones claras — y con Quantro Flow, las ejecuta por ti.",
    "hero.cta.primary": "Empieza por $1 USD",
    "hero.cta.secondary": "Ver cómo funciona",
    
    // Navigation
    "nav.solution": "Solución",
    "nav.features": "Características",
    "nav.product": "Producto",
    "nav.pricing": "Precios",
    "nav.cta": "Comenzar prueba",
    
    // Transition Section
    "transition.title1": "Un sistema para entender tu negocio.",
    "transition.title2": "Otro para operarlo.",
    "transition.description": "Quantro OS analiza tu negocio, detecta oportunidades y propone acciones. Quantro Flow responde y da seguimiento automáticamente en tu operación diaria, liberando tu carga de trabajo.",
    "transition.cta.explore": "Explorar Quantro",
    "transition.cta.how": "Ver cómo funciona",
    
    // Product Comparison
    "product.os.name": "Quantro OS",
    "product.os.tagline": "Te da claridad",
    "product.os.feature1": "Entiende tu negocio",
    "product.os.feature2": "Detecta oportunidades",
    "product.os.feature3": "Propone acciones",
    "product.flow.name": "Quantro Flow",
    "product.flow.tagline": "Hace que todo avance",
    "product.flow.feature1": "Responde",
    "product.flow.feature2": "Organiza",
    "product.flow.feature3": "Da seguimiento",
    
    // Better Together
    "together.title": "Mejor juntos",
    "together.description": "Quantro OS te da claridad y dirección. Quantro Flow convierte esas decisiones en acciones reales dentro de tu operación diaria.",
    "together.benefit1.trigger": "Detectas oportunidades",
    "together.benefit1.result": "se ejecutan automáticamente",
    "together.benefit2.trigger": "Defines prioridades",
    "together.benefit2.result": "se convierten en seguimiento real",
    "together.benefit3.trigger": "Tomas decisiones",
    "together.benefit3.result": "impactan la operación sin fricción",
    
    // Intelligence Section
    "intelligence.label": "Quantro Intelligence",
    "intelligence.title": "Tu negocio sigue avanzando mientras duermes.",
    "intelligence.description": "Quantro Intelligence analiza tu mercado y te propone acciones listas para avanzar cada día.",
    "intelligence.feature1": "Tendencias actuales y futuras",
    "intelligence.feature2": "Dónde tienes oportunidad",
    "intelligence.feature3": "Qué priorizar primero",
    "intelligence.feature4": "Qué hacer a continuación",
    "intelligence.analysis": "Análisis de hoy",
    "intelligence.timeago": "hace 4 min",
    "intelligence.opportunity": "Oportunidad: El segmento Enterprise creció 23% este mes",
    "intelligence.action": "Acción: Enviar propuesta a 5 leads calificados",
    "intelligence.priority": "Prioridad: Cerrar renovación con cliente clave",
    
    // Morning Demo Section
    "morning.title": "Así amanece tu empresa con Quantro.",
    "morning.subtitle": "Despiertas con claridad: Quantro analiza tu negocio, detecta oportunidades y deja listo un plan para actuar.",
    "morning.live": "Live",
    "morning.priorities": "Prioridades de hoy",
    "morning.suggestions": "Sugerencias",
    "morning.netIncome": "Ingreso neto:",
    "morning.aiDetected": "IA detectó esto",
    "morning.reduceCosts": "Reducir gastos",
    "morning.increaseRevenue": "Aumentar ingresos",
    "morning.urgent": "URGENTE",
    "morning.attention": "ATENCIÓN",
    "morning.goal": "META",
    "morning.progress": "EN PROCESO",
    "morning.success": "COMPLETADO",
    "morning.automated": "AUTOMATIZADO",
    "morning.flowMessage": "Quantro Flow ya está ejecutando estas acciones por ti",
    "morning.executed": "Ejecutado",
    "morning.clickToExecute": "Click para ejecutar",
    
    // Success Stories
    "success.label": "Casos de éxito",
    "success.title": "Lo que ya están logrando nuestros clientes",
    "success.story1.metric": "+40%",
    "success.story1.metricLabel": "conversión",
    "success.story1.title": "De caos operativo a control total",
    "success.story1.quote": "Ahora cada lead tiene seguimiento automático y el equipo sabe qué hacer cada día.",
    "success.story2.metric": "4x",
    "success.story2.metricLabel": "más rápido",
    "success.story2.title": "Decisiones más rápidas, sin juntas eternas",
    "success.story2.quote": "Pasaron de analizar datos manualmente a recibir acciones claras cada mañana.",
    "success.story3.metric": "30%",
    "success.story3.metricLabel": "ahorro de tiempo",
    "success.story3.title": "Su operación sigue, incluso cuando no están",
    "success.story3.quote": "Por primera vez siento que mi empresa trabaja para mí, no al revés. Identifiqué que el 30% de mis proyectos consumían el 70% del tiempo y además no generaban utilidad.",
    
    // Pricing
    "pricing.label": "Precios",
    "pricing.title": "Invierte en resultados, no en herramientas.",
    "pricing.subtitle": "Precios simples y transparentes que escalan con tu negocio.",
    "pricing.popular": "Más popular",
    "pricing.billing.monthly": "Mensual",
    "pricing.billing.annual": "Anual",
    "pricing.billing.badge": "2 meses gratis",
    "pricing.perMonth": "/mes",
    "pricing.billedAnnually": "Facturado anualmente",
    "pricing.twoMonthsFree": "2 meses gratis",
    "pricing.starter.name": "Starter",
    "pricing.starter.description": "Para operadores individuales y equipos pequeños.",
    "pricing.starter.f1": "Scorecard",
    "pricing.starter.f2": "Rocks (prioridades de 90 días)",
    "pricing.starter.f3": "Seguimiento de issues",
    "pricing.starter.f4": "To-Dos",
    "pricing.starter.f5": "Integración contable completa",
    "pricing.pro.name": "Pro",
    "pricing.pro.description": "Para equipos en crecimiento.",
    "pricing.pro.descriptionAnnual": "Elegido por empresas en crecimiento.",
    "pricing.pro.f1": "Todo lo de Starter",
    "pricing.pro.f2": "Organigrama",
    "pricing.pro.f3": "Extractor de juntas con IA",
    "pricing.pro.f4": "Agentes de IA",
    "pricing.pro.f5": "Soporte prioritario",
    "pricing.enterprise.name": "Enterprise",
    "pricing.enterprise.description": "Para equipos y empresas en expansión.",
    "pricing.enterprise.descriptionAnnual": "Para equipos que operan con automatización avanzada.",
    "pricing.enterprise.f1": "Todo lo de Pro",
    "pricing.enterprise.f2": "Smart Yield",
    "pricing.enterprise.f3": "Análisis Lean",
    "pricing.enterprise.f4": "Multiusuario (5 asientos)",
    "pricing.enterprise.f5": "Success Manager dedicado",
    "pricing.cta.trial": "Empieza por $1 USD",
    "pricing.cta.sales": "Hablar con ventas",

    // Star Features
    "starfeatures.label": "Características estrella",
    "starfeatures.title": "Herramientas que impulsan decisiones reales.",
    "starfeatures.smart_yield.name": "Smart Yield",
    "starfeatures.smart_yield.tagline": "Descubre de dónde viene realmente tu dinero.",
    "starfeatures.smart_yield.description": "Quintile Matrix clasifica cada cliente y producto por ingresos y margen — mostrando exactamente cuáles hacer crecer, re-precificar o eliminar.",
    "starfeatures.quintile.name": "Quintile Matrix",
    "starfeatures.quintile.tagline": "Tu mapa de valor 5×5.",
    "starfeatures.quintile.description": "Un heatmap interactivo que revela dónde vive el 80% del valor de tu negocio — y dónde la complejidad está matando tus márgenes.",
    "starfeatures.dirty.name": "Dirty Dozen",
    "starfeatures.dirty.tagline": "12 tácticas. Un clic.",
    "starfeatures.dirty.description": "Aplica acciones de simplificación probadas — elimina productos de bajo margen, establece pedidos mínimos, deja de hacer descuentos a clientes B — directo a tu flujo.",
    "starfeatures.coach.name": "EMS Coach AI",
    "starfeatures.coach.tagline": "Tu consultor estratégico 24/7.",
    "starfeatures.coach.description": "Pregunta \"¿Qué debería eliminar este mes?\" o \"¿Cómo mejoro los márgenes del Cuadrante 2?\" — y recibe respuestas basadas en tus datos reales.",

    // Differentiation
    "diff.label": "Por qué Quantro",
    "diff.title": "No es otro dashboard más.",
    "diff.traditional": "BI Tradicional",
    "diff.point": "Soluciones puntuales",
    "diff.quantro": "Quantro OS",
    "diff.f1": "Agregación de datos",
    "diff.f2": "Analítica en tiempo real",
    "diff.f3": "Recomendaciones con IA",
    "diff.f4": "Modelado de escenarios",
    "diff.f5": "Soporte de decisiones",
    "diff.f6": "Aprendizaje continuo",

    // Payment flow
    "payment.processing": "Preparando checkout…",
    "payment.polling": "Verificando tu pago…",
    "payment.success.title": "¡Pago confirmado!",
    "payment.success.body": "Bienvenido a Quantro. Revisa tu email para los siguientes pasos.",
    "payment.cancel.title": "Pago cancelado",
    "payment.cancel.body": "No te cobramos nada. Puedes intentarlo cuando quieras.",
    "payment.error.title": "Algo falló",
    "payment.error.body": "No pudimos procesar el pago. Intenta de nuevo.",
    "payment.close": "Cerrar",

    // Social Proof
    "social.eyebrow": "En vivo",
    "social.text": "empresas ya se unieron a Quantro",
    "social.today": "hoy",
    
    // CTA Section
    "cta.title1": "Deja de analizar.",
    "cta.title2": "Empieza a ejecutar.",
    "cta.subtitle": "Únete a miles de empresas usando Quantro para ganar claridad y tomar mejores decisiones.",
    "cta.placeholder": "Ingresa tu email de trabajo",
    "cta.button": "Comenzar prueba gratis",
    "cta.success": "¡Estás en la lista!",
    "cta.successMessage": "Te contactaremos pronto con tu acceso de prueba gratuita.",
    
    // Footer
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.contact": "Contacto",
    "footer.rights": "Todos los derechos reservados."
  },
  
  en: {
    // Hero Section
    "hero.eyebrow": "Quantro OS · Powered by AOS",
    "hero.title": "Wake up with ready decisions to act.",
    "hero.subtitle": "Quantro OS connects your data, detects opportunities and proposes clear actions — and with Quantro Flow, executes them for you.",
    "hero.cta.primary": "Start for $1 USD",
    "hero.cta.secondary": "See how it works",
    
    // Navigation
    "nav.solution": "Solution",
    "nav.features": "Features",
    "nav.product": "Product",
    "nav.pricing": "Pricing",
    "nav.cta": "Start Free Trial",
    
    // Transition Section
    "transition.title1": "One system to understand your business.",
    "transition.title2": "Another to run it.",
    "transition.description": "Quantro OS analyzes your business, detects opportunities and proposes actions. Quantro Flow responds and follows up automatically in your daily operations, freeing up your workload.",
    "transition.cta.explore": "Explore Quantro",
    "transition.cta.how": "See how it works",
    
    // Product Comparison
    "product.os.name": "Quantro OS",
    "product.os.tagline": "Gives you clarity",
    "product.os.feature1": "Understands your business",
    "product.os.feature2": "Detects opportunities",
    "product.os.feature3": "Proposes actions",
    "product.flow.name": "Quantro Flow",
    "product.flow.tagline": "Makes everything move",
    "product.flow.feature1": "Responds",
    "product.flow.feature2": "Organizes",
    "product.flow.feature3": "Follows up",
    
    // Better Together
    "together.title": "Better together",
    "together.description": "Quantro OS gives you clarity and direction. Quantro Flow turns those decisions into real actions within your daily operations.",
    "together.benefit1.trigger": "You detect opportunities",
    "together.benefit1.result": "they execute automatically",
    "together.benefit2.trigger": "You define priorities",
    "together.benefit2.result": "they become real follow-up",
    "together.benefit3.trigger": "You make decisions",
    "together.benefit3.result": "they impact operations seamlessly",
    
    // Intelligence Section
    "intelligence.label": "Quantro Intelligence",
    "intelligence.title": "Your business keeps moving while you sleep.",
    "intelligence.description": "Quantro Intelligence analyzes your market and proposes actions ready to execute every day.",
    "intelligence.feature1": "Current and future trends",
    "intelligence.feature2": "Where you have opportunity",
    "intelligence.feature3": "What to prioritize first",
    "intelligence.feature4": "What to do next",
    "intelligence.analysis": "Today's analysis",
    "intelligence.timeago": "4 min ago",
    "intelligence.opportunity": "Opportunity: Enterprise segment grew 23% this month",
    "intelligence.action": "Action: Send proposal to 5 qualified leads",
    "intelligence.priority": "Priority: Close renewal with key client",
    
    // Morning Demo Section
    "morning.title": "This is how your business wakes up with Quantro.",
    "morning.subtitle": "You wake up with clarity: Quantro analyzes your business, detects opportunities and leaves a plan ready to act.",
    "morning.live": "Live",
    "morning.priorities": "Today's priorities",
    "morning.suggestions": "Suggestions",
    "morning.netIncome": "Net income:",
    "morning.aiDetected": "AI detected this",
    "morning.reduceCosts": "Reduce costs",
    "morning.increaseRevenue": "Increase revenue",
    "morning.urgent": "URGENT",
    "morning.attention": "ATTENTION",
    "morning.goal": "GOAL",
    "morning.progress": "IN PROGRESS",
    "morning.success": "COMPLETED",
    "morning.automated": "AUTOMATED",
    "morning.flowMessage": "Quantro Flow is already executing these actions for you",
    "morning.executed": "Executed",
    "morning.clickToExecute": "Click to execute",
    
    // Success Stories
    "success.label": "Success Stories",
    "success.title": "What our customers are already achieving",
    "success.story1.metric": "+40%",
    "success.story1.metricLabel": "conversion",
    "success.story1.title": "From operational chaos to total control",
    "success.story1.quote": "Now every lead has automatic follow-up and the team knows what to do every day.",
    "success.story2.metric": "4x",
    "success.story2.metricLabel": "faster",
    "success.story2.title": "Faster decisions, no endless meetings",
    "success.story2.quote": "They went from manually analyzing data to receiving clear actions every morning.",
    "success.story3.metric": "30%",
    "success.story3.metricLabel": "time saved",
    "success.story3.title": "Their operation continues, even when they're not there",
    "success.story3.quote": "For the first time I feel like my company works for me, not the other way around. I identified that 30% of my projects consumed 70% of time and also didn't generate profit.",
    
    // Pricing
    "pricing.label": "Pricing",
    "pricing.title": "Invest in outcomes, not tools.",
    "pricing.subtitle": "Simple, transparent pricing that scales with your business.",
    "pricing.popular": "Most Popular",
    "pricing.billing.monthly": "Monthly",
    "pricing.billing.annual": "Annual",
    "pricing.billing.badge": "2 months free",
    "pricing.perMonth": "/mo",
    "pricing.billedAnnually": "Billed annually",
    "pricing.twoMonthsFree": "2 months free",
    "pricing.starter.name": "Starter",
    "pricing.starter.description": "For solo operators and small teams.",
    "pricing.starter.f1": "Scorecard",
    "pricing.starter.f2": "Rocks (90-day priorities)",
    "pricing.starter.f3": "Issues Tracker",
    "pricing.starter.f4": "To-Dos",
    "pricing.starter.f5": "Full Accounting Integration",
    "pricing.pro.name": "Pro",
    "pricing.pro.description": "For growing teams.",
    "pricing.pro.descriptionAnnual": "Chosen by growing companies.",
    "pricing.pro.f1": "Everything in Starter",
    "pricing.pro.f2": "Org Chart",
    "pricing.pro.f3": "AI Meeting Extractor",
    "pricing.pro.f4": "AI Agents",
    "pricing.pro.f5": "Priority Support",
    "pricing.enterprise.name": "Enterprise",
    "pricing.enterprise.description": "For teams and companies expanding.",
    "pricing.enterprise.descriptionAnnual": "For teams operating with advanced automation.",
    "pricing.enterprise.f1": "Everything in Pro",
    "pricing.enterprise.f2": "Smart Yield",
    "pricing.enterprise.f3": "Lean Analysis",
    "pricing.enterprise.f4": "Multi-user (5 seats)",
    "pricing.enterprise.f5": "Dedicated Success Manager",
    "pricing.cta.trial": "Start for $1 USD",
    "pricing.cta.sales": "Talk to sales",

    // Star Features
    "starfeatures.label": "Star Features",
    "starfeatures.title": "Tools that drive real decisions.",
    "starfeatures.smart_yield.name": "Smart Yield",
    "starfeatures.smart_yield.tagline": "Know where your money actually comes from.",
    "starfeatures.smart_yield.description": "Quintile Matrix classifies every customer and product by revenue and margin — showing exactly which to grow, re-price, or cut.",
    "starfeatures.quintile.name": "Quintile Matrix",
    "starfeatures.quintile.tagline": "Your 5×5 value map.",
    "starfeatures.quintile.description": "An interactive heatmap that reveals where 80% of your business value lives — and where the complexity is killing your margins.",
    "starfeatures.dirty.name": "Dirty Dozen",
    "starfeatures.dirty.tagline": "12 tactics. One click.",
    "starfeatures.dirty.description": "Apply proven simplification actions — eliminate low-margin products, set minimum orders, stop discounting B customers — directly to your workflow.",
    "starfeatures.coach.name": "EMS Coach AI",
    "starfeatures.coach.tagline": "Your 24/7 strategic consultant.",
    "starfeatures.coach.description": "Ask \"What should I eliminate this month?\" or \"How do I improve Quad 2 margins?\" — and get answers grounded in your actual business data.",

    // Differentiation
    "diff.label": "Why Quantro",
    "diff.title": "Not another dashboard.",
    "diff.traditional": "Traditional BI",
    "diff.point": "Point Solutions",
    "diff.quantro": "Quantro OS",
    "diff.f1": "Data aggregation",
    "diff.f2": "Real-time analytics",
    "diff.f3": "AI recommendations",
    "diff.f4": "Scenario modeling",
    "diff.f5": "Decision support",
    "diff.f6": "Continuous learning",

    // Payment flow
    "payment.processing": "Preparing checkout…",
    "payment.polling": "Verifying your payment…",
    "payment.success.title": "Payment confirmed!",
    "payment.success.body": "Welcome to Quantro. Check your email for next steps.",
    "payment.cancel.title": "Payment cancelled",
    "payment.cancel.body": "We didn't charge you. Try again whenever you want.",
    "payment.error.title": "Something failed",
    "payment.error.body": "We couldn't process the payment. Please try again.",
    "payment.close": "Close",

    // Social Proof
    "social.eyebrow": "Live",
    "social.text": "businesses already joined Quantro",
    "social.today": "today",

    // CTA Section
    "cta.title1": "Stop analyzing.",
    "cta.title2": "Start executing.",
    "cta.subtitle": "Join thousands of businesses using Quantro to gain clarity and make better decisions.",
    "cta.placeholder": "Enter your work email",
    "cta.button": "Start Free Trial",
    "cta.success": "You're on the list!",
    "cta.successMessage": "We'll be in touch soon with your free trial access.",
    
    // Footer
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved."
  }
};

// Get nested translation
export const getTranslation = (language, key) => {
  const keys = key.split('.');
  let result = translations[language];
  
  for (const k of keys) {
    if (result && result[key]) {
      return result[key];
    }
  }
  
  // Direct key lookup
  return translations[language]?.[key] || key;
};

// Export translations
export default translations;
