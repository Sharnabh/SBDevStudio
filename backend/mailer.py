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
