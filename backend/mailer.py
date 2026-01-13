import asyncio
import logging
import os
from typing import Any, Dict, NamedTuple

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)


class SendGridConfig(NamedTuple):
    api_key: str
    from_addr: str
    notify_to: str


def _get_sendgrid_config() -> SendGridConfig | None:
    api_key = os.getenv("SENDGRID_API_KEY")
    from_addr = os.getenv("SENDGRID_FROM") or ""
    notify_to = os.getenv("NOTIFY_TO") or from_addr
    if not api_key or not from_addr:
        return None
    return SendGridConfig(api_key=api_key, from_addr=from_addr, notify_to=notify_to)


def _build_contact_email(contact_data: Dict[str, Any], cfg: SendGridConfig) -> Mail:
    subject = f"New contact from {contact_data.get('name', 'Unknown')}"
    body_lines = [
        "You received a new contact submission:\n",
        f"Name: {contact_data.get('name')}",
        f"Email: {contact_data.get('email')}",
        f"Subject: {contact_data.get('subject')}",
        "",
        contact_data.get("message", ""),
        "",
        f"Status: {contact_data.get('status', 'new')}",
    ]
    return Mail(
        from_email=cfg.from_addr,
        to_emails=cfg.notify_to,
        subject=subject,
        plain_text_content="\n".join(body_lines),
    )


def _send_sendgrid(message: Mail, cfg: SendGridConfig) -> None:
    client = SendGridAPIClient(cfg.api_key)
    response = client.send(message)
    logger.info("SendGrid send status=%s", response.status_code)


def send_contact_notification(contact_data: Dict[str, Any]) -> None:
    """Send contact notification via SendGrid."""
    cfg = _get_sendgrid_config()
    if not cfg:
        logger.warning("SendGrid not configured (missing SENDGRID_API_KEY/SENDGRID_FROM); skipping send")
        return

    try:
        message = _build_contact_email(contact_data, cfg)
    except Exception as exc:  # pragma: no cover
        logger.error("Failed to build contact email: %s", exc)
        return

    try:
        asyncio.run_coroutine_threadsafe(
            asyncio.to_thread(_send_sendgrid, message, cfg), asyncio.get_event_loop()
        )
    except RuntimeError:
        _send_sendgrid(message, cfg)
    except Exception as exc:  # pragma: no cover
        logger.error("SendGrid send failed: %s", exc)
