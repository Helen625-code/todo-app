<div align="center">

# ⚡ TaskFlow — Modern Productivity & To-Do Suite

<p align="center">
  <strong>Vanilla JavaScript to-do list app with localStorage persistence — DEVSKD Web Development Internship assessment.</strong>
</p>

<p align="center">
  <a href="https://helen625-code.github.io/todo-app/"><img src="https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-4f46e5?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live Demo" /></a>
  <a href="https://github.com/Helen625-code/todo-app/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-Modern_Design-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-keyboard-shortcuts">Shortcuts</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-author">Author</a>
</p>

---

</div>

## 🌐 Live Demo

Experience the live application deployed on **GitHub Pages**:

👉 **[Launch TaskFlow Web App](https://helen625-code.github.io/todo-app/)**

---

## 🌟 Key Features

### 🎯 Core Task Operations
* **Intuitive Creation:** Quick task capture with category tagging and priority ranking.
* **Smart Prioritization:** Distinct tags for 🔥 **High**, ⚡ **Medium**, and 🌱 **Low** priority tasks.
* **Category Tagging:** Organize workflows across 💼 **Work**, 🏠 **Personal**, 🚀 **Project**, ⚠️ **Urgent**, and 💡 **Ideas**.
* **Due Date Tracking:** Visual timeline indicators (Due Today, Due Tomorrow, Overdue, Upcoming).
* **Deep Editing:** Inline quick-edit on double click, or comprehensive detail modal with task notes.
* **Undoable Deletion:** 5-second toast notification system with full undo capability.
* **Task Duplication:** Clone repetitive tasks in a single click.

### 📊 Real-Time Analytics & Feedback
* **Dynamic Counter Ribbons:** Live tracking of Total, In Progress, and Completed tasks.
* **Animated Progress Track:** Fluid SVG progress fill reflecting real-time task completion rate (%).
* **Celebratory Confetti Engine:** Built-in zero-dependency HTML5 Canvas particle confetti system upon completing goals.

### 🔍 Advanced Filtering & Search
* **Real-time Search Bar:** Filter through titles and notes with zero debounce lag.
* **Multi-criteria Sorting:** Sort by Date Created, Due Date, Priority (High to Low), or Alphabetical.
* **Status Filtering:** Tabbed filtering between *All*, *Active*, and *Completed*.

### 🌓 UI/UX & Theming
* **Dark / Light Theme:** Instant mode switching with smooth color transitions and persistent theme state.
* **Modern SaaS Aesthetic:** Polished design system built with custom CSS variables, glassmorphism, and responsive grids.
* **Mobile-First Responsive Layout:** Flawless experience across desktop, tablet, and mobile screens.

### 💾 Persistence & Portability
* **`localStorage` Engine:** Automatic state synchronization preventing data loss on page refresh.
* **JSON Export / Import:** Backup task databases or import existing task sets instantly.

---

## ⌨️ Keyboard Shortcuts

Speed up your daily workflow with built-in productivity keybindings:

| Keybinding | Action | Description |
| :---: | :--- | :--- |
| <kbd>/</kbd> | **Focus Search** | Instantly jumps to the search bar |
| <kbd>N</kbd> | **New Task** | Highlights and focuses the task title input |
| <kbd>Esc</kbd> | **Dismiss / Cancel** | Closes active modals, cancels inline edit, or resets search |
| <kbd>Enter</kbd> | **Submit / Save** | Submits new task or confirms inline edit |

---

## 🏗️ Project Architecture & File Structure

```
todo-app/
├── index.html     # Semantic HTML5 layout, accessible ARIA roles, and SEO tags
├── style.css      # Pure CSS design system, dark/light CSS tokens, responsive UI
├── app.js         # Reactive state engine, storage persistence, particle engine & events
├── LICENSE        # Official MIT Open-Source License
└── README.md      # Comprehensive documentation and project guide
```

---

## 🛠️ Tech Stack & Zero-Dependency Design

| Layer | Technology | Highlights |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic structure, ARIA accessibility, full SEO meta integration |
| **Styling** | Vanilla CSS3 | Custom HSL color design tokens, glassmorphism, micro-animations |
| **Logic** | Pure JavaScript (ES6+) | Modular architecture, Event-driven state updates, Canvas particle engine |
| **Storage** | Web Storage API | Client-side `localStorage` data persistence with JSON serialization |
| **Deployment** | GitHub Pages | Automated continuous deployment directly from `main` branch |

---

## 🚀 Quick Start & Local Setup

Since this application is 100% client-side with **zero build steps** and **zero dependencies**, you can run it directly:

### 1. Clone the repository
```bash
git clone https://github.com/Helen625-code/todo-app.git
cd todo-app
```

### 2. Run locally
- **Option A (Direct):** Open `index.html` directly in your browser.
- **Option B (Local Server via Python):**
  ```bash
  python -m http.server 3000
  ```
- **Option B (Local Server via Node.js):**
  ```bash
  npx -y serve .
  ```
Visit `http://localhost:3000` to interact with the app.

---

## 👩‍💻 Author & Assessment Attribution

* **Developer:** Eman Zehera ([@Helen625-code](https://github.com/Helen625-code))
* **Project:** DEVSKD Web Development Internship Assessment
* **Repository:** [https://github.com/Helen625-code/todo-app](https://github.com/Helen625-code/todo-app)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.
