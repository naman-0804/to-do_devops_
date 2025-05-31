# Todo API - DevOps Showcase

🚀 CI/CD & Docker Deployment
This project includes a basic CI/CD pipeline configured using GitHub Actions. Every time code is pushed to the repository, the workflow automatically performs the following steps:

Runs tests against the Node.js HTTP server to ensure the API endpoints are functioning correctly.

Builds a Docker image using a Dockerfile, which sets up a lightweight Node.js environment, installs dependencies, and starts the server.

The app is then ready to be deployed in a containerized environment, exposing it on port 3000 for use.

This setup ensures that the code is always verified and packaged in a consistent environment, reducing deployment errors and making the app portable across different machines and servers.


## Features
- Create, read, update, and delete todos
- RESTful API design
- Dockerized application
- Automated CI/CD pipeline

## API Endpoints
- `GET /` - API information
- `GET /todos` - Get all todos
- `GET /todos/:id` - Get specific todo
- `POST /todos` - Create new todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

## Running Locally
