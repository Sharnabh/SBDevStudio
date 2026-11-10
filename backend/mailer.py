import logging
import os
from pathlib import Path
from dotenv import load_dotenv
from typing import Any, Dict
import resend

load_dotenv(Path(__file__).parent / ".env")

logger = logging.getLogger(__name__)


def send_contact_notification(contact_data: Dict[str, Any]) -> None:
    """Send contact notification via Resend."""
    api_key = os.getenv("RESEND_API_KEY")
    from_addr = os.getenv("RESEND_FROM") or "onboarding@resend.dev"
    notify_to = os.getenv("NOTIFY_TO") or from_addr

    if not api_key:
        logger.warning("Resend not configured (missing RESEND_API_KEY); skipping send")
        return

    resend.api_key = api_key

    subject = f"New contact from {contact_data.get('name', 'Unknown')}"
    body_html = f"""
    <h2>New Contact Submission</h2>
    <p><strong>Name:</strong> {contact_data.get('name')}</p>
    <p><strong>Email:</strong> {contact_data.get('email')}</p>
    <p><strong>Subject:</strong> {contact_data.get('subject')}</p>
    <p><strong>Status:</strong> {contact_data.get('status', 'new')}</p>
    <hr/>
    <p><strong>Message:</strong></p>
    <p>{contact_data.get('message', '')}</p>
    """

    try:
        response = resend.Emails.send({
            "from": from_addr,
            "to": [notify_to],
            "subject": subject,
            "html": body_html,
        })
        logger.info("Resend send response: %s", response)
    except Exception as exc:
        logger.error("Resend send failed: %s", exc)


def send_otp_email(to_email: str, otp_code: str) -> bool:
    """Send 2FA verification OTP email via Resend."""
    api_key = os.getenv("RESEND_API_KEY")
    from_addr = os.getenv("RESEND_FROM") or "SB Dev Studio <support@sbdevstudio.in>"

    if not api_key:
        logger.warning("Resend not configured (missing RESEND_API_KEY); skipping OTP send")
        return False

    resend.api_key = api_key

    subject = f"{otp_code} is your SB Dev Studio Admin verification code"
    body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Admin 2FA Code</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070B14; color: #ffffff; padding: 40px 20px; margin: 0;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #0B1120; border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        <tr>
          <td style="padding: 32px 32px 16px 32px; text-align: center;">
            <h1 style="color: #38bdf8; font-size: 24px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">SB Dev Studio</h1>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">Admin Portal Security Verification</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 32px 24px 32px; text-align: center;">
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.5; margin: 0 0 20px 0;">
              Use the following one-time code to complete your two-factor authentication sign-in:
            </p>
            <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 20px; margin: 0 auto; display: inline-block;">
              <span style="font-family: monospace, Courier, sans-serif; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8;">{otp_code}</span>
            </div>
            <p style="color: #64748b; font-size: 13px; margin: 20px 0 0 0;">
              This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #070B14; padding: 16px 32px; text-align: center; border-top: 1px solid rgba(51, 65, 85, 0.4);">
            <p style="color: #475569; font-size: 12px; margin: 0;">
              If you did not request this login attempt, please secure your account immediately.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    try:
        response = resend.Emails.send({
            "from": from_addr,
            "to": [to_email],
            "subject": subject,
            "html": body_html,
        })
        logger.info("Resend OTP successfully sent to %s (id: %s)", to_email, getattr(response, "id", response))
        return True
    except Exception as exc:
        logger.error("Resend OTP send failed to %s: %s", to_email, exc)
        return False
