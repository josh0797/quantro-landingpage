import React from "react";
import LegalPageLayout from "./LegalPageLayout";

const Section = ({ title, children }) => (
  <section className="mb-10" data-testid={`terms-section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
    <h2 className="font-satoshi font-bold text-2xl text-white mb-4">{title}</h2>
    <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Términos de Servicio"
      subtitle="Las reglas del juego para usar Quantro — claras y sin letras chicas."
    >
      <p className="text-slate-400 mb-10">
        <strong className="text-white">Última actualización:</strong> Febrero 2026
      </p>

      <Section title="Aceptación">
        <p>
          Al crear una cuenta o utilizar Quantro aceptas estos Términos. Si no estás de acuerdo, simplemente no uses el servicio.
        </p>
      </Section>

      <Section title="Qué es Quantro">
        <p>
          Quantro OS es un sistema que analiza tu negocio y te propone acciones. Quantro Flow responde, organiza y da seguimiento automáticamente.
          Juntos, forman un sistema operativo autónomo para tu empresa.
        </p>
      </Section>

      <Section title="Tu cuenta">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Eres responsable de mantener la confidencialidad de tus credenciales.</li>
          <li>Debes proveer información veraz y actualizada.</li>
          <li>No puedes compartir tu cuenta con personas fuera de tu organización.</li>
        </ul>
      </Section>

      <Section title="Prueba de $1 USD">
        <p>
          Ofrecemos un acceso de prueba por <strong className="text-white">$1 USD</strong>, un cargo único no reembolsable que da acceso al producto por un período limitado.
          Al finalizar la prueba podrás elegir un plan mensual o anual, o simplemente no continuar.
        </p>
      </Section>

      <Section title="Planes y pagos">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Los planes se facturan de forma mensual o anual, según elijas al contratar.</li>
          <li>Los planes anuales incluyen el equivalente a 2 meses gratis frente al plan mensual.</li>
          <li>Los pagos son procesados por Stripe. Al aceptar, autorizas el cargo recurrente en tu método de pago.</li>
          <li>Impuestos aplicables (IVA u otros) se agregan según tu jurisdicción.</li>
        </ul>
      </Section>

      <Section title="Cancelación y reembolsos">
        <p>
          Puedes cancelar en cualquier momento desde tu cuenta o escribiendo a{" "}
          <a href="mailto:soporte@quantroos.com" className="text-[#00F5FF]">soporte@quantroos.com</a>.
          Al cancelar, mantendrás acceso hasta el final del ciclo pagado. No ofrecemos reembolsos por períodos ya facturados, salvo en casos específicos requeridos por ley.
        </p>
      </Section>

      <Section title="Uso aceptable">
        <p>No puedes usar Quantro para:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Actividades ilegales o fraudulentas.</li>
          <li>Enviar spam o contenido malicioso.</li>
          <li>Hacer ingeniería inversa del servicio.</li>
          <li>Revender o redistribuir el acceso sin nuestro consentimiento escrito.</li>
        </ul>
      </Section>

      <Section title="Tus datos, tu propiedad">
        <p>
          Todo el contenido y datos que conectes a Quantro siguen siendo tuyos. Nos otorgas una licencia limitada únicamente para operar el servicio.
          Puedes exportar o solicitar la eliminación de tus datos en cualquier momento.
        </p>
      </Section>

      <Section title="Disponibilidad y garantías">
        <p>
          Hacemos nuestro mejor esfuerzo para mantener el servicio disponible 24/7, pero no podemos garantizar uptime absoluto.
          Quantro se provee "tal cual" — aunque ponemos todo nuestro empeño, no podemos garantizar resultados comerciales específicos.
        </p>
      </Section>

      <Section title="Limitación de responsabilidad">
        <p>
          La responsabilidad máxima de Quantro se limita al monto efectivamente pagado por ti en los últimos 12 meses.
          No somos responsables por daños indirectos, incidentales o consecuentes.
        </p>
      </Section>

      <Section title="Cambios">
        <p>
          Podemos actualizar estos Términos. Si hay cambios materiales, te avisaremos con al menos 30 días de anticipación por correo.
          Si no estás de acuerdo, puedes cancelar antes de que entren en vigor.
        </p>
      </Section>

      <Section title="Ley aplicable">
        <p>
          Estos Términos se rigen por las leyes aplicables y cualquier disputa se resolverá en los tribunales competentes correspondientes.
        </p>
      </Section>

      <Section title="Contacto">
        <p>
          ¿Dudas? Escríbenos a <a href="mailto:soporte@quantroos.com" className="text-[#00F5FF]">soporte@quantroos.com</a>.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
