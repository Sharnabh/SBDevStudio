import asyncio
import logging
import os
import smtplib
import ssl
from email.message import EmailMessage
from typing import Any, Dict, NamedTuple

logger = logging.getLogger(__name__)


class SmtpConfig(NamedTuple):
    host: str
    port: int
    user: str | None
    password: str | None
    from_addr: str
    notify_to: str | None


def _get_smtp_config() -> SmtpConfig | None:
    host = os.getenv("SMTP_HOST")
    from_addr = os.getenv("SMTP_FROM") or os.getenv("SMTP_USER") or ""
    if not host or not from_addr:
        return None
    return SmtpConfig(
        host=host,
        port=int(os.getenv("SMTP_PORT", "587")),
        user=os.getenv("SMTP_USER"),
        password=os.getenv("SMTP_PASS"),
        from_addr=from_addr,
        notify_to=os.getenv("NOTIFY_TO"),
    )


def _send_email_sync(message: EmailMessage, cfg: SmtpConfig) -> None:
    """Send an EmailMessage synchronously using SMTP settings."""
    use_ssl = cfg.port == 465
    context = ssl.create_default_context()
    if use_ssl:
        with smtplib.SMTP_SSL(cfg.host, cfg.port, context=context) as server:
            if cfg.user and cfg.password:
                server.login(cfg.user, cfg.password)
            server.send_message(message)
    else:
        with smtplib.SMTP(cfg.host, cfg.port) as server:
            server.ehlo()
            try:
                server.starttls(context=context)
                server.ehlo()
            except smtplib.SMTPException:
                # TLS not supported; continue without it
                pass
            if cfg.user and cfg.password:
                server.login(cfg.user, cfg.password)
            server.send_message(message)


def _build_contact_email(contact_data: Dict[str, Any], cfg: SmtpConfig) -> EmailMessage:
    msg = EmailMessage()
    to_addr = cfg.notify_to or cfg.from_addr
    msg["From"] = cfg.from_addr
    msg["To"] = to_addr
    msg["Subject"] = f"New contact from {contact_data.get('name', 'Unknown')}"

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
    msg.set_content("\n".join(body_lines))
    return msg


def send_contact_notification(contact_data: Dict[str, Any]) -> None:
    """Schedule contact email send (run in thread via asyncio.to_thread)."""
    cfg = _get_smtp_config()
    if not cfg:
        logger.warning("SMTP not configured (missing SMTP_HOST/SMTP_FROM); skipping send")
        return

    try:
        message = _build_contact_email(contact_data, cfg)
    except Exception as exc:  # pragma: no cover
        logger.error("Failed to build contact email: %s", exc)
        return
    try:
        # Run in thread to avoid blocking event loop
        asyncio.run_coroutine_threadsafe(
            asyncio.to_thread(_send_email_sync, message, cfg), asyncio.get_event_loop()
        )
    except RuntimeError:
        # No running loop; send synchronously (e.g., during startup scripts)
        _send_email_sync(message, cfg)
