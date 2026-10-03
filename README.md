# AI Live Interview Co-Pilot

An AI-assisted interview platform designed to help interviewers conduct, manage, and evaluate technical interviews more efficiently.

The platform supports interview scheduling, job and candidate management, interview sessions, speech transcription, AI-assisted evaluation, and structured interview reporting. The interviewer remains the final decision-maker throughout the evaluation process.

---

## 📌 About the Project

Technical interviews can involve large amounts of information, including candidate responses, interviewer notes, technical assessments, and evaluation criteria.

**AI Live Interview Co-Pilot** provides a centralized platform where interviewers can manage candidates and interviews while using AI-powered tools to assist with transcription, evaluation, and interview analysis.

The system is designed as a **co-pilot rather than a replacement for human interviewers**. AI-generated information supports the interviewer, while the final hiring decision remains with the human evaluator.

---

## 🎯 Problem

Technical interviews often face challenges such as:

* Inconsistent interview processes
* Difficulty managing multiple candidates and job applications
* Time-consuming interview scheduling
* Manual note-taking and evaluation
* Difficulty organizing candidate responses
* Unstructured interview reports
* Repetitive evaluation tasks

This project addresses these challenges through a unified interview management and AI-assisted evaluation platform.

---

## ✨ Key Features

### 👤 Authentication & User Management

* User registration and login
* Role-based access
* Candidate and interviewer workflows
* Protected application pages

### 💼 Job Management

* Create and manage job openings
* View available jobs
* Candidates can apply for jobs
* Manage job applications

### 👥 Candidate Management

* Candidate applications
* Applicant management
* Candidate dashboards
* Application tracking

### 📅 Interview Management

* Schedule interviews
* Manage interview schedules
* Interview rooms
* Candidate interview sessions

### 🎤 Speech & Transcription

* Audio processing for interview responses
* Speech-to-text functionality
* FFmpeg-based audio processing
* Vosk speech recognition workflow

### 🤖 AI-Assisted Evaluation

* AI-assisted interview analysis
* Candidate evaluation support
* Structured evaluation workflows
* Interview summaries and reports

The AI assists the interviewer rather than making the final hiring decision.

### 📊 Interview Reports

* Interview summaries
* Candidate evaluation information
* Structured interview reports
* Evaluation results

---

## 🏗️ System Architecture

```text
                         AI Live Interview Co-Pilot
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              Web Interface                API / Server
               EJS + CSS                 Node.js + Express
                    │                           │
                    └─────────────┬─────────────┘
                                  │
                         ┌────────┴────────┐
                         │                 │
                      MongoDB          AI Services
                         │                 │
                         │            Gemini AI
                         │
                    ┌────┴─────┐
                    │          │
                Vosk STT    Cloudinary
                    │
                 FFmpeg
```

---

## 🛠️ Technology Stack

### Frontend

* HTML
* CSS
* JavaScript
* EJS

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT
* Multer
* Cookie Parser

### Database

* MongoDB
* Mongoose

### AI

* Google Gemini API

### Speech Processing

* Vosk
* FFmpeg

### Cloud Storage

* Cloudinary

### Testing

* Jest
* Supertest
* Selenium WebDriver
* Google Chrome

### DevOps & CI/CD

* Git
* GitHub
* Docker
* Docker Compose
* Jenkins
* Jenkins Pipeline
* Automated CI testing
* Docker image building
* CI/CD workflow

---

## 👥 User Roles

### Candidate

Candidates can:

* Register and log in
* Browse available jobs
* Apply for jobs
* View applications
* Attend scheduled interviews
* Participate in interview sessions

### Interviewer

Interviewers can:

* Create job openings
* Manage applicants
* Schedule interviews
* Conduct interviews
* Evaluate candidates
* Generate interview reports

---

## 📁 Project Structure

```text
AI_INTERVIEW_PILOT/
│
├── client/
│
├── server/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── views/
│   ├── public/
│   ├── tests/
│   │   ├── server.test.js
│   │   └── selenium/
│   │       └── home.test.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── infra/
│   ├── docker/
│   │   ├── server.Dockerfile
│   │   └── docker-compose.yml
│   │
│   └── github-actions/
│
├── apps/
├── packages/
├── docs/
│
├── Jenkinsfile
├── package.json
└── README.md
```

---

# 🐳 Docker & Containerization

The application uses Docker to provide a consistent runtime environment.

The Docker Compose setup contains:

```text
Docker Compose
      │
      ├── Backend Container
      │     ├── Node.js
      │     ├── Express
      │     └── FFmpeg
      │
      └── MongoDB Container
            └── MongoDB
```

### Backend Dockerization

The backend is packaged into a Docker image using:

```text
infra/docker/server.Dockerfile
```

The image contains:

* Node.js runtime
* Application dependencies
* Express application
* FFmpeg

### MongoDB

MongoDB runs as a separate Docker container with persistent database storage.

### Run with Docker Compose

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

Application:

```text
http://localhost:5001
```

Check containers:

```bash
docker ps
```

Stop the application:

```bash
docker compose -f infra/docker/docker-compose.yml down
```

---

# 🔄 CI/CD Pipeline

The project uses **Jenkins** to automate the Continuous Integration and Continuous Delivery workflow.

The Jenkins pipeline is defined in:

```text
Jenkinsfile
```

### CI/CD Workflow

```text
                    GitHub Repository
                           │
                           ▼
                    Jenkins Pipeline
                           │
                    ┌──────┴──────┐
                    │             │
                 Checkout       Environment
                    │             Check
                    └──────┬──────┘
                           ▼
                    Install Dependencies
                           │
                           ▼
                    Automated Tests
                    ┌──────┴──────┐
                    │             │
                 API Tests     Selenium Tests
                    │             │
                    └──────┬──────┘
                           ▼
                     Docker Build
                           │
                           ▼
                     Docker Image
                           │
                           ▼
                      Deployment
```

### Jenkins Responsibilities

The CI/CD pipeline is intended to automate:

* Source-code checkout
* Environment verification
* Dependency installation
* Automated test execution
* Docker image building
* CI validation
* Deployment workflow

This allows changes pushed to the repository to be validated through an automated pipeline instead of relying entirely on manual testing.

---

# 🧪 Automated Testing

The project includes automated backend/API tests and browser-based UI tests.

Run the tests locally:

```bash
cd server
npm test
```

### API Tests

The API test suite uses **Jest and Supertest**.

Current tests:

1. `GET /` — verifies the InterviewPilot landing page
2. `GET /register` — verifies the registration page
3. `POST /login` — verifies invalid login handling

### Selenium UI Tests

The UI test suite uses **Selenium WebDriver with Chrome**.

Current tests:

4. Home page test

   * Opens the InterviewPilot application
   * Verifies the page title
   * Verifies InterviewPilot content

5. Registration page test

   * Opens the registration page
   * Verifies the name field
   * Verifies the email field
   * Verifies the password field
   * Verifies the role selection

Expected local result:

```text
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
```

---

# 🔐 Environment Configuration

The application uses environment variables for external services and secrets.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The `.env` file must not be committed to GitHub.

Docker provides container-specific configuration such as:

```text
MONGO_URI
PORT
FFMPEG_PATH
```

---

# 🔁 Development Workflow

```text
Developer
    │
    ▼
Git
    │
    ▼
GitHub
    │
    ▼
Jenkins
    │
    ├── Checkout
    │
    ├── Install Dependencies
    │
    ├── Run Automated Tests
    │       ├── API Tests
    │       └── Selenium Tests
    │
    ├── Build Docker Image
    │
    └── Deployment
```

---

## 🔒 Security Considerations

* Environment variables are used for sensitive credentials.
* `.env` files are excluded from version control.
* Authentication uses protected routes and JWT-based authentication.
* Passwords are hashed before storage.
* AI output is treated as assistance rather than an automatic hiring decision.

---

## 🚀 Future Enhancements

* More advanced real-time AI interview assistance
* Expanded candidate analytics
* Improved interviewer dashboards
* Production monitoring and logging
* Expanded automated test coverage
* Cloud deployment
* Improved accessibility and responsive design
* More comprehensive CI/CD deployment automation

---

## 🎯 Product Principle

> **AI should assist the interviewer, not replace the interviewer.**

Every AI-generated insight should support human decision-making. The interviewer remains responsible for reviewing candidate information and making the final evaluation.

---

## 📌 Current Status

The project has progressed from initial planning to an implemented interview-management platform with:

* Authentication
* Job management
* Candidate applications
* Interview scheduling
* Interview sessions
* AI-assisted functionality
* Speech processing
* Interview evaluation
* Interview reporting
* Docker containerization
* MongoDB containerization
* Automated API testing
* Selenium UI testing
* Jenkins CI/CD integration
