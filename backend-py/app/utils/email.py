"""
AntiGravity Backend — Email Utility
SMTP email sender for verification, password reset, renewal reminders.
Design doc § 8: Notification System
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

from app.config import get_settings

settings = get_settings()
logger = logging.getLogger("antigravity.email")

# ─── Email templates ──────────────────────────────────────────────────────────

TEMPLATES = {
    "verify_email": {
        "subject": "Verify your AntiGravity account",
        "body": """
Hi {name},

Please verify your email address by clicking the link below:

{verify_url}

This link expires in 24 hours.

— The AntiGravity Team
        """,
    },
    "password_reset": {
        "subject": "Reset your AntiGravity password",
        "body": """
Hi {name},

You requested a password reset. Click the link below to set a new password:

{reset_url}

This link expires in 30 minutes. If you didn't request this, ignore this email.

— The AntiGravity Team
        """,
    },
    "renewal_reminder": {
        "subject": "⚠️ {subscription_name} renews in 3 days — ₹{amount}",
        "body": """
Hi {name},

Your subscription "{subscription_name}" is renewing on {renewal_date} for ₹{amount}.

Log in to manage your subscriptions:
https://subspace.money/subscriptions

— The AntiGravity Team
        """,
    },
    "goal_milestone": {
        "subject": "🎉 You've reached {pct}% of your '{goal_name}' goal!",
        "body": """
Hi {name},

Amazing progress! You've saved ₹{saved} towards your goal "{goal_name}" — that's {pct}% of your ₹{target} target.

Keep it up! View your goals:
https://subspace.money/savings

— The AntiGravity Team
        """,
    },
}


def send_email(to_email: str, template_name: str, context: dict) -> bool:
    """
    Send a templated email via SMTP.
    Returns True on success, False on failure (fail-safe).
    """
    template = TEMPLATES.get(template_name)
    if not template:
        logger.error(f"Unknown email template: {template_name}")
        return False

    subject = template["subject"].format(**context)
    body    = template["body"].format(**context).strip()

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = settings.FROM_EMAIL
    msg["To"]      = to_email
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.sendmail(settings.FROM_EMAIL, to_email, msg.as_string())
        logger.info(f"Email '{template_name}' sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False  # Fail silently — don't crash the API for email issues
