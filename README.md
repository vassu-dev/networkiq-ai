<div align="center">

# <img src="docs/assets/banner.png" alt="NetworkIQ AI Banner" width="100%">

# 🚀 NetworkIQ AI

### Enterprise Inventory Intelligence Platform

#### *AI-Powered Inventory Analytics • Smart Recommendations • Business Intelligence*

<p align="center">

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

![Version](https://img.shields.io/badge/Version-1.0-success?style=for-the-badge)

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)

![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss)

![AI Ready](https://img.shields.io/badge/AI-Ready-orange?style=for-the-badge)

</p>

---

### 🏆 Walmart Sparkathon 2026

### **Track 4 — NetworkIQ**

### Inventory Optimization & Placement Across the Fulfilment Network

---

### 💡 Analyze Smarter • Optimize Faster • Deliver Better

---

<p align="center">

<a href="#overview">Overview</a> •
<a href="#features">Features</a> •
<a href="#architecture">Architecture</a> •
<a href="#installation">Installation</a> •
<a href="#datasets">Datasets</a> •
<a href="#contributors">Team</a>

</p>

</div>
---

# 📌 Overview

NetworkIQ AI is an intelligent inventory analytics platform designed to help retailers understand inventory distribution, identify operational inefficiencies, and support data-driven inventory decisions.

The application transforms raw inventory datasets into actionable business insights through interactive dashboards, inventory analytics, recommendation workflows, and visual reports.

The current MVP focuses on helping planners explore inventory patterns, detect shortages and excess stock, and evaluate inventory health using uploaded CSV datasets.

---

# 🌍 Why NetworkIQ?

Retail organizations often struggle with inventory visibility across multiple locations.

Common challenges include:

- Overstocked warehouses
- Stock shortages
- Slow-moving inventory
- High inventory carrying costs
- Delayed decision making

NetworkIQ AI centralizes inventory analysis into a modern dashboard that enables planners to quickly understand inventory performance and make informed decisions.

---

# 🎯 Objectives

- Improve inventory visibility
- Support inventory planning
- Analyze inventory distribution
- Simplify inventory reporting
- Enable intelligent recommendations
- Deliver an intuitive dashboard experience
---

<a id="features"></a>

# ✨ Core Features

<div align="center">

| 📊 Analytics | 🤖 Smart Insights | 📈 Visualization |
|:------------:|:----------------:|:----------------:|
| Real-time Inventory Analysis | Intelligent Inventory Recommendations | Interactive Business Dashboard |

</div>

---

## 📂 Inventory Dataset Management

Upload inventory datasets in CSV format and instantly transform raw inventory records into meaningful business insights.

### Supported

- Product Inventory
- Stock Levels
- Categories
- Warehouse Data
- Supplier Information
- Pricing Information
- Inventory Metrics

---

## 📊 Executive Dashboard

A centralized dashboard designed for inventory planners and business stakeholders.

### Dashboard includes

- Inventory Overview
- Product Distribution
- Category Analysis
- Inventory KPIs
- Business Metrics
- Interactive Charts
- Inventory Health Indicators

---

## 📈 Inventory Analytics

Automatically analyzes uploaded inventory datasets to identify trends and opportunities.

Highlights include

- Total Inventory
- Product Categories
- Stock Distribution
- Warehouse Summary
- Inventory Value
- High Stock Products
- Low Stock Products

---

## 🔍 Product Explorer

Quickly search and inspect products across the uploaded inventory dataset.

Features include

- Product Search
- Category Filtering
- Stock Status
- Product Details
- Inventory Statistics

---

## 📦 Inventory Intelligence

Generate actionable insights from inventory data.

The platform assists planners in identifying

- Overstocked Products
- Understocked Products
- Slow-moving Inventory
- Fast-moving Inventory
- Inventory Imbalance
- Distribution Trends

---

## 📉 Business Intelligence

Transform inventory records into decision-ready analytics.

Business metrics include

- Inventory Health
- Product Availability
- Warehouse Distribution
- Category Performance
- Stock Utilization
- Inventory Coverage

---

## 🚀 Modern User Experience

Built using modern web technologies for an intuitive and responsive experience.

✔ Responsive Design

✔ Fast Navigation

✔ Interactive Components

✔ Modern Dashboard

✔ Clean User Interface

✔ Mobile Friendly

✔ Dark Theme Ready

---

# 📸 Dashboard Preview

> Dashboard screenshots will be added after implementation.

<div align="center">

| Executive Dashboard |
|---------------------|
| ![](docs/screenshots/dashboard.png) |

| Inventory Analytics | Product Explorer |
|--------------------|------------------|
| ![](docs/screenshots/analytics.png) | ![](docs/screenshots/products.png) |

| Recommendations | Reports |
|----------------|---------|
| ![](docs/screenshots/recommendations.png) | ![](docs/screenshots/reports.png) |

</div>

---

# 💼 Business Value

NetworkIQ AI enables organizations to transform raw inventory data into meaningful operational intelligence.

### Benefits

📦 Improved Inventory Visibility

📊 Better Business Insights

📈 Faster Decision Making

📉 Reduced Inventory Imbalance

💰 Improved Inventory Utilization

🚀 Enhanced Operational Efficiency

📋 Better Inventory Reporting

🤝 Improved Planner Productivity

---

# 🌟 Why Choose NetworkIQ AI?

Unlike traditional spreadsheet-based inventory management,

NetworkIQ AI provides

- Modern Interactive Dashboard
- Automated Inventory Analytics
- Intelligent Recommendation Engine
- Rich Data Visualization
- Scalable Architecture
- Business-focused Insights
- Enterprise-grade User Experience

---

<div align="center">

## 🎯 Designed for Smarter Inventory Decisions

**Analyze • Visualize • Optimize**

</div>

---
---

<a id="architecture"></a>

# 🏗️ System Architecture

NetworkIQ AI follows a modular architecture that transforms raw inventory datasets into actionable business insights through a streamlined analytics workflow.

```mermaid
flowchart LR

A["📂 Inventory CSV"]

B["📥 Data Import"]

C["🧹 Data Validation"]

D["📊 Inventory Analysis"]

E["📈 Analytics Engine"]

F["🤖 Recommendation Engine"]

G["📉 Business Dashboard"]

H["👨‍💼 Business User"]

A --> B

B --> C

C --> D

D --> E

E --> F

F --> G

G --> H
```

---

# 🔄 Application Workflow

```mermaid
flowchart TD

Start([Upload CSV])

↓

Validate Dataset

↓

Clean Data

↓

Extract Inventory Information

↓

Generate Inventory Metrics

↓

Analyze Stock Distribution

↓

Generate Recommendations

↓

Display Dashboard

↓

Business Insights
```

---

# 📊 Data Processing Pipeline

```mermaid
flowchart LR

Inventory Dataset

↓

CSV Parsing

↓

Data Cleaning

↓

Inventory Analysis

↓

Category Analysis

↓

Business Metrics

↓

Recommendation Engine

↓

Interactive Dashboard
```

---

# 🧠 Recommendation Workflow

```mermaid
flowchart LR

Inventory Data

↓

Stock Analysis

↓

Inventory Health Check

↓

Business Rules

↓

Recommendation Engine

↓

Insights

↓

Dashboard
```

---

# 📂 Repository Structure

```text
networkiq-ai/

│

├── .github/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
│
├── datasets/
│   ├── inventory_data.csv
│   └── inventory_data_large.csv
│
├── docs/
│   ├── architecture.md
│   ├── business-impact.md
│   ├── diagrams/
│   └── screenshots/
│
├── presentation/
│
├── tests/
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md
└── LICENSE
```

---

# ⚙️ Technology Stack

| Layer | Technology |
|---------|------------|
| Frontend | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |
| State Management | React Context API |
| CSV Processing | PapaParse |
| Notifications | Sonner |
| Version Control | Git & GitHub |

---

# 📚 Datasets

The application is powered by two inventory datasets used for analytics and recommendation generation.

### 📄 inventory_data.csv

Primary dataset containing inventory records for products, categories, stock levels, pricing, and warehouse information.

---

### 📄 inventory_data_large.csv

Extended dataset used for large-scale testing, analytics, and performance evaluation.

---

# 📈 Analytics Modules

### 📦 Inventory Overview

Comprehensive summary of available inventory across uploaded datasets.

---

### 📊 Category Analysis

Visual breakdown of products grouped by category.

---

### 📈 Inventory Trends

Identify stock distribution and inventory patterns.

---

### 📉 Inventory Health

Evaluate inventory quality based on stock availability and distribution.

---

### 🔍 Product Explorer

Search and inspect individual inventory records with detailed information.

---

### 💡 Recommendation Engine

Generate business-oriented recommendations based on inventory analysis.

---

<div align="center">

## 🏆 Enterprise-Ready Modular Architecture

**Built for scalability, maintainability, and business intelligence.**

</div>

---
---

<a id="installation"></a>

# 🚀 Getting Started

Follow these steps to run **NetworkIQ AI** locally.

## 📋 Prerequisites

Before running the project, ensure the following are installed:

- Node.js (v18 or later)
- npm
- Git

---

## 📥 Clone the Repository

```bash
git clone https://github.com/vassu-dev/networkiq-ai.git

cd networkiq-ai
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## ▶️ Start Development Server

```bash
npm run dev
```

The application will be available at

```
http://localhost:5173
```

---

## 🏗 Build for Production

```bash
npm run build
```

---

## 🔍 Preview Production Build

```bash
npm run preview
```

---

<a id="datasets"></a>

# 📚 Datasets

NetworkIQ AI is built using two inventory datasets.

| Dataset | Description |
|----------|-------------|
| inventory_data.csv | Core inventory dataset used for analytics |
| inventory_data_large.csv | Extended inventory dataset used for testing and performance evaluation |

These datasets drive inventory analysis, business metrics, and recommendation workflows.

---

# 📸 Application Preview

> Screenshots will be added as development progresses.

## Executive Dashboard

![](docs/screenshots/dashboard.png)

---

## Inventory Analytics

![](docs/screenshots/analytics.png)

---

## Product Explorer

![](docs/screenshots/products.png)

---

## Recommendations

![](docs/screenshots/recommendations.png)

---

## Reports

![](docs/screenshots/reports.png)

---

# 🎥 Demo

A complete walkthrough demonstrating the workflow, analytics, and recommendation engine will be included before the final submission.

```
Demo Video (Coming Soon)
```

---

# 📈 Business Impact

NetworkIQ AI enables inventory planners and business teams to make informed decisions by transforming inventory records into actionable insights.

### Expected Benefits

- 📦 Better Inventory Visibility
- 📊 Improved Inventory Reporting
- 📈 Faster Business Decisions
- 💰 Improved Inventory Utilization
- 📉 Reduced Overstock and Understock Risks
- 🚀 Enhanced Operational Efficiency

---

# 🛣 Roadmap

## Version 1.0

- [x] Modern Dashboard
- [x] CSV Upload
- [x] Inventory Analytics
- [x] Product Search
- [x] Business Metrics
- [x] Recommendation Workflow

---

## Version 2.0

- [ ] AI Recommendation Engine
- [ ] Demand Forecasting
- [ ] Inventory Optimization
- [ ] Smart Inventory Alerts
- [ ] Advanced Reports

---

## Version 3.0

- [ ] Multi-Agent AI
- [ ] ERP Integration
- [ ] Cloud Deployment
- [ ] Real-Time Inventory Monitoring
- [ ] Predictive Business Intelligence

---

<a id="contributors"></a>

# 👥 Team

| Member | Responsibility |
|---------|----------------|
| Team Lead | Project Architecture & AI |
| Member 2 | Frontend Development |
| Member 3 | Data Analytics & Documentation |

---

# 📂 Project Status

> 🚧 Active Development

Current focus:

- Dashboard Enhancement
- Inventory Intelligence
- Recommendation System
- Documentation

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Please follow the project's contribution guidelines before submitting pull requests.

---

# 📜 License

This project is released under the **MIT License**.

See the **LICENSE** file for additional information.

---

# 🙏 Acknowledgements

Special thanks to:

- Walmart Sparkathon 2026
- Kaggle
- React
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts
- Open Source Community

---

<div align="center">

# ⭐ NetworkIQ AI

### Transforming Inventory Data into Business Intelligence

**Built with ❤️ for Walmart Sparkathon 2026**

---

### If you found this project useful, consider giving it a ⭐ on GitHub.

</div>
