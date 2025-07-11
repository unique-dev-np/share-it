# ShareIt

ShareIt is a modern web application designed for secure and efficient file sharing. It allows users to upload, manage, and share files and buckets of files with various access controls and time-based restrictions.

## Features

*   **User Authentication:** Secure user registration and login.
*   **File Uploads:** Easily upload files with drag-and-drop functionality.
*   **Bucket Management:** Organize files into shareable "buckets" with custom settings.
*   **Access Control:** Set public/private access for files and buckets.
*   **Time-based Expiry:** Configure files and buckets to expire after a set duration.
*   **User Profiles:** Manage user information and view activity.
*   **Responsive Design:** Optimized for various devices.

## Technologies Used

*   **Frontend:** Next.js, React, TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI (based on the `components/ui` directory)
*   **Authentication:** NextAuth.js
*   **Database:** Prisma (ORM) with PostgreSQL (or your chosen database)
*   **File Uploads:** Uploadthing
*   **Deployment:** Vercel (common for Next.js)

## Installation

To get ShareIt up and running on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/shareit.git
    cd shareit
    ```

2.  **Install dependencies:**
    ```bash
    npm install # or yarn install or pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add the following:

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/shareit?schema=public"
    NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
    NEXTAUTH_URL="http://localhost:3000"
    UPLOADTHING_SECRET="YOUR_UPLOADTHING_SECRET"
    UPLOADTHING_APP_ID="YOUR_UPLOADTHING_APP_ID"
    ```
    *   Replace `DATABASE_URL` with your actual database connection string.
    *   Generate a strong `NEXTAUTH_SECRET` (e.g., using `openssl rand -base64 32`).
    *   Get `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` from your Uploadthing dashboard.

4.  **Database Setup:**
    Run Prisma migrations to set up your database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Generate Prisma Client:**
    ```bash
    npx prisma generate
    ```

## Usage

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

[MIT License](LICENSE) - (You might want to create a LICENSE file if you don't have one)