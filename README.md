# Secure Task Management App - Dashboard

A modern, secure task management dashboard built with Angular 19 and Tailwind CSS. This application serves as the frontend client, connecting to a NestJS backend API and using Supabase for authentication.

![Dashboard Preview](/Users/femisowemimo/.gemini/antigravity/brain/192e4aa7-8865-4823-9680-71c14753cb53/dashboard_view_1771359903461.png)

## Features

- **Secure Authentication**: integrated with Supabase.
- **Task Management**: efficient task tracking with drag-and-drop Kanban board.
- **Task Analytics**: Real-time bar chart visualization of task progress.
- **Dark / Light Mode**: Full theme support with system synchronization.
- **Keyboard Shortcuts**: Power user navigation (e.g., `N` for new task, `F` for search, `D` for theme toggle).
- **Enhanced Audit Log**: Precise tracking of user actions and resource changes.
- **Responsive Design**: built with Tailwind CSS v4 for a mobile-first experience.
- **Modern Angular**: utilizes the latest Angular 19 features and standalone components.

## Prerequisites

- **Node.js**: v18 or higher recommended.
- **npm**: v10 or higher.
- **Angular CLI**: (Optional) `npm install -g @angular/cli`

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd secure-task-manage-app-angular
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

This project uses Angular environment files for configuration.

1.  **Environment Variables:**
    Copy the `.env.example` file to `.env` for reference on required keys:
    ```bash
    cp .env.example .env
    ```

2.  **Update Environment Files:**
    Update `src/environments/environment.ts` (for development) and `src/environments/environment.prod.ts` (for production) with your specific configuration values.

    **Required settings:**
    - `supabaseUrl`: Your Supabase project URL.
    - `supabaseKey`: Your Supabase anon public key.
    - `apiUrl`: URL of the backend API (e.g., `https://secure-task-manage-backend-api.onrender.com` or local).

## Running the Application

To start the local development server:

```bash
npm start
```

This command will:
1.  Compile Tailwind CSS styles.
2.  Start the Angular development server on `http://localhost:4200/`.

## Building for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

**Unit Tests:**
```bash
npm test
```

## Tech Stack

- **Frontend Framework**: [Angular 19](https://angular.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide Angular](https://lucide.dev/)
- **Package Manager**: npm

## License

This project is licensed under the MIT License.
