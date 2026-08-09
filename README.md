# 🚀 SmartCity: AI-Powered Smart Civic Grievance System

**SmartCity** is an advanced, high-performance GovTech platform designed to automate and secure the reporting, triaging, and tracking of civic complaints. By replacing slow manual ticket routing with machine learning models and conversational LLMs, SmartCity dramatically reduces municipal resolution times and enhances citizen trust.

---

## 📖 Table of Contents
1. [Project Vision & Problem Statement](#-project-vision--problem-statement)
2. [Key Core Features](#-key-core-features)
3. [AI & Machine Learning Architecture](#-ai--machine-learning-architecture)
4. [Enterprise Security & PII Protection](#-enterprise-security--pii-protection)
5. [Authentication & Notifications](#-authentication--notifications)
6. [Interactive Analytics Dashboard](#-interactive-analytics-dashboard)
7. [Tech Stack Matrix](#-tech-stack-matrix)
8. [Setup & Running Locally](#-setup--running-locally)

---

## 🎯 Project Vision & Problem Statement
Traditional municipality portals are bottlenecked by manual triage. A citizen files a complaint, a human operator reads it, decides the department, assigns a priority, and estimates a fix time. This process is slow, expensive, and prone to human errors.

**SmartCity solves this by:**
* **Instant Classification:** Instantly routing text/images to the correct municipal division using Gemini and TF-IDF classifiers.
* **Realistic Timelines:** Forecasting exact resolution times using a Scikit-Learn Random Forest Regressor trained on historical parameters.
* **Securing Citizen Data:** Bypassing decryption leaks and ensuring clean data display.

---

## ✨ Key Core Features
* **Spam Registration Protection:** Character-level N-gram models detect and block registration using disposable/fake email domains.
* **Interactive AI Chatbot:** Citizen assistant chatbot powered by Google Gemini 2.5 Flash with built-in prompt-injection guardrails.
* **Automated Official Alerts:** City officials can accept, escalate, reject, or resolve tickets, triggering instant email updates back to the citizen via the Resend API.
* **Professional PDF Documentation:** Full portfolio summary exported directly into [PROJECT_FEATURES.pdf](file:///d:/hackaton/PROJECT_FEATURES.pdf).

---

## 🤖 AI & Machine Learning Architecture
SmartCity implements a hybrid AI pipeline:
1. **Google Gemini (google-genai SDK):** Used for advanced conversational chatbot answers, automatic category/priority prediction on report submissions, and category graphic assets generation.
2. **Local Scikit-Learn Fallback Models:**
   * **LogisticRegression (Character N-grams):** For disposable email domain filtering.
   * **LogisticRegression (TF-IDF):** For text description category classification.
   * **RandomForestRegressor:** For resolution timeline prediction (days).

---

## 🛡️ Enterprise Security & PII Protection
* **Data Encryption:** High-sensitivity citizen details (Name, Address, Phone, Email, Description) are securely integrated.
* **SlowAPI Rate Limiter:** Applied directly to the complaint submission routes to block spam bots and prevent DDoS attacks.
* **Isolated JWT RBAC:** Strict separation of Admin cookies and Bearer tokens to prevent privilege escalation.

---

## 🔐 Authentication & Notifications
* **Firebase Authentication:** Handles secure citizen login, signups, and email verification. The backend interceptor decodes Firebase tokens to validate sessions.
* **Resend Email Notification:** Transmits clean, custom HTML email notifications on status transitions.
  > [!NOTE]
  > On the free tier, emails are routed using `onboarding@resend.dev` and are sandbox-restricted to the verified account owner's email address (e.g. `syedareebali795@gmail.com`).

---

## 📊 Tech Stack Matrix

| Layer | Technologies | Deployment |
| :--- | :--- | :--- |
| **Frontend** | Next.js (React), Tailwind CSS, Framer Motion, Recharts | Vercel |
| **Backend API** | FastAPI (Python), SQLAlchemy, SlowAPI | Railway |
| **AI / ML** | Google GenAI (Gemini 2.5 Flash), Scikit-Learn, Joblib | Railway |
| **Database** | MySQL (Production), SQLite (Fallback) | Railway MySQL |
| **Integrations** | Firebase Auth (Identity), Resend API (Emails) | Cloud |

---

## 🛠️ Setup & Running Locally

### Backend
1. Navigate to the `/backend` folder:
   ```bash
   pip install -r requirements.txt
   ```
2. Configure your environment variables in `.env`.
3. Seed the database:
   ```bash
   python load_dataset.py
   ```
4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Admin Frontend
1. Navigate to `/admin_frontend`:
   ```bash
   npm install && npm run dev
   ```
