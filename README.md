# 📝 Todo API - DevOps Showcase

This is a simple Todo application backend built with Node.js, showcasing modern DevOps practices using **Docker** and **GitHub Actions** for continuous integration and testing.

---

## 🚀 CI/CD with GitHub Actions

This project uses **GitHub Actions** to automatically run tests and build my application in a Docker container every time I push to the `main` branch.

### 🔁 Workflow Summary

1. **Code is pushed to `main`**
2. GitHub Actions:
   - Checks out my code
   - Builds a Docker image from my code
   - Starts a container from the image
   - Waits for the app to respond
   - Sends test requests to API endpoints using `curl`
   - Stops the container after testing

> ✅ This ensures my code is always **validated** and **container-ready**, reducing human error and improving reliability.

---

## 🐳 Dockerized Application

My application is packaged using a custom `Dockerfile`:

```Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]


This Dockerfile:

Uses a lightweight Node.js image

Installs dependencies

Runs the app on port 3000

This makes my app portable and easy to deploy in any Docker-compatible environment.

📦 Features
RESTful API for managing todos

Create, Read, Update, Delete (CRUD) operations

Dockerized build with Node.js

Automated CI/CD pipeline with GitHub Actions

Health check & endpoint validation during build

🔌 API Endpoints
Method	Endpoint	Description
GET	/	Serves the frontend or root
GET	/api/todos	Fetch all todos
POST	/api/todos	Create a new todo
PUT	/api/todos/:id	Update a todo by ID
DELETE	/api/todos/:id	Delete a todo by ID
GET	/health	Health check endpoint

💻 Running Locally
🧪 Prerequisites
Node.js

Docker (optional but recommended)

🔧 Run with Node

npm install
npm start
App will be live on http://localhost:3000

🐳 Run with Docker

docker build -t todo-api .
docker run -p 3000:3000 todo-api
✅ GitHub Actions Workflow Explained
Here’s what happens in .github/workflows/main.yml:

docker build → Builds my app image

docker run → Starts a container in the background

curl tests:

GET /

GET /api/todos

POST /api/todos

docker stop → Stops the container after validation

This is a simple but effective CI pipeline that checks my app before deployment.

📁 Project Structure

/public             # Frontend (if served)
/server.js          # Main Node.js server
/Dockerfile         # Docker config
/.github/workflows  # GitHub Actions CI/CD