import React, { useEffect } from "react";
import LegalPageLayout from "./LegalPageLayout";
import { applyPageMeta } from "../lib/pageMeta";

const Section = ({ title, children }) => (
  <section className="mb-10" data-testid={`terms-section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
    <h2 className="font-satoshi font-bold text-2xl text-white mb-4">{title}</h2>
    <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
  </section>
);

export default function TermsPage() {
  useEffect(() => {
    return applyPageMeta({
      title: 'Términos de Servicio | Quantro',
      description: 'Términos de Servicio de Quantro OS y Quantro Flow: cuenta, pagos, IA, cancelación y ley aplicable.',
      url: "https://quantroos.com/terminos",
      ogTitle: 'Términos de Servicio | Quantro',
      ogDescription: 'Términos de Servicio de Quantro OS y Quantro Flow: cuenta, pagos, IA, cancelación y ley aplicable.',
    });
  }, []);

  return (
    <LegalPageLayout
      title="Términos de Servicio"
      subtitle="Las reglas para usar Quantro OS y Quantro Flow — claras y sin letras chicas."
    >
      <p className="text-slate-400 mb-10">
        <strong className="text-white">Última actualización:</strong> 11 de septiembre de 2026
      </p>

      <Section title="1. Aceptación">
        <p>
          Al crear una cuenta, marcar la casilla de aceptación o utilizar Quantro ("el Servicio"), aceptas estos Términos de Servicio
          y el <a href="/privacidad" className="text-[#00F5FF]">Aviso de Privacidad</a>. Si no estás de acuerdo, no uses el Servicio.
        </p>
      </Section>

      <Section title="2. Descripción del Servicio">
        <p>
          Quantro conecta datos de tu negocio, detecta oportunidades y propone (y, cuando lo autorices, ejecuta) acciones.
          Incluye módulos como ejecución EOS, CRM, finanzas, comercio, automatizaciones y agentes. Las funciones pueden evolucionar;
          algunas integraciones se ofrecen primero en modo vista previa y se etiquetan como tales.
        </p>
      </Section>

      <Section title="3. Elegibilidad y cuenta">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Debes tener capacidad legal para contratar y usar el Servicio en representación de tu organización cuando actúes como admin.</li>
          <li>Eres responsable de la veracidad de la información y de la confidencialidad de tus credenciales.</li>
          <li>No compartas accesos fuera de tu organización ni eludas controles de plan o de seguridad.</li>
          <li>Podemos suspender cuentas por fraude, abuso o incumplimiento.</li>
        </ul>
      </Section>

      <Section title="4. Prueba de $1 USD y renovación">
        <p>
          Cuando esté disponible, ofrecemos un acceso de prueba por <strong className="text-white">$1 USD</strong> (cargo único no reembolsable
          que puede aplicarse como crédito según la oferta vigente hacia el primer mes del plan indicado en el checkout).
        </p>
        <p>
          <strong className="text-white">La suscripción se renueva automáticamente</strong> al precio del plan elegido al terminar el periodo de prueba
          o el ciclo de facturación, cargado al mismo método de pago, salvo que canceles antes desde Ajustes → Plan y Facturación o escribiendo a{" "}
          <a href="mailto:soporte@quantroos.com" className="text-[#00F5FF]">soporte@quantroos.com</a>.
        </p>
      </Section>

      <Section title="5. Planes, pagos e impuestos">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Los precios y características se muestran en el checkout / página de precios y pueden cambiar con aviso previo para ciclos futuros.</li>
          <li>Los pagos los procesa Stripe. Al contratar, autorizas cargos recurrentes según el intervalo elegido (mensual o anual).</li>
          <li>Impuestos aplicables (p. ej. IVA) se agregan según tu jurisdicción y datos fiscales.</li>
          <li>Si un pago falla, podemos limitar el acceso hasta regularizar la cuenta.</li>
        </ul>
      </Section>

      <Section title="6. Cancelación y reembolsos">
        <p>
          Puedes cancelar en cualquier momento. Mantendrás acceso hasta el final del periodo ya pagado.
          Salvo disposición legal imperativa, no hay reembolso prorrateado por periodos iniciados. El cargo de prueba de $1 USD no es reembolsable.
        </p>
      </Section>

      <Section title="7. Tu contenido y datos">
        <p>
          Tú (o tu organización) conservan la titularidad de los datos que cargan o conectan. Nos otorgas una licencia limitada,
          mundial y no exclusiva para alojar, procesar y mostrar ese contenido solo para operar el Servicio y cumplir la ley.
          Puedes solicitar exportación o eliminación conforme al Aviso de Privacidad.
        </p>
      </Section>

      <Section title="8. IA y automatización">
        <p>
          Algunas funciones usan modelos de IA. Las salidas pueden ser incorrectas o incompletas: debes revisarlas antes de actuar.
          No uses el Servicio como único criterio para decisiones legales, médicas, crediticias o de alto riesgo sin supervisión humana.
          Las acciones autónomas solo ocurren en los niveles de autonomía que configures y, cuando aplique, con aprobaciones.
        </p>
      </Section>

      <Section title="9. Uso aceptable">
        <p>Está prohibido, entre otros:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Usos ilegales, fraudulentos o que infrinjan derechos de terceros.</li>
          <li>Spam, malware, scraping abusivo o ataques a la infraestructura.</li>
          <li>Ingeniería inversa no permitida por ley, reventa del acceso o elusión de límites de plan.</li>
          <li>Cargar datos personales sin base legal o sin informar a tus titulares cuando te corresponda como responsable.</li>
        </ul>
      </Section>

      <Section title="10. Propiedad intelectual de Quantro">
        <p>
          El software, marcas, diseño y documentación de Quantro son nuestros o de nuestros licenciantes.
          No se otorga ninguna licencia distinta a la de uso del Servicio conforme a estos Términos.
        </p>
      </Section>

      <Section title={'11. Disponibilidad y "tal cual"'}>
        <p>
          Buscamos alta disponibilidad, pero el Servicio se ofrece "tal cual" y "según disponibilidad".
          No garantizamos resultados de negocio específicos ni uptime absoluto. Las vistas previas de conectores pueden no reflejar datos en vivo.
        </p>
      </Section>

      <Section title="12. Limitación de responsabilidad">
        <p>
          En la máxima medida permitida por la ley, la responsabilidad total de Quantro por reclamaciones relacionadas con el Servicio
          se limita a lo efectivamente pagado por ti a Quantro en los 12 meses anteriores al hecho. No respondemos por daños indirectos,
          lucro cesante, pérdida de datos o consequential damages, salvo dolo o lo que la ley no permita limitar.
        </p>
      </Section>

      <Section title="13. Indemnización">
        <p>
          Aceptas indemnizar a Quantro frente a reclamaciones de terceros derivadas de tus datos, tu uso ilegal del Servicio
          o el incumplimiento de estos Términos, en la medida permitida por la ley.
        </p>
      </Section>

      <Section title="14. Cambios">
        <p>
          Podemos modificar estos Términos. Si el cambio es material, avisaremos con al menos 30 días de anticipación por correo o en el producto.
          El uso continuado después de la vigencia implica aceptación, salvo que canceles antes.
        </p>
      </Section>

      <Section title="15. Ley aplicable y disputas">
        <p>
          Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Salvo norma imperativa en contrario,
          las partes se someten a los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero.
        </p>
      </Section>

      <Section title="16. Contacto">
        <p>
          Soporte: <a href="mailto:soporte@quantroos.com" className="text-[#00F5FF]">soporte@quantroos.com</a>.
          Privacidad: <a href="mailto:privacidad@quantroos.com" className="text-[#00F5FF]">privacidad@quantroos.com</a>.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
