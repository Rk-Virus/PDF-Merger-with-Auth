# PDF Guide

A Next.js application for merging PDF files with a freemium model. Users can merge files after creating a free account.

## Features

- PDF merging with pdf-lib
- Drag and drop file upload
- Authentication with Clerk
- MongoDB for storing user data and merge transactions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Clerk account for authentication

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Copy the `.env.local.example` file to `.env.local` and fill in your environment variables
   ```bash
   cp .env.local.example .env.local
   ```
4. Start the development server
   ```bash
   npm run dev
   ```

### Environment Variables

The following environment variables are required:

- `CLERK_SECRET_KEY`: Your Clerk secret key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_WEBHOOK_SECRET`: Your Clerk webhook secret
- `MONGODB_URI`: Your MongoDB connection string
- `NEXT_PUBLIC_APP_URL`: The URL of your application

## Usage

1. Sign up or log in using Clerk authentication
2. Upload PDF files by dragging and dropping or using the file picker
3. Click the "Merge PDFs" button to combine the files

## Development

### Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: React components
- `/context`: React context providers
- `/lib`: Utility functions and database connections
- `/public`: Static assets

### API Routes

- `/api/merge/check`: Check if a user can merge PDFs
- `/api/merge/record`: Record a merge transaction
  
## License

This project is licensed under the MIT License.
