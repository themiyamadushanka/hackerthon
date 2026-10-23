# AidLink AI - Hackathon Project

AidLink is an AI-powered humanitarian response coordination platform featuring a **Next.js** frontend and a **Python Flask** backend.

---

## 🚀 Quick Start for Developers

When cloning or getting this project onto a new laptop, follow these steps:

### 1. Prerequisites
- **Node.js**: v18+ ([Download Node.js](https://nodejs.org/))
- **Python**: 3.10+ ([Download Python](https://www.python.org/))

---

### 2. One-Command Setup
From the project root directory, run:

```bash
npm run install:all
```

*(This installs root npm packages, frontend dependencies, and Python backend packages).*

Or install manually:
```bash
# 1. Root dependencies
npm install

# 2. Frontend dependencies
cd frontend && npm install && cd ..

# 3. Python backend dependencies
pip install -r requirements.txt
```

---

### 3. (Optional) Configure Environment Variables
Copy `.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```
Add your `GEMINI_API_KEY` in `backend/.env`.  
*(If omitted, AidLink operates using its built-in offline NLP engine).*

---

### 4. Run Both Frontend and Backend Concurrently
From the project root:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

On Windows, you can also double-click [`run.bat`](run.bat) or execute [`run.ps1`](run.ps1).
