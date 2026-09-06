"""
Minimal email sender.

If SMTP_HOST is configured in .env, this sends a real email.
Otherwise (default, for local/dev use) it just prints the email to the
console - so password-reset and email-verification flows are fully
testable without setting up a mail server.
"""

import smtplib
from email.mime.text import MIMEText

from app.core.config import (
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM
)


def send_email(to: str, subject: str, body: str):
    if not SMTP_HOST:
        print("=" * 60)
        print(f"[DEV EMAIL] To: {to}")
        print(f"[DEV EMAIL] Subject: {subject}")
        print(f"[DEV EMAIL] Body:\n{body}")
        print("=" * 60)
        return

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_FROM
    msg["To"] = to

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        if SMTP_USER:
            server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(EMAIL_FROM, [to], msg.as_string())
