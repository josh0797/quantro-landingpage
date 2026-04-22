"""Resend email templates and send helpers for Quantro."""
import os
import asyncio
import logging
import resend
from typing import Optional

logger = logging.getLogger(__name__)


def _welcome_email_html(amount_usd: float = 1.0) -> str:
    """HTML welcome email for post-payment. Inline CSS, table-based layout."""
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Bienvenido a Quantro!</title>
</head>
<body style="margin:0;padding:0;background-color:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#030712;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:linear-gradient(180deg,#0A0F1C 0%,#030712 100%);border:1px solid rgba(71,85,105,0.4);border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-right:12px;">
                    <div style="width:40px;height:40px;background:#0A0F1C;border:1px solid rgba(0,245,255,0.3);border-radius:8px;text-align:center;line-height:40px;color:#00F5FF;font-weight:bold;font-size:16px;">Q</div>
                  </td>
                  <td>
                    <div style="color:#ffffff;font-weight:600;font-size:20px;letter-spacing:-0.5px;">Quantro</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:20px 40px 10px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;line-height:1.2;letter-spacing:-0.5px;">
                ¡Bienvenido a <span style="background:linear-gradient(90deg,#00F5FF,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#00F5FF;">Quantro</span>!
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:10px 40px 24px 40px;">
              <p style="margin:0;color:#94a3b8;font-size:16px;line-height:1.6;">
                Tu pago de <strong style="color:#ffffff;">${amount_usd:.2f} USD</strong> fue confirmado. Tu acceso de prueba a Quantro ya está listo.
              </p>
            </td>
          </tr>

          <!-- Payment confirmation card -->
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <div style="color:#10B981;font-size:13px;font-weight:600;margin-bottom:4px;">✓ Pago confirmado</div>
                    <div style="color:#cbd5e1;font-size:14px;">Acceso de prueba Quantro OS · ${amount_usd:.2f} USD</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next steps -->
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <h2 style="margin:0 0 16px 0;color:#ffffff;font-size:18px;font-weight:600;">Siguientes pasos</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(71,85,105,0.3);">
                    <div style="color:#00F5FF;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Paso 1</div>
                    <div style="color:#ffffff;font-size:15px;font-weight:500;margin-bottom:4px;">Agenda tu sesión de onboarding</div>
                    <div style="color:#94a3b8;font-size:13px;">Te guiaremos a conectar tus datos en menos de 30 minutos.</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid rgba(71,85,105,0.3);">
                    <div style="color:#00F5FF;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Paso 2</div>
                    <div style="color:#ffffff;font-size:15px;font-weight:500;margin-bottom:4px;">Conecta tu primera fuente de datos</div>
                    <div style="color:#94a3b8;font-size:13px;">Contabilidad, CRM u hoja de cálculo — Quantro se adapta.</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <div style="color:#00F5FF;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Paso 3</div>
                    <div style="color:#ffffff;font-size:15px;font-weight:500;margin-bottom:4px;">Despierta con decisiones listas</div>
                    <div style="color:#94a3b8;font-size:13px;">Cada mañana recibirás un Morning Snapshot con acciones priorizadas.</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA button -->
          <tr>
            <td align="center" style="padding:12px 40px 32px 40px;">
              <a href="mailto:ventas@quantroos.com?subject=Onboarding%20Quantro%20-%20Agendar%20sesión"
                 style="display:inline-block;padding:14px 28px;background:linear-gradient(90deg,#00F5FF,#22D3EE);color:#0A0F1C;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;">
                Agendar onboarding →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(71,85,105,0.3);">
              <p style="margin:0 0 8px 0;color:#64748b;font-size:13px;line-height:1.5;">
                ¿Preguntas? Responde este correo o escríbenos a <a href="mailto:ventas@quantroos.com" style="color:#00F5FF;text-decoration:none;">ventas@quantroos.com</a>.
              </p>
              <p style="margin:0;color:#475569;font-size:12px;">
                © 2026 Quantro · Autonomous Operating System
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


async def send_welcome_email(to_email: str, amount_usd: float = 1.0) -> Optional[str]:
    """Send the Quantro welcome email via Resend. Returns email_id on success, None on failure.
    Non-blocking: runs the sync SDK in a thread."""
    api_key = os.environ.get("RESEND_API_KEY")
    sender = os.environ.get("SENDER_EMAIL", "no-reply@quantroos.com")
    if not api_key:
        logger.warning("RESEND_API_KEY not set; skipping welcome email")
        return None

    resend.api_key = api_key
    params = {
        "from": sender,
        "to": [to_email],
        "subject": "¡Bienvenido a Quantro! Tu acceso ya está listo",
        "html": _welcome_email_html(amount_usd=amount_usd),
    }

    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        email_id = result.get("id") if isinstance(result, dict) else getattr(result, "id", None)
        logger.info(f"Welcome email sent to {to_email} (id={email_id})")
        return email_id
    except Exception as e:
        logger.error(f"Failed to send welcome email to {to_email}: {e}")
        return None
