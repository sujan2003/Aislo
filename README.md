AISLO — Project Setup Guide

**Project Overview**

The Grocery Shopping Assistant is a React-based web app with a Node.js backend that helps users find the best prices for groceries. It uses LangChain for API interactions and Firebase for authentication and a small database.

---

**Setup Instructions**

1. Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js) or **Yarn** (optional)
- **Git**
- **Firebase CLI** (for authentication setup, optional)
- **A GitHub Account**

---

2. Clone the Repository

Run this command in your terminal:

```bash
git clone https://github.com/sujan2003/Aislo.git
```

Navigate into the project folder:

```bash
cd Aislo
```

---

3. Install Dependencies

You need to install dependencies for both the frontend and backend.

1. Backend Setup:

   ```bash
   cd backend
   npm install
   ```

2. Frontend Setup:
   Open a new terminal, navigate to the frontend folder, and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

---

4. Run the Project Locally

Start the Backend Server

From the `backend` folder:

```bash
npm run start
```

The backend will run at `http://localhost:5000`.

Start the Frontend

From the `frontend` folder:

```bash
npm start
```

The React frontend will run at `http://localhost:3000`.

---

5. Environment Variables(Ignore: Haven't setup yet)

You need to create `.env` files for both frontend and backend.

1. Backend (********`backend/.env`********\*\*\*\*\*\*\*\*\*\*\*\*):

   ```
   OPENAI_API_KEY=your-openai-api-key
   FIREBASE_CONFIG=your-firebase-config
   ```

2. Frontend (********`frontend/.env`********\*\*\*\*\*\*\*\*\*\*\*\*):

   ```
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

---

6. Firebase Setup**

If you are working on authentication or database tasks, install Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

More details on Firebase setup will be added later.

---

7. Contributing

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "Added feature: your feature name"
   ```
3. Push your changes to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Create a pull request on GitHub.
