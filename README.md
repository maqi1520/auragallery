# AuraGallery

AuraGallery is a visually stunning, minimalist photo wall application designed for users to share and manage their photographic moments. The application features a clean, responsive grid layout that elegantly showcases photos. Users can authenticate using a mock Google login system, upload new photos by providing an image URL, and delete their own contributions. The entire experience is built with a focus on visual excellence, featuring smooth animations, subtle micro-interactions, and a sophisticated, modern design aesthetic. The backend is powered by a Cloudflare Worker and a single Durable Object for state management, providing a fast and scalable foundation.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/maqi1520/auragallery)

## ✨ Key Features

- **Mock User Authentication**: Simple login/logout system to simulate user sessions.
- **Photo Upload**: Logged-in users can add new photos to the gallery via image URL.
- **Dynamic Photo Wall**: A beautiful, responsive grid that displays all photos in reverse chronological order.
- **Ownership & Permissions**: Users can only delete photos that they have uploaded.
- **Modern UI/UX**: Built with a focus on visual excellence, featuring smooth animations, hover effects, and a clean, dark-mode-first design.
- **Serverless Backend**: Powered by Hono on Cloudflare Workers for a fast, scalable, and reliable API.
- **Persistent State**: Utilizes a single Cloudflare Durable Object for all data storage, ensuring consistency.

## 🛠️ Technology Stack

- **Frontend**:
  - [React](https://react.dev/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/)
  - [Zustand](https://zustand-demo.pmnd.rs/) for state management
  - [Framer Motion](https://www.framer.com/motion/) for animations
  - [Lucide React](https://lucide.dev/) for icons
- **Backend**:
  - [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
- **Storage**:
  - [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- **Language**:
  - [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/auragallery.git
    cd auragallery
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite frontend development server and the Wrangler development server for the backend worker simultaneously.
    ```bash
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## 💻 Development

The project is structured into two main parts:

-   `src/`: Contains the React frontend application.
-   `worker/`: Contains the Hono backend running on a Cloudflare Worker.

### Frontend

The frontend is a standard Vite + React application. Components are located in `src/components`, pages in `src/pages`, and state management stores in `src/stores`.

### Backend

The backend API is built with Hono. To add or modify API endpoints, edit the `worker/user-routes.ts` file. The core logic for data persistence using Durable Objects is abstracted in `worker/core-utils.ts` and `worker/entities.ts`.

## ☁️ Deployment

This project is designed for easy deployment to Cloudflare Pages and Workers.

1.  **Build the project:**
    This command builds the frontend application and the worker.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    The `deploy` script in `package.json` handles the deployment process using the Wrangler CLI.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/maqi1520/auragallery)

## 📜 Available Scripts

-   `bun dev`: Starts the local development server for both frontend and backend.
-   `bun build`: Builds the production-ready application.
-   `bun lint`: Lints the codebase using ESLint.
-   `bun deploy`: Deploys the application to Cloudflare.