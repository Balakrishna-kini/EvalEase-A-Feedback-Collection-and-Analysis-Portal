# 🧩 EvalEase — Feedback Intelligence Portal

EvalEase is a full-stack training feedback intelligence platform designed to collect, analyze, and visualize participant feedback after training sessions.

Instead of manual feedback collection and spreadsheet analysis, EvalEase transforms responses into **actionable insights** using analytics dashboards, AI sentiment analysis, and automated reporting tools.

---

## 🌐 Application Preview

<img width="1793" height="833" alt="Landing_page" src="https://github.com/user-attachments/assets/ae68037f-a3d3-42a8-8203-64bb627d46ba" />


---

## 🔧 Tech Stack

### 🖥 Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Recharts (Data Visualization)

### 🔙 Backend
- Spring Boot
- Maven
- JPA / Hibernate
- JWT Authentication
- REST APIs

### 🐍 AI Service
- Python Flask Microservice
- TextBlob NLP Sentiment Analysis

### 🗄 Database
- MySQL (Local Docker)
- PostgreSQL (Cloud Deployment – Neon)

---

## ⚙️ Features

### ✅ Dynamic Feedback System
- Admins create customizable feedback forms
- Supports:
  - Rating Scale ⭐
  - Text / Paragraph Input 📝
  - Multiple Choice 🔘
  - Checkboxes ☑
- Live preview before publishing forms

### ✅ Automated Feedback Collection
Employees can securely:
- View assigned forms
- Submit responses instantly
- Store feedback automatically in database

### ✅ Analytics & Intelligence Dashboard
Admin dashboard provides:
- Participation tracking
- Rating analytics
- Sentiment visualization charts
- Per-form and overall performance insights

### ✅ AI-Driven Insights
EvalEase integrates an AI microservice that:
- Analyzes textual feedback sentiment
- Classifies responses as **Positive / Neutral / Negative**
- Generates improvement suggestions directly inside the admin dashboard
- Processes sentiment asynchronously without blocking user requests

### ✅ Smart Distribution & Reporting
- QR Code generation for instant form access during sessions
- Secure CSV export for Excel / BI analytics
- Deadline-based form auto-closing

### ✅ Employee Experience Enhancements
- Participation certificate generated after submission
- Responsive mobile-friendly interface
- Real-time submission tracking

---

## 📸 Application Screenshots

| Feature / Screen | Preview |
|---|---|
| Admin Login | <img width="1920" height="906" alt="adminlogin" src="https://github.com/user-attachments/assets/ec875dca-6947-45c8-a6cb-e6d133eeb968" /> |
| Admin Dashboard | <img width="1920" height="906" alt="admin dashboard" src="https://github.com/user-attachments/assets/a4af2ad0-820b-4eba-a88d-a76adedc2b48" /> |
| Form Creation | <img width="1189" height="817" alt="Screenshot 2026-03-01 115644" src="https://github.com/user-attachments/assets/1d41b7e5-4865-4159-a01c-11a77aead95e" /> |
| Form Preview | <img width="1920" height="1449" alt="form preview" src="https://github.com/user-attachments/assets/9d76df05-d982-405a-abcf-e923ca0a84eb" /> |
| Employee Login | <img width="1920" height="906" alt="employeelogin" src="https://github.com/user-attachments/assets/192114b0-e984-4c76-a5c4-b661635ed72b" /> |
| Employee Dashboard (Before Submission) | <img width="1268" height="834" alt="image" src="https://github.com/user-attachments/assets/f2ca4daf-3b45-4e64-b186-6e511a116caf" /> |
| Filling the Form | <img width="1920" height="1505" alt="fill form" src="https://github.com/user-attachments/assets/0cace49f-9aed-434e-a965-863e2e4bede5" /> |
| Employee Dashboard (After Submission) | <img width="794" height="648" alt="Screenshot 2026-03-01 121334" src="https://github.com/user-attachments/assets/daa8d6c0-6e99-4f16-a9ab-7ded1a6c343d" /> |
| Analytics (Overall) | <img width="804" height="746" alt="Screenshot 2026-03-01 120149" src="https://github.com/user-attachments/assets/e36fe587-a8b2-4cb6-b03f-b2ab5674b7a0" /> |
| Analytics (Per Form) | <img width="794" height="802" alt="Screenshot 2026-03-01 120654" src="https://github.com/user-attachments/assets/8eec3daf-7f8d-44e6-aedc-08ed3011288d" /> |
| AI Improvement Suggestions | <img width="774" height="469" alt="image" src="https://github.com/user-attachments/assets/a0c2ed9e-c0f2-4bc1-9cb1-302aa458d6b8" /> |
| QR Code & CSV Export | <img width="671" height="600" alt="image" src="https://github.com/user-attachments/assets/1ab9e78d-248f-4638-865c-71baaa408c00" /> |
| Participation Certificate | <img width="404" height="764" alt="image" src="https://github.com/user-attachments/assets/7fb1790c-6fef-43bc-b02a-5ef91d71479e" /> |

---


## 🚀 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Abheeshta-P/EvalEase.git
cd evalease
