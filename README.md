# AI Live Interview Co-Pilot

A production-grade SaaS project for technical interviewers, hiring managers, recruiters, and engineering managers.

The product assists interviewers in real time by generating follow-up questions, capturing interview notes, transcribing candidate responses, suggesting rubric-based scores, and producing structured interview summaries. The interviewer remains the decision-maker.

## Problem

Technical interviews often suffer from inconsistent follow-up questions, weak note-taking, interviewer bias, and unstructured candidate evaluation. This project aims to build an AI co-pilot that improves interview quality without replacing human judgment.

## Target Users

- Technical interviewers
- Hiring managers
- Recruiters
- Engineering managers

## Planned Tech Stack

- Frontend: React or Next.js, TypeScript, Tailwind CSS, shadcn/ui, Socket.IO Client
- Backend: Node.js, Express.js, Socket.IO, JWT Authentication, Multer
- Database: MongoDB Atlas, Mongoose
- AI: OpenAI API for follow-ups, summaries, scoring suggestions, and evaluation workflows
- Transcription: Whisper-style speech-to-text workflow
- Storage: Cloudinary for interview recordings
- Deployment: Vercel, Render or Railway, MongoDB Atlas
- Infrastructure: Docker, GitHub Actions, Sentry

## Repository Structure

```txt
apps/
  web/        Frontend application
  api/        Backend API and realtime server
packages/
  shared/     Shared types, constants, and validators
docs/
  product/    Product requirements and MVP scope
  architecture/ System design notes
  decisions/  Architecture decision records
infra/
  docker/     Docker configuration
  github-actions/ CI/CD notes and workflows
```

## Current Status

Day 1: Product planning, MVP scope, user personas, system overview, and architecture decision record.

## Product Principle

AI should assist the interviewer, not replace the interviewer. Every AI-generated insight should be editable, explainable, and auditable.

CI/CD webhook test