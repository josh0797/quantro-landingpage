import React from "react";
import LegalPageLayout from "./LegalPageLayout";

const Section = ({ title, children }) => (
  <section className="mb-10" data-testid={`privacy-section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
    <h2 className="font-satoshi font-bold text-2xl text-white mb-4">{title}</h2>
    <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Aviso de Privacidad"
      subtitle="Cómo protegemos y tratamos tu información en Quantro."
    >
      <p className="text-slate-400 mb-10">
        <strong className="text-white">Última actualización:</strong> Febrero 2026
      </p>

      <Section title="Quiénes somos">
        <p>
          Quantro OS es un sistema operativo autónomo de negocio. El responsable del tratamiento de tus datos personales es Quantro ("nosotros"),
          con contacto en <a href="mailto:privacidad@quantroos.com" className="text-[#00F5FF]">privacidad@quantroos.com</a>.
        </p>
      </Section>

      <Section title="Qué datos recopilamos">
        <p>Recopilamos únicamente la información necesaria para operar el servicio:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-white">Datos de cuenta:</strong> nombre, email de trabajo, empresa.</li>
          <li><strong className="text-white">Datos de pago:</strong> procesados directamente por Stripe — nunca almacenamos números de tarjeta.</li>
          <li><strong className="text-white">Datos operativos:</strong> la información de tu negocio que decides conectar (contabilidad, CRM, etc.).</li>
          <li><strong className="text-white">Datos de uso:</strong> analítica anónima para mejorar el producto (Google Analytics 4).</li>
        </ul>
      </Section>

      <Section title="Para qué los usamos">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Proveer, personalizar y mejorar Quantro OS y Quantro Flow.</li>
          <li>Generar las decisiones, prioridades y acciones que conforman el valor del producto.</li>
          <li>Procesar tu pago y enviarte comunicaciones transaccionales.</li>
          <li>Cumplir obligaciones legales y prevenir fraude.</li>
        </ul>
      </Section>

      <Section title="Con quién los compartimos">
        <p>Solo con proveedores estrictamente necesarios para operar:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-white">Stripe</strong> — procesamiento de pagos.</li>
          <li><strong className="text-white">Resend</strong> — envío de correos transaccionales.</li>
          <li><strong className="text-white">Google Analytics 4</strong> — analítica anónima de uso.</li>
        </ul>
        <p>No vendemos, rentamos ni compartimos tus datos con terceros para fines comerciales.</p>
      </Section>

      <Section title="Tus derechos (ARCO)">
        <p>
          Puedes Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos en cualquier momento escribiéndonos a{" "}
          <a href="mailto:privacidad@quantroos.com" className="text-[#00F5FF]">privacidad@quantroos.com</a>.
          Responderemos en un plazo máximo de 20 días hábiles.
        </p>
      </Section>

      <Section title="Seguridad">
        <p>
          Toda la información viaja cifrada (TLS 1.3). Usamos aislamiento por cliente, control de acceso basado en roles y auditoría continua.
          Nunca exponemos tu información a otros clientes.
        </p>
      </Section>

      <Section title="Retención">
        <p>
          Conservamos tus datos mientras tengas una cuenta activa. Al cancelar, eliminamos tu información operativa en un máximo de 30 días,
          excepto aquella que por ley debamos retener (facturación, cumplimiento fiscal).
        </p>
      </Section>

      <Section title="Cambios a este aviso">
        <p>
          Actualizaremos este documento cuando sea necesario. Si el cambio afecta tus derechos, te avisaremos por correo electrónico al menos 15 días antes.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
