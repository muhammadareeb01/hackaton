import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

def send_complaint_email(to_email: str, complaint_id: str, status: str = "Registered"):
    if not resend.api_key:
        print(f"MOCK EMAIL to {to_email}: Complaint {complaint_id} status updated to {status}.")
        return
        
    subject = f"SmartCity Complaint Update: {complaint_id}"
    
    if status == "Registered":
        html = f"<p>Thank you for submitting your complaint (ID: <strong>{complaint_id}</strong>).</p><p>We have received it and will forward your application for processing shortly.</p>"
    elif status == "Resolved":
        html = f"<p>Good news! Your complaint (ID: <strong>{complaint_id}</strong>) has been <strong>Resolved</strong>.</p><p>Thank you for helping keep our city great.</p>"
    else:
        html = f"<p>Your complaint (ID: <strong>{complaint_id}</strong>) status is now: <strong>{status}</strong>.</p>"

    try:
        r = resend.Emails.send({
            "from": "SmartCity <onboarding@resend.dev>",
            "to": to_email,
            "subject": subject,
            "html": html
        })
        print("Email sent:", r)
    except Exception as e:
        print("Failed to send email:", e)
