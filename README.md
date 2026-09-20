# LegacyLens — Parental Legacy & Life Factors Calculator

A polished full-stack implementation of the **Parental Legacy & Life Factors Calculator** assessment.

The application uses **React + Vite** for the frontend and **Node.js + Express.js** for the backend. Instead of requiring MongoDB, the backend persists saved calculations to a local `backend/data/db.json` file, keeping the project simple to run while still demonstrating a clean REST API architecture.

---

## ✨ Features

### Core Calculation

- Date of Birth input in `DD/MM/YYYY` format
- Calendar date validation
- Future-date validation
- Deterministic calculation based on DOB
- Odd day → Mother has higher influence
- Even day → Father has higher influence
- Seven supplied life-factor ranges enforced
- Mother + Father = `100.000`
- Dominant parent identification
- Transparent calculation methodology

### Dashboard

- Modern responsive analytics dashboard
- Mother influence summary
- Father influence summary
- Dominant parent indicator
- Detailed factor breakdown table
- Mother vs Father comparison chart
- Parental balance donut chart
- Validation status
- Calculation methodology section
- Desktop and mobile responsive layouts

### Storage

- Express REST API
- Persistent local JSON storage
- Saved calculation history
- Duplicate DOB handling
- View saved calculations
- Delete saved calculations

### Reports

- PDF report export
- CSV export
- Structured report-ready history
- PDF formatted for easy reading and printing
- Spreadsheet-friendly CSV structure

### UI / UX

- Dark mode
- Light mode
- Responsive mobile navigation
- Mobile-friendly DOB input
- Responsive charts
- Positive green accent system
- Accessible buttons and controls
- Clean SaaS-style dashboard interface

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS3
- Recharts
- Lucide React
- jsPDF
- jsPDF AutoTable

## Backend

- Node.js
- Express.js
- REST API
- JSON file persistence

## Storage

Instead of requiring an external MongoDB installation, this project uses:

```text
backend/data/db.json