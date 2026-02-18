
# 🚀 Apidel Monorepo

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A robust meeting scheduling application built with a modern tech stack. This monorepo houses both the frontend client and the backend API, designed for performance and scalability.

## ✨ Features

-   **Authentication**: Secure user registration and login.
-   **Meeting Scheduling**: Create and manage meetings with ease.
-   **Dynamic Availability**: Define and book time slots.
-   **Real-time Validations**: Instant feedback on form inputs and booking conflicts.
-   **Responsive Design**: Optimized for all devices using Tailwind CSS.
-   **Email Integration**: Automated notifications (via Nodemailer & SendGrid).

## 📂 Project Structure

The repository is organized as a monorepo for better code sharing and management:

-   **`apps/web`**: Frontend application built with **Next.js 14**, styled with **Tailwind CSS**. Features **React Toastify** for notifications and **React Icons**.
-   **`apps/http`**: Backend REST API server built with **Express.js**. Uses **Prisma ORM** for type-safe database interactions.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [PostgreSQL](https://www.postgresql.org/) (Database instance running locally or in the cloud)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Install Dependencies

Install all necessary packages for the monorepo:

```bash
npm install
```

### 2. Configure Environment Variables

Navigate to the backend directory and set up your environment variables. You'll need a `.env` file in `apps/http` with your database connection string.

Example `apps/http/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 3. Initialize Database

Run the Prisma migrations to set up your database schema:

```bash
cd apps/http
npx prisma generate
npx prisma db push
```

### 4. Run the Application

You can run both the frontend and backend concurrently from the root directory:

```bash
cd ../..  # Return to root if you are in apps/http
npm run dev
```

-   **Frontend**: Open [http://localhost:3000](http://localhost:3000)
-   **Backend API**: Running at [http://localhost:3001](http://localhost:3001)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
