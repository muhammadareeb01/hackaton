import os
from fpdf import FPDF

class ProjectReportPDF(FPDF):
    def header(self):
        # Top banner styling
        self.set_fill_color(26, 42, 74) # Dark Navy
        self.rect(0, 0, 210, 15, "F")
        
        self.set_text_color(255, 255, 255)
        self.set_font("helvetica", "B", 8)
        self.set_y(4)
        self.cell(0, 5, "SMARTCITY - TECHNICAL PORTFOLIO & ARCHITECTURE REPORT", align="C")
        self.ln(12)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def create_report():
    pdf = ProjectReportPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()
    
    # Title Section
    pdf.set_y(25)
    pdf.set_font("helvetica", "B", 22)
    pdf.set_text_color(26, 42, 74)
    pdf.cell(0, 10, "SmartCity Platform Report", align="C", ln=True)
    
    pdf.set_font("helvetica", "B", 11)
    pdf.set_text_color(0, 229, 255) # Cyan Accent
    pdf.cell(0, 6, "AI-Powered Civic Grievance System & Security Architecture", align="C", ln=True)
    pdf.ln(5)
    
    # Horizontal Divider Line
    pdf.set_draw_color(220, 225, 235)
    pdf.set_line_width(0.5)
    pdf.line(20, pdf.get_y(), 190, pdf.get_y())
    pdf.ln(8)
    
    # Project Vision
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 42, 74)
    pdf.cell(0, 8, "1. Project Vision & Mission", ln=True)
    
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)
    vision_text = (
        "Modern municipal administrations handle thousands of civic complaints daily. "
        "Traditional grievance portals rely on manual ticket routing, which is slow, error-prone, "
        "and lacks transparent timeline forecasting. SmartCity was developed to solve this bottleneck "
        "by combining cutting-edge Artificial Intelligence with enterprise-grade privacy engineering. "
        "It provides a fast, secure, and fully automated civic ticketing pipeline that categorizes issues, "
        "forecasts resolution timelines, and notifies citizens automatically on every milestone."
    )
    pdf.multi_cell(0, 5, vision_text)
    pdf.ln(6)
    
    # Machine Learning & AI
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 42, 74)
    pdf.cell(0, 8, "2. Advanced Machine Learning (AI)", ln=True)
    
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)
    ml_intro = (
        "SmartCity bypasses static IF/ELSE structures in favor of mathematical models trained on historical "
        "municipal datasets. The pipeline features four distinct AI components:"
    )
    pdf.multi_cell(0, 5, ml_intro)
    pdf.ln(2)
    
    # Bullet points for ML
    bullets = [
        ("Spam & Disposable Email Detection:", " Uses a Logistic Regression model with a character-level N-gram Count Vectorizer. It mathematically analyzes the lexical features of domain names during signup to block temporary/disposable emails (e.g., @10minutemail, @trashmail), preventing spam registrations on the fly."),
        ("Resolution Time Forecasting:", " Employs a Scikit-Learn RandomForestRegressor. It processes priority levels, departmental assignments, and seasonal metrics to calculate exactly how many days a complaint will take to resolve based on historical resolution trends, displaying a realistic timeline to the citizen."),
        ("Automated Issue Categorization:", " Uses a TF-IDF TfidfVectorizer paired with a Logistic Regression classifier to automatically scan description texts and route complaints to the appropriate city department (Water, Electricity, Roads, etc.)."),
        ("Conversational Chatbot Assistant:", " Powered by Google's latest Gemini 2.5 Flash model. It serves as an interactive API agent, answering civic queries, instructing users on how to submit complaints, and maintaining strict security alignment against prompt injections.")
    ]
    
    for title, desc in bullets:
        pdf.set_font("helvetica", "B", 10)
        pdf.set_text_color(26, 42, 74)
        pdf.write(5, f"  * {title}")
        pdf.set_font("helvetica", "", 10)
        pdf.set_text_color(60, 60, 60)
        pdf.write(5, desc)
        pdf.ln(6)
    pdf.ln(4)
    
    # Firebase Auth
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 42, 74)
    pdf.cell(0, 8, "3. Firebase & Security Architecture", ln=True)
    
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)
    auth_text = (
        "To guarantee security at scale, SmartCity decouples identity management from the core database. "
        "Firebase Authentication manages citizen login and registration securely. "
        "Upon successful verification, Firebase issues a cryptographically signed ID token to the citizen. "
        "The Python backend interceptor decodes this token securely on every request to authenticate and authorize "
        "the citizen's session. Admins utilize a separate JWT-based cookie authorization scheme, establishing role-based access "
        "control (RBAC) to isolate citizen and official privileges."
    )
    pdf.multi_cell(0, 5, auth_text)
    pdf.ln(6)
    
    # Resend Email system
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 42, 74)
    pdf.cell(0, 8, "4. Resend Automated Notification System", ln=True)
    
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)
    email_text = (
        "Communication transparency is key to civic trust. SmartCity integrates the Resend API "
        "to deliver instant email notifications directly to citizens. The system operates on a state-machine trigger: "
        "whenever an admin updates a complaint status (Accept, Resolve, Reject, Escalate), a background email task is "
        "immediately dispatched. During the sandbox/testing phase, emails are sent using onboarding@resend.dev. Due to "
        "sandbox safety rules, deliveries are strictly restricted to the verified account owner's email address. "
        "The system has a rate limit of 100 emails per day and 3,000 emails per month on the free tier, which can be expanded "
        "by verifying custom DNS records."
    )
    pdf.multi_cell(0, 5, email_text)
    pdf.ln(6)

    # Database & Privacy
    pdf.set_font("helvetica", "B", 14)
    pdf.set_text_color(26, 42, 74)
    pdf.cell(0, 8, "5. Database & Relational Layout", ln=True)
    
    pdf.set_font("helvetica", "", 10)
    pdf.set_text_color(60, 60, 60)
    db_text = (
        "The relational schema is implemented in MySQL (with a local SQLite fallback for testing). "
        "The complaints database model maintains strict relational integrity. "
        "To ensure compliance with data protection standards (GDPR/APPs), sensitive PII (Personally Identifiable Information) "
        "fields such as citizen names, phone numbers, exact addresses, and descriptions can be toggled to encrypt before write. "
        "SlowAPI is layered on top of all routes, implementing rate-limits to guard against spam bots and DDoS."
    )
    pdf.multi_cell(0, 5, db_text)
    pdf.ln(6)
    
    # Tech Stack Summary Table
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(26, 42, 74)
    pdf.cell(0, 8, "Tech Stack & Deployment Matrix", ln=True)
    pdf.ln(2)
    
    # Custom Table
    pdf.set_font("helvetica", "B", 9)
    pdf.set_fill_color(240, 244, 250)
    pdf.set_text_color(26, 42, 74)
    pdf.cell(45, 7, "Layer", border=1, fill=True)
    pdf.cell(85, 7, "Technologies", border=1, fill=True)
    pdf.cell(60, 7, "Deployment / Hosting", border=1, fill=True)
    pdf.ln()
    
    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(60, 60, 60)
    pdf.cell(45, 7, "Frontend (Citizen & Admin)", border=1)
    pdf.cell(85, 7, "Next.js, Tailwind CSS, Recharts, Framer Motion", border=1)
    pdf.cell(60, 7, "Vercel", border=1)
    pdf.ln()
    
    pdf.cell(45, 7, "Backend API", border=1)
    pdf.cell(85, 7, "FastAPI (Python), SQLAlchemy, SlowAPI", border=1)
    pdf.cell(60, 7, "Railway", border=1)
    pdf.ln()
    
    pdf.cell(45, 7, "Database", border=1)
    pdf.cell(85, 7, "MySQL, SQLite fallback", border=1)
    pdf.cell(60, 7, "Railway MySQL", border=1)
    pdf.ln()
    
    pdf.cell(45, 7, "Authentication & Email", border=1)
    pdf.cell(85, 7, "Firebase Auth, JWT (Admin), Resend API", border=1)
    pdf.cell(60, 7, "Firebase / Resend", border=1)
    pdf.ln()
    
    # Save PDF
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "PROJECT_FEATURES.pdf")
    pdf.output(output_path)
    print(f"Successfully generated PDF at: {output_path}")

if __name__ == "__main__":
    create_report()
