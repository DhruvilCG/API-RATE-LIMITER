# 🛡️ Sentinel: API Rate Limiter & Analytics

**A high-performance, full-stack API governing system built with Spring Boot and Next.js.**

Sentinel provides a futuristic, glassmorphic dashboard to manage API rate limits with micro-second precision, real-time traffic visualization, and ultra-fast log analytics.

---

## ✨ Features

### 💎 Premium Design System
- **Glassmorphic UI**: Ambient mesh backgrounds and glowing interactive elements.
- **Spring-Physics Animations**: Smooth, hardware-accelerated transitions for rule deployment and management.
- **Interactive Analytics**: Real-time traffic Volume timelines using Recharts.

### 🛡️ Core Infrastructure
- **Sliding-Window Rate Limiting**: Intelligent algorithm that dynamically regenerates request capacity.
- **Micro-Log Service**: Efficiently handles thousands of logs with a specialized aggregation API.
- **API Key Security**: Weighted header enforcement (`X-API-KEY`) for all protected endpoints.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16, TailwindCSS, TypeScript, Lucide React, Recharts |
| **Backend** | Spring Boot 3, Java 21, Spring Security, Hibernate/JPA |
| **Database** | MySQL (Optimized with direct-count stats) |
| **Hosting** | Vercel (Frontend), Render/Railway (Backend & DB) |

---

## 🚀 Getting Started

### 1. Backend Setup
1. Navigate to `backend/`.
2. Configure `src/main/resources/application.properties` with your MySQL credentials.
3. Run:
   ```bash
   ./mvnw spring-boot:run
   ```

### 2. Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run:
   ```bash
   npm run dev
   ```

---

## 🌍 Deployment

For a 100% free deployment guide (Aiven & Render), check out:
👉 **[Deployment Guide](.gemini/antigravity/brain/8bd96a94-534a-4181-883c-0099a723a95e/deployment_guide.md)**

---

## 📸 Screenshots
*(Add your screenshots here after deploying!)*

---

Developed with ❤️ for high-performance API infrastructure.
