import React from "react";
import { Mail, MessageCircle, Users, HelpCircle } from "lucide-react";
import LegalPageLayout from "./LegalPageLayout";

const ContactCard = ({ icon, title, description, cta, href, testId }) => (
  <a
    href={href}
    className="group block bg-slate-900/50 border border-slate-800 hover:border-[#00F5FF]/40 hover:bg-slate-900/70 rounded-xl p-6 transition-all duration-200"
    data-testid={testId}
  >
    <div className="w-11 h-11 rounded-lg bg-[#00F5FF]/10 border border-[#00F5FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#00F5FF]/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed mb-4">{description}</p>
    <div className="text-sm text-[#00F5FF] font-medium inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
      {cta}
      <span>→</span>
    </div>
  </a>
);

export default function ContactPage() {
  return (
    <LegalPageLayout
      title="Hablemos"
      subtitle="Estamos para ayudarte. Elige el canal que mejor funcione para ti."
    >
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        <ContactCard
          icon={<Users className="text-[#00F5FF]" size={22} />}
          title="Ventas"
          description="¿Buscas un plan Enterprise, onboarding personalizado o una demo para tu equipo? Hablemos."
          cta="ventas@quantroos.com"
          href="mailto:ventas@quantroos.com?subject=Quantro%20-%20Conversación%20comercial"
          testId="contact-card-sales"
        />
        <ContactCard
          icon={<MessageCircle className="text-[#00F5FF]" size={22} />}
          title="Soporte"
          description="¿Necesitas ayuda con tu cuenta, un pago o una integración? Te respondemos en menos de 24 horas."
          cta="soporte@quantroos.com"
          href="mailto:soporte@quantroos.com?subject=Quantro%20-%20Soporte"
          testId="contact-card-support"
        />
        <ContactCard
          icon={<Mail className="text-[#00F5FF]" size={22} />}
          title="Prensa y alianzas"
          description="¿Colaboración, integración de partners o cobertura de prensa? Contáctanos directamente."
          cta="hola@quantroos.com"
          href="mailto:hola@quantroos.com?subject=Quantro%20-%20Alianza%20o%20Prensa"
          testId="contact-card-press"
        />
        <ContactCard
          icon={<HelpCircle className="text-[#00F5FF]" size={22} />}
          title="Privacidad y datos"
          description="Para ejercer tus derechos ARCO, reportar un incidente de seguridad o preguntas de compliance."
          cta="privacidad@quantroos.com"
          href="mailto:privacidad@quantroos.com?subject=Quantro%20-%20Privacidad"
          testId="contact-card-privacy"
        />
      </div>

      <div className="bg-gradient-to-br from-[#00F5FF]/[0.04] via-[#0F172A]/60 to-[#A020FF]/[0.04] border border-slate-800/70 rounded-2xl p-8 text-center">
        <h3 className="font-satoshi font-bold text-2xl text-white mb-3">
          ¿Prefieres una llamada?
        </h3>
        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
          Agenda 20 minutos con nuestro equipo y cuéntanos qué estás buscando. Sin compromiso, sin guión.
        </p>
        <a
          href="mailto:ventas@quantroos.com?subject=Quantro%20-%20Agendar%20llamada"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#22D3EE] text-[#0A0F1C] font-satoshi font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#00F5FF]/20 transition-all"
          data-testid="contact-cta-schedule"
        >
          Agendar una llamada
        </a>
      </div>
    </LegalPageLayout>
  );
}
