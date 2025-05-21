# 📄 Assignment & Lab Report PDF Generator

🔗 **Live Demo**: [https://assignment-pdf-generator.vercel.app](https://assignment-pdf-generator.vercel.app)

A PDF generation tool designed for **students of Daffodil International University (DIU)**, particularly from the **Department of Software Engineering (SWE)**, to streamline the creation of formatted assignment and lab report cover pages — based on official DIU templates.

> Developed by **Mohammad Ali Nayeem**  
> 🧑‍🎓 Dept. of SWE | 🎓 Batch 41 | Daffodil International University

---

## ✨ Features

- 📝 Generate assignment cover pages as PDF
- 🧪 Generate lab report cover pages with evaluation table
- 📤 Customizable inputs for student, teacher, and course data
- 🖨️ Print-ready layout (DIU official formatting)
- 📚 Result & unofficial transcript generation

---

## 🧰 Tech Stack

### ⚙️ Frontend

- **Next.js (App Router)** — Modern React-based framework used for routing, layout, and rendering.
- **TypeScript** — Ensures strong typing and better developer experience.
- **Tailwind CSS** — Utility-first CSS framework for responsive and scalable UI design.
- **ShadCN UI** — Beautiful, accessible, and customizable component library built on Radix UI & Tailwind CSS.

### 📦 PDF Generation

- **jsPDF** — Core library used to generate PDF documents on the client-side.
- **jspdf-autotable** — Extension for rendering structured tables like evaluation forms and result tables.

### 🌐 API Integration

- **Next.js API Routes** — Custom API endpoints used to securely fetch student data (e.g., from DIU APIs).
- **CORS Handling** — CORS issues with DIU's public APIs are bypassed by routing requests through **Next.js server-side endpoints**, enabling data fetching without client-side restrictions.

---

> 🧠 This stack allows seamless user input, dynamic PDF generation, and backend integration while maintaining a lightweight and modern development workflow.

## 🚀 Getting Started

### 📦 Clone the Repository

```bash
git clone https://github.com/kazinayeem/assignment-pdf-generator.git
cd assignment-pdf-generator

npm install
# or
yarn install


npm run dev

```
