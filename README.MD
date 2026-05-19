# 🚀 AI-WebGen

> An AI-powered full-stack website generator that converts plain text prompts into complete, ready-to-use websites — instantly.

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)

---

## 📌 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [How It Works](#-how-it-works)
- [AI Prompt Engineering](#-ai-prompt-engineering)
- [Example Prompts](#-example-prompts)
- [Limitations](#-limitations)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 🧠 About

AI-WebGen is a full MERN stack web application that lets users generate complete websites from a single line of text. Powered by **Google Gemini AI**, it intelligently detects the type of project required — static or full MERN stack — generates all necessary files, displays them in a **Monaco code editor** with a live file explorer, offers a **live preview** for static sites, and allows instant **ZIP download** of the entire project.

No templates. No drag-and-drop. Just describe what you want — and it builds it.

---

## ✨ Features

| Feature                 | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| 🤖 **AI Generation**    | Generates complete websites from plain text using Gemini AI          |
| 🎨 **Dual Output Mode** | Supports Static (HTML/CSS/JS) and full MERN stack project generation |
| 🧠 **Smart Detection**  | Automatically detects project type from prompt keywords              |
| 📁 **File Explorer**    | Dynamic folder tree showing all generated files and directories      |
| 📝 **Monaco Editor**    | VS Code-grade in-browser code editor with syntax highlighting        |
| ⚡ **Live Preview**     | Instant browser preview for generated static websites                |
| 📦 **ZIP Download**     | Download the entire generated project as a `.zip` file               |
| ☁️ **Cloud Storage**    | Projects saved to MongoDB Atlas for persistence                      |
| 🔥 **Modern UI**        | Responsive, clean interface built with React                         |

---

## 🛠 Tech Stack

**Frontend**

- React.js
- Axios
- Monaco Editor (`@monaco-editor/react`)
- JSZip + FileSaver.js

**Backend**

- Node.js + Express.js
- Google Gemini AI API (`@google/generative-ai`)
- MongoDB Atlas + Mongoose
- dotenv, cors, nodemon

---

## 📁 Project Structure

```
AI-WEBGEN/
│
├── client/                         # React frontend
│   ├── public/
│   └── src/
│       ├── App.js                  # Root component
│       ├── App.css                 # Global styles
│       └── ...
│
├── server/                         # Express backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   └── generateController.js   # Generation logic & Gemini integration
│   ├── models/
│   │   ├── Projects.js             # Project schema
│   │   └── Users.js                # User schema
│   ├── routes/
│   │   └── generateRoutes.js       # API route definitions
│   ├── services/
│   │   └── geminiService.js        # Gemini AI service layer
│   ├── utils/
│   │   └── parseFiles.js           # AI response parser
│   ├── server.js                   # Express app entry point
│   └── .env                        # Environment variables (not committed)
│
├── .gitignore
├── .env.example                    # Environment variable template
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://cloud.mongodb.com/) account (free tier works)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/AI-WebGen.git
cd AI-WebGen
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create your `.env` file inside `server/` (see [Environment Variables](#-environment-variables)):

```bash
cp .env.example .env
```

Start the backend:

```bash
npm run dev
```

You should see:

```
Server running on port 8000
MongoDB Connected
```

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
npm start
```

App opens at `http://localhost:3000` ✅

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

| Variable         | Description                         | Where to get it                                               |
| ---------------- | ----------------------------------- | ------------------------------------------------------------- |
| `PORT`           | Backend server port (default: 8000) | Set to any free port                                          |
| `MONGO_URI`      | MongoDB Atlas connection string     | Atlas → Connect → Drivers                                     |
| `GEMINI_API_KEY` | Google Gemini API key               | [aistudio.google.com](https://aistudio.google.com/app/apikey) |

> 💡 **Tip for Indian networks:** If `mongodb+srv://` throws `querySrv ECONNREFUSED`, use the **Non-SRV** connection string from Atlas → Connect → Drivers → toggle _"I can't use a DNS SRV connection"_.

---

## 📡 API Reference

Base URL: `http://localhost:8000/api`

| Method   | Endpoint        | Description                           |
| -------- | --------------- | ------------------------------------- |
| `POST`   | `/generate`     | Generate a website from a text prompt |
| `GET`    | `/projects`     | Fetch all saved projects              |
| `GET`    | `/projects/:id` | Fetch a specific project by ID        |
| `DELETE` | `/projects/:id` | Delete a project                      |

### POST `/generate` — Request Body

```json
{
  "prompt": "Create a modern portfolio website with dark theme"
}
```

### Sample Response

```json
{
  "projectId": "664abc123...",
  "type": "static",
  "files": [
    { "name": "index.html", "content": "<!DOCTYPE html>..." },
    { "name": "style.css", "content": "* { box-sizing..." },
    { "name": "script.js", "content": "document.addEventListener..." }
  ]
}
```

---

## ⚙️ How It Works

```
User types prompt
       ↓
Frontend sends POST /generate
       ↓
Backend receives prompt
       ↓
geminiService.js calls Gemini AI API
       ↓
Gemini returns raw file content
       ↓
parseFiles.js extracts individual files
       ↓
Project saved to MongoDB Atlas
       ↓
Files returned to frontend
       ↓
Monaco Editor renders file tree + code
       ↓
Static sites → Live Preview iframe
MERN projects → ZIP download
```

---

## 🧠 AI Prompt Engineering

The backend uses keyword-based intent detection to decide the output type **before** calling Gemini, ensuring the AI is given the right context and constraints.

**Triggers for MERN Stack generation:**

| Keyword                        | Detected Intent             |
| ------------------------------ | --------------------------- |
| `login` / `authentication`     | Needs backend auth routes   |
| `dashboard` / `admin panel`    | Needs protected routes + DB |
| `database` / `CRUD`            | Needs Mongoose models       |
| `API` / `REST`                 | Needs Express endpoints     |
| `register` / `user management` | Needs Users model           |

Everything else defaults to a **Static Website** (HTML + CSS + JS).

---

## 💡 Example Prompts

```
Create a modern portfolio website with dark theme and smooth animations
```

```
Create a responsive food delivery landing page with menu cards
```

```
Create a MERN stack authentication system with login and register
```

```
Create an admin dashboard with sidebar, user table, and CRUD operations
```

```
Create a weather app UI with search bar and animated weather icons
```

---

## 🔒 Limitations

- Live preview supports **static websites only** — MERN projects must be downloaded and run locally
- Extremely large projects may hit **Gemini token output limits**
- Generated MERN code may require minor adjustments for production use
- No user authentication yet — all projects are publicly accessible

---

## 🔮 Future Improvements

- [ ] User authentication & personal project history
- [ ] One-click cloud deployment (Vercel / Render)
- [ ] Real-time AI chat assistant for code refinement
- [ ] Multi-framework support (Vue, Next.js, Django)
- [ ] Live preview for MERN projects (sandboxed environment)
- [ ] Real-time collaboration (multiplayer editing)
- [ ] Project templates library
- [ ] Dark / Light theme toggle
- [ ] Export to GitHub directly

---

## 👨‍💻 Author

**Yash Rajendra Raut**

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

> ⭐ If AI-WebGen saved you hours of work, consider giving it a star on GitHub — it helps a lot!
