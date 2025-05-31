
# Todo API - DevOps Showcase

## 🐳 Dockerfile

```Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### This Dockerfile:
- Uses a lightweight Node.js image
- Installs dependencies
- Runs the app on port 3000  
🔁 This makes my app portable and easy to deploy in any Docker-compatible environment.

---

## 📦 Features
- RESTful API for managing todos  
- Create, Read, Update, Delete (CRUD) operations  
- Dockerized build with Node.js  
- Automated CI/CD pipeline with GitHub Actions  
- Health check & endpoint validation during build

---

## 🔌 API Endpoints

| Method | Endpoint            | Description               |
|--------|---------------------|---------------------------|
| GET    | `/`                 | Serves the frontend or root |
| GET    | `/api/todos`        | Fetch all todos           |
| POST   | `/api/todos`        | Create a new todo         |
| PUT    | `/api/todos/:id`    | Update a todo by ID       |
| DELETE | `/api/todos/:id`    | Delete a todo by ID       |
| GET    | `/health`           | Health check endpoint     |

---

## 💻 Running Locally

### 💢 Prerequisites
- Node.js  
- Docker (optional but recommended)

### 🔧 Run with Node
```bash
npm install
npm start
```
➡️ App will be live at: [http://localhost:3000](http://localhost:3000)

### 🐳 Run with Docker
```bash
docker build -t todo-api .
docker run -p 3000:3000 todo-api
```

---

## ✅ GitHub Actions Workflow Explained

Here’s what happens in `.github/workflows/main.yml`:

- `docker build` → Builds my app image  
- `docker run` → Starts a container in the background  
- `curl` tests:
  - `GET /`
  - `GET /api/todos`
  - `POST /api/todos`
- `docker stop` → Stops the container after validation  

🛠️ This is a simple but effective CI pipeline that checks my app before deployment.

---

## 📁 Project Structure

```
/public             # Frontend (if served)
/server.js          # Main Node.js server
/Dockerfile         # Docker config
/.github/workflows  # GitHub Actions CI/CD
```
