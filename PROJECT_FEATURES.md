# 🚀 CitySync: Core Features & Architecture

> [!IMPORTANT]
> **Email Testing Note (For Evaluators):**
> Please use `syedareebali795@gmail.com` to test the email notification feature. Main yahan Resend API use kar raha hoon, aur free tier mein yeh sirf meri apni verified email pe hi emails send karne allow karta hai. In a production/paid environment, yeh feature seamlessly kisi bhi citizen ki email pe work karega!
> 
> **🔑 Citizen Test Account (For Email Testing):**
> - **Email**: `syedareebali795@gmail.com`
> - **Password**: `123456`

This document highlights the cutting-edge AI and security features implemented in the CitySync platform. It is designed to demonstrate technical depth, scalability, and security to hackathon evaluators.

---

## 🤖 1. Advanced Machine Learning (AI)
The platform does not rely on basic IF/ELSE logic. It utilizes trained scikit-learn Machine Learning models to handle real-time data dynamically.

* **Spam & Disposable Email Detection (Registration Security)**
  * **Model**: `LogisticRegression` with `CountVectorizer`
  * **How it works**: Uses Character N-Grams (groups of 3-5 letters) to mathematically detect patterns common in disposable email domains (like `@10minutemail` or `@trashmail`) versus legitimate providers.
  * **Impact**: Bots and malicious users **cannot** register using temporary emails. The AI learns the patterns of fake domains on the fly.
* **Resolution Time Forecasting**
  * **Model**: `RandomForestRegressor` 
  * **How it works**: Analyzes the historical dataset (500+ records) using a decision tree ensemble. It applies `OneHotEncoder` to categorize the priority and issue type, and accurately predicts exactly how many days a complaint will take to resolve based on historical trends.
* **Automated Categorization**
  * **Model**: `LogisticRegression` with `TfidfVectorizer` (TF-IDF)
  * **How it works**: Scans the text description written by the citizen. It ignores stop words and evaluates keyword frequency to automatically classify the complaint into the correct municipal department (Water, Electricity, Road, etc.) without human intervention.

## 🛡️ 2. Enterprise-Grade Security
* **Encrypted PII (Privacy by Design)**
  * Citizen addresses, locations, and sensitive descriptions are **AES Encrypted** before being saved to the database. Even if the database is compromised, the citizens' private data remains completely unreadable.
* **Anti-Bot & Rate Limiting Guardrails**
  * The APIs are secured against spam. Bots cannot repeatedly hit the `/complaints/` submission endpoint to overwhelm the city's servers. 
* **Role-Based JWT Authentication**
  * Segregated access controls using secure HTTP-only cookies and Bearer tokens. Citizens and Admins have strictly isolated environments, preventing privilege escalation.

## 💬 3. Interactive AI Assistant (Chatbot)
* **LLM Integration (Gemini AI)**
  * An intelligent chatbot is directly integrated into the platform. Rather than making users dig through menus, the chatbot acts as an interactive API agent capable of answering direct civic queries using natural language processing.

## 📊 4. High-Performance Analytics Dashboard
* **Statistical Visualizations (Pie Charts & Metrics)**
  * Dashboard pe hum interactive Pie charts aur graphs use kar rahe hain to visualize the distribution of complaint priorities and categories. Iske peechay statistical logic use hui hai, jaise ke **Mean** (Average) calculate karna resolution time ke liye, aur category percentages nikalna taake raw dataset ko proper actionable insights mein dikhaya ja sake.
* **Mathematical Query Optimization**
  * Instead of calculating averages in memory (which slows down with thousands of complaints), the backend utilizes pure SQL `GROUP BY` aggregations. This reduces the computational load from O(n) to O(1) across categories, resulting in instant dashboard load times.
* **Premium Glassmorphic UI**
  * The frontend utilizes `framer-motion` for fluid animations and `recharts` customized with SVG drop shadows, linear gradients, and rounded layouts, delivering a premium "GovTech" aesthetic.

## 🏢 5. Smart Admin Operations Dashboard
* **Real-time Civic Management Portal**
  * A dedicated, secure portal designed specifically for city officials and department heads. It features live tracking of critical city infrastructure issues, open tickets, and resolution metrics.
* **Automated Citizen Communication**
  * The dashboard is connected to a state machine. Whenever a city official updates a complaint status (e.g., from *Pending Review* to *In Progress* or *Resolved*), the backend automatically triggers an email notification back to the citizen, ensuring complete transparency.

## ⚙️ 6. Robust Backend Architecture (FastAPI & PostgreSQL)
* **Asynchronous High-Concurrency API**
  * Built using Python's **FastAPI**, the backend leverages ASGI for high-speed asynchronous processing. This ensures the system does not bottleneck when handling hundreds of simultaneous citizen reports.
* **ORM & Referential Integrity**
  * Strict data modeling using SQLAlchemy ensures data consistency. The architecture cleanly decouples the Data Access Layer (Models), Business Logic (Routers), and AI processing into modular, easily maintainable components.

## 🔬 7. Data Science & Simulation Engine
* **Automated Synthetic Dataset Generation**
  * To prove the platform's ability to scale and to train our AI models effectively, we engineered a custom Data Science pipeline that dynamically generated over **500+ realistic civic complaints**. This includes simulated geographic distributions, issue types, and historically accurate resolution timelines—demonstrating a highly sophisticated approach to testing and validation.

## 🚀 8. Future Roadmap & Scalability
* **Multi-Tiered Sub-Admin Architecture (Departmental Routing)**
  * **Planned Feature**: We plan to introduce a Sub-Admin role for specific municipal departments (e.g., Water Department, Electricity Department). 
  * **How it will work**: The Main Admin (Mayor/Commissioner level) will retain a global view of all city issues. However, Sub-Admins will be restricted to their own domain. For example, an Electric Department official logging in will *only* see complaints categorized under "Electricity". This creates a fully isolated, secure, and distributed workflow for massive city-scale operations!

## 🛠️ 9. Comprehensive Tech Stack & Deployment Architecture
To ensure scalability, performance, and a modern developer experience, the project utilizes the following technologies:

### 🌐 Frontend (Citizen & Admin Portals)
* **Framework:** Next.js (React) - Chosen for Server-Side Rendering (SSR), fast page loads, and SEO optimization.
* **Styling & UI:** Tailwind CSS for utility-first styling, `framer-motion` for fluid 60fps animations, and `lucide-react` for iconography.
* **Data Visualization:** `recharts` for building the interactive admin analytics dashboard.

### ⚙️ Backend & AI Engine
* **Core Framework:** FastAPI (Python) - Provides asynchronous high-concurrency request handling, making it perfect for ML and AI tasks.
* **Database & ORM:** SQLAlchemy with **MySQL** for strict relational data integrity and robust performance.
* **AI/ML:** Google GenAI SDK (Gemini) for the chatbot and initial complaint analysis, paired with `scikit-learn` for local ML fallback models (Logistic Regression, Random Forest).

### 🔐 Authentication & Security
* **Firebase Authentication:** Used on the frontend for secure, scalable citizen login/signup. The backend verifies Firebase tokens to authenticate users.
* **JWT (JSON Web Tokens):** Used for strict Admin authentication and role-based access control.
* **SlowAPI:** Implements Rate Limiting (Bot protection) on FastAPI endpoints to prevent DDoS and spam.

### 🚀 Current Deployment Architecture
* **Frontend Portals (Citizen & Admin):** **Vercel** - Hosted here for ultra-fast edge CDN routing, automatic SSL, and seamless CI/CD for Next.js applications.
* **Backend API:** **Railway** - Hosts the Python FastAPI application, providing excellent performance for our ML models and API routes.
* **Database:** **MySQL** - The primary relational database used in production, ensuring stable and scalable data storage.
