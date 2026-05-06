# Morpheus 🌙 AI - Project

Morpheus AI is a dream journal web application created for the **MorphTest** project. It allows users to record their dreams, receive AI-powered interpretations, and securely store their personal dream history.

## 🚀 Features

- **AI Dream Analysis**: Users can write their dreams and receive intelligent AI-generated interpretations.
- **User Authentication**: Secure login and registration system using Supabase.
- **Personal Dream History**: Each user can view only their own saved dreams.
- **Clean UI**: Minimal, dark-themed interface designed for a calm and focused experience.
- **Responsive Design**: Works smoothly on both desktop and mobile devices.

## 🌐 Live Demo

👉 [Live App](https://morpheus-ai1-git-main-zabergjam-9458s-projects.vercel.app/)

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **AI Engine**: Hugging Face API
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## ⚙️ How It Works

Users can create an account, log in, and start writing their dreams.  
Each dream is sent to an AI model via the Hugging Face API for analysis, and the result is displayed instantly.  
All dreams are stored securely in the database and linked to the authenticated user.

## 📦 How to Run

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install