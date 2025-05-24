# PDF Guide

A Next.js application for merging PDF files with a freemium model. Users get 2 free merges and can upgrade to a premium plan or pay per merge for additional merges.

## Features

- PDF merging with pdf-lib
- Drag and drop file upload
- Authentication with Clerk
- Freemium model with 2 free merges
- Premium subscription option
- Pay-per-merge option
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
4. If you've used your free merges, you'll be prompted to upgrade to premium or pay for a single merge

## Freemium Model

- All users get 2 free PDF merges
- After using the free merges, users can:
  - Upgrade to a premium plan for unlimited merges ($9.99)
  - Pay for a single merge ($1.99)

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
- `/api/merge/pay`: Process a payment for a single merge
- `/api/upgrade`: Upgrade a user to premium

## License

This project is licensed under the MIT License.
