import React, { useEffect } from "react";
import LegalPageLayout from "./LegalPageLayout";
import { applyPageMeta } from "../lib/pageMeta";

const Section = ({ title, children }) => (
  <section className="mb-10" data-testid={`privacy-section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
    <h2 className="font-satoshi font-bold text-2xl text-white mb-4">{title}</h2>
    <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
  </section>
);

export default function PrivacyPage() {
  useEffect(() => {
    return applyPageMeta({
      title: 'Aviso de Privacidad | Quantro',
      description: 'Aviso de Privacidad de Quantro conforme a la LFPDPPP: datos tratados, finalidades, ARCO, encargados y cookies.',
      url: "https://quantroos.com/privacidad",
      ogTitle: 'Aviso de Privacidad | Quantro',
      ogDescription: 'Aviso de Privacidad de Quantro conforme a la LFPDPPP: datos tratados, finalidades, ARCO, encargados y cookies.',
    });
  }, []);

  return (
    <LegalPageLayout
      title="Aviso de Privacidad"
      subtitle="Cómo recopilamos, usamos y protegemos tus datos personales conforme a la LFPDPPP."
    >
      <p className="text-slate-400 mb-10">
        <strong className="text-white">Última actualización:</strong> 11 de septiembre de 2026
      </p>

      <Section title="1. Identidad y domicilio del responsable">
        <p>
          El responsable del tratamiento de tus datos personales es <strong className="text-white">Quantro</strong> (en lo sucesivo, "Quantro", "nosotros"),
          operador de los productos Quantro OS y Quantro Flow en el sitio <strong className="text-white">quantroos.com</strong> y aplicaciones relacionadas.
        </p>
        <p>
          Para ejercer derechos ARCO o aclarar dudas sobre este aviso:{" "}
          <a href="mailto:privacidad@quantroos.com" className="text-[#00F5FF]">privacidad@quantroos.com</a>.
        </p>
        <p className="text-sm text-slate-500">
          Si operas bajo una persona moral mexicana distinta, este aviso se actualizará con razón social, RFC y domicilio fiscal tan pronto estén registrados ante nosotros.
        </p>
      </Section>

      <Section title="2. Datos personales que recabamos">
        <p>Según el uso del servicio, podemos tratar:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-white">Identificación y contacto:</strong> nombre, correo electrónico laboral, empresa, cargo, teléfono (si lo proporcionas).</li>
          <li><strong className="text-white">Cuenta y autenticación:</strong> credenciales hasheadas, identificadores de sesión, roles y membresías de equipo.</li>
          <li><strong className="text-white">Facturación:</strong> datos de plan y estado de pago. Los datos de tarjeta los procesa Stripe; Quantro no almacena el número completo de tarjeta.</li>
          <li><strong className="text-white">Datos operativos del negocio:</strong> información que tú o tu organización cargan o conectan (CRM, contabilidad, comercio, EOS/scorecard, documentos, etc.).</li>
          <li><strong className="text-white">Uso del producto:</strong> eventos de producto, diagnósticos de error del cliente, preferencias de idioma y configuración.</li>
          <li><strong className="text-white">Soporte:</strong> contenido de tickets o correos que nos envíes.</li>
        </ul>
        <p>No solicitamos de forma intencional datos personales sensibles. Si accidentalmente se incluyen en archivos que subes, se tratarán solo para prestar el servicio y bajo las mismas medidas de seguridad.</p>
      </Section>

      <Section title="3. Finalidades del tratamiento">
        <p><strong className="text-white">Finalidades primarias (necesarias para el servicio):</strong></p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Crear y administrar tu cuenta, organización y permisos.</li>
          <li>Proveer Quantro OS / Flow: conectar datos, detectar oportunidades y proponer o ejecutar acciones que configures.</li>
          <li>Procesar pagos, facturación, trials y portal de cliente (Stripe).</li>
          <li>Enviar comunicaciones transaccionales (bienvenida, recibos, seguridad, cambios materiales al servicio).</li>
          <li>Soporte, seguridad, prevención de fraude y cumplimiento de obligaciones legales.</li>
        </ul>
        <p><strong className="text-white">Finalidades secundarias (puedes oponerte):</strong></p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Analítica de producto agregada o seudonimizada para mejorar la experiencia.</li>
          <li>Comunicaciones de producto o marketing (solo si las aceptas o no te opones cuando la ley lo permita).</li>
        </ul>
        <p>
          Para oponerte a finalidades secundarias escribe a{" "}
          <a href="mailto:privacidad@quantroos.com" className="text-[#00F5FF]">privacidad@quantroos.com</a>.
        </p>
      </Section>

      <Section title="4. Fundamento y consentimiento">
        <p>
          Tratamos datos con base en la relación contractual/servicio que solicitas, obligaciones legales y, cuando aplique, tu consentimiento
          (por ejemplo, al marcar la casilla de Términos y Privacidad al registrarte).
        </p>
      </Section>

      <Section title="5. Transferencias y encargados">
        <p>Compartimos datos solo con proveedores necesarios para operar Quantro, bajo contratos y medidas de seguridad adecuadas:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-white">Supabase</strong> — base de datos, autenticación y almacenamiento.</li>
          <li><strong className="text-white">Stripe</strong> — pagos y suscripciones.</li>
          <li><strong className="text-white">Vercel</strong> — hosting de la aplicación web.</li>
          <li><strong className="text-white">Brevo</strong> — correo transaccional (p. ej. bienvenida / pagos).</li>
          <li><strong className="text-white">Proveedores de IA / LLM</strong> (p. ej. vía puerta de enlace LiteLLM) — para funciones que tú activas (borradores, insights). Evita pegar datos que no debas procesar con IA.</li>
          <li><strong className="text-white">Google Analytics 4 / PostHog</strong> — analítica de producto (según configuración vigente).</li>
          <li><strong className="text-white">Sentry</strong> (si está activado) — monitoreo de errores.</li>
        </ul>
        <p>
          Algunos encargados pueden estar fuera de México. Al usar Quantro aceptas dichas transferencias en la medida necesaria para el servicio,
          con las salvaguardas razonables disponibles. <strong className="text-white">No vendemos</strong> tus datos personales.
        </p>
      </Section>

      <Section title="6. Derechos ARCO y revocación">
        <p>
          Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento, puedes
          Acceder, Rectificar, Cancelar u Oponerte al tratamiento, así como revocar el consentimiento y limitar el uso o divulgación,
          escribiendo a <a href="mailto:privacidad@quantroos.com" className="text-[#00F5FF]">privacidad@quantroos.com</a>.
        </p>
        <p>
          Indica tu nombre, medio de contacto, la relación con Quantro y la descripción clara de tu solicitud. Podremos pedir información
          para verificar tu identidad. Responderemos en los plazos que marca la ley (en general, 20 días hábiles para contestar y,
          de ser procedente, 15 días hábiles adicionales para hacer efectiva la determinación).
        </p>
        <p>
          Si consideras que tu derecho a la protección de datos ha sido vulnerado, puedes acudir al Instituto Nacional de Transparencia,
          Acceso a la Información y Protección de Datos Personales (INAI): <a href="https://home.inai.org.mx" className="text-[#00F5FF]" target="_blank" rel="noopener noreferrer">home.inai.org.mx</a>.
        </p>
      </Section>

      <Section title="7. Cookies y tecnologías similares">
        <p>
          Usamos cookies y almacenamiento local necesarios para sesión, preferencias (p. ej. idioma) y, en su caso, analítica.
          Puedes controlar cookies desde tu navegador; deshabilitar las esenciales puede impedir el inicio de sesión.
        </p>
      </Section>

      <Section title="8. Menores de edad">
        <p>
          Quantro está dirigido a usuarios empresariales. No recabamos de forma consciente datos de menores de 18 años.
          Si detectas un registro indebido, contáctanos para eliminarlo.
        </p>
      </Section>

      <Section title="9. Seguridad">
        <p>
          Aplicamos medidas administrativas, técnicas y físicas razonables: transporte cifrado (TLS), control de acceso por roles,
          aislamiento lógico por organización y monitoreo de errores. Ningún sistema es 100% seguro; te pedimos proteger tus credenciales
          y usar autenticación fuerte cuando esté disponible.
        </p>
      </Section>

      <Section title="10. Conservación">
        <p>
          Conservamos datos mientras tu cuenta esté activa y el tiempo adicional necesario para disputas, auditoría, seguridad o
          obligaciones legales (p. ej. comprobantes fiscales). Tras la cancelación, eliminamos o anonimizamos datos operativos en un
          plazo razonable (objetivo: hasta 30 días), salvo retención legal.
        </p>
      </Section>

      <Section title="11. Cambios a este aviso">
        <p>
          Podemos actualizar este aviso. La fecha de "Última actualización" indica la versión vigente. Si el cambio es material,
          te avisaremos por correo o dentro del producto con anticipación razonable.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
