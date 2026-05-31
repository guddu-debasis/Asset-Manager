from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pathlib import Path
import asyncio

from app.core.config import settings

# ── Mail connection config (reads from settings / .env) ──
_conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=Path(__file__).parent.parent / "templates" / "email",
)

_mailer = FastMail(_conf)


# ─────────────────────────────────────────────────────────
# Standalone function — used by PasswordResetService
# ─────────────────────────────────────────────────────────
async def send_password_reset_email(email: str, full_name: str, token: str) -> None:
    """Send a password reset link email."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    message = MessageSchema(
        subject=f"Reset your {settings.MAIL_FROM_NAME} password",
        recipients=[email],
        template_body={
            "full_name": full_name,
            "app_name": settings.MAIL_FROM_NAME,
            "reset_url": reset_url,
            "support_email": settings.MAIL_FROM,
            "expire_minutes": settings.RESET_TOKEN_EXPIRE_MINUTES,
        },
        subtype=MessageType.html,
    )
    await _mailer.send_message(message, template_name="password_reset.html")


# ─────────────────────────────────────────────────────────
# EmailService class — used by AuthService (welcome email)
# ─────────────────────────────────────────────────────────
class EmailService:

    @staticmethod
    async def send_welcome(email: str, full_name: str) -> None:
        """Send a welcome email after successful signup."""
        message = MessageSchema(
            subject=f"Welcome to {settings.MAIL_FROM_NAME}!",
            recipients=[email],
            template_body={
                "full_name": full_name,
                "app_name": settings.MAIL_FROM_NAME,
                "login_url": f"{settings.FRONTEND_URL}/signin",
                "support_email": settings.MAIL_FROM,
            },
            subtype=MessageType.html,
        )
        await _mailer.send_message(message, template_name="welcome.html")

    @staticmethod
    def send_welcome_background(email: str, full_name: str) -> None:
        """
        Fire-and-forget wrapper — call this from synchronous service code.
        Runs the async send in a background thread so the signup response
        is NOT delayed by the email send.
        """
        import threading

        def _run():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                loop.run_until_complete(
                    EmailService.send_welcome(email, full_name)
                )
            except Exception as exc:
                print(f"[EmailService] Failed to send welcome email: {exc}")
            finally:
                loop.close()

        thread = threading.Thread(target=_run, daemon=True)
        thread.start()
