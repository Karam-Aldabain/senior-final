 HireSense AI
 AI-Powered Recruitment & Career Development Platform

HireSense AI is a full-stack web application designed to help job seekers discover relevant opportunities, identify skill gaps, improve their CVs, and prepare for technical interviews using AI-powered features.

The platform connects job seekers and companies through a centralized recruitment system with role-based access, job management, CV analysis, and personalized career guidance.

 Key Features

 Job Seekers
- Browse available job opportunities and view job requirements.
- Upload CVs for skills extraction and analysis.
- Compare extracted skills with job requirements and view matching results.
- Receive personalized recommendations for improving job compatibility.
- Practice mock interviews and receive AI-generated feedback.
- Track job applications.

Companies
- Create and manage job listings.
- Review applicants and their submitted CVs.
- Manage application visibility.

 Administrators
- Review and approve job listings.
- Manage job postings and oversee recruitment activities.

AI-Powered Features

CV Skills Analysis:** Extracts relevant technical skills from uploaded resumes.

Job Matching:** Compares candidate skills against job requirements to identify matches and missing skills.

Career Coaching:** Provides improvement recommendations, learning roadmaps, CV suggestions, and interview preparation guidance.

Mock Interviews:** Generates interview questions and provides feedback on candidate responses.

 Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI Integration | OpenAI SDK |
| File Processing | Multer, pdf-parse |
| Other Tools | Git, GitHub, ESLint, dotenv |

 Project Structure

- `src/` — React application, pages, and reusable components
- `server/` — Backend application, API logic, and database integration
- `public/` — Static assets
- `shared/skills/` — Shared skills-related resources
- `.env.example` — Example frontend configuration
- `server/.env.example` — Example backend configuration

 Getting Started

Prerequisites

- Node.js and npm
- A MongoDB database
- Required environment variables and any AI-service credentials used by the application

 Installation

1. Clone the repository.
2. Run `npm install` in the project root.
3. Open the `server` directory and run `npm install`.
4. Copy `.env.example` to `.env` and `server/.env.example` to `server/.env`.
5. Configure the required environment variables using your own credentials.
6. From the project root, run `npm run server:dev` to start the backend.
7. In a separate terminal, run `npm run dev` to start the frontend.
8. Open the local URL displayed by Vite.

Some AI-powered features require valid external API credentials.

 Environment Configuration

The application uses environment variables for configuration, including the MongoDB connection string, server port, allowed CORS origins, and frontend API base URL.

Real credentials must never be committed to the repository. The example environment files should contain placeholders only.

 Project Background

HireSense AI was developed as a Computer Science senior project at the German Jordanian University.

The project demonstrates practical experience in full-stack development, REST API integration, database-driven applications, role-based workflows, and AI-assisted career tools.

## Disclaimer

This project was developed for academic and portfolio purposes. It is not presented as a production-ready recruitment service.
