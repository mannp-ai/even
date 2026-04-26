# Pact (by Even) 💸

A premium, local-first expense tracker and group split application. Designed for privacy, speed, and visual clarity.

![Pact Logo](https://img.shields.io/badge/Pact-Local--First-7c6dfa?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

- **🔒 Local-First Privacy**: Your financial data never leaves your device. No cloud syncing, no tracking, and no hidden databases.
- **🤝 Smart Group Splits**: Create "Pacts" with friends to track shared expenses. Supports equal and custom splitting logic.
- **📊 Interactive Debt Graph**: A dynamic HTML5 Canvas visualization showing the flow of money within your group.
- **🧠 AI-Powered Insights**: Simulated smart assistant that analyzes spending patterns and suggests optimized settlement paths.
- **📈 Comprehensive Analytics**: Category-wise breakdowns (Food, Travel, Fun, etc.) and monthly budget tracking with visual progress bars.
- **💾 Data Portability**: Full support for JSON exports and imports, giving you total control over your backups.
- **🎨 Premium UI/UX**: Zero-dependency architecture with custom professional SVG icons and a sleek, dark-themed aesthetic.

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Modern Vanilla CSS with HSL variables
- **State Management**: React Hooks + LocalStorage Persistence
- **Visualization**: HTML5 Canvas API

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mannp-ai/even.git
   cd even/pact-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
even/
├── pact-react/            # Main React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── App.tsx        # Main application logic & routing
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Core design system & styles
│   └── public/            # Static assets
├── .gitignore             # Root git ignore
└── README.md              # Project documentation
```

## 🔐 Privacy Guarantee

Pact is built on the philosophy that financial data is personal. 
- **No Servers**: We don't host your data.
- **No Cookies**: We don't track your behavior.
- **No Accounts**: Signup is local-only and used for local encryption/access control.

---

Built with ❤️ by [Mann](https://github.com/mannp-ai)
