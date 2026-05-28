# MERN Portfolio & Blogging Hub

An advanced, feature-rich, full-stack monorepo application designed for showcasing developer projects, managing blog posts, and displaying career achievements. This platform features a high-performance React client powered by Vite and a scalable Node.js/Express.js server integrated with MongoDB and Cloudinary. It includes a secure, interactive Administrative Control Dashboard that allows real-time edits directly through the web interface.

---

## Table of Contents
1. [Core Features](#1-core-features)
2. [System Architecture](#2-system-architecture)
3. [REST API Documentation](#3-rest-api-documentation)
4. [Environment Setup & Configuration](#4-environment-setup--configuration)
5. [Getting Started & Local Execution](#5-getting-started--local-execution)
6. [Technical Implementation Deep Dive](#6-technical-implementation-deep-dive)
7. [Supplementary Documentation](#7-supplementary-documentation)

---

## 1. Core Features

### 🌟 Public Portfolio Interface
- **Dynamic Hero Section**: Interactive introduction featuring a customized typing animation (`react-type-animation`).
- **Interactive Journey Timeline**: A visual chronicle highlighting educational milestones, MCA (Master of Computer Applications) coursework, and software training experiences.
- **Projects Catalog**: Custom showcase with real-time text-based search, category filters, and detailed view pages with integrated Markdown rendering and slide-in image/screenshot carousels.
- **GitHub Integration**: Embeds a live GitHub contribution calendar (`react-github-calendar`) to display open-source activity in real time.
- **Blogging Platform**: Supports publication-grade articles with full GitHub Flavored Markdown (GFM) table support and syntax highlighting for code blocks.
- **Responsive Contact System**: Client-validated contact form that sends notification emails using an SMTP mailer or falls back to server-side mock logging for local verification.
- **Persistent Theme Swapper**: Fluid toggling between Light and Dark modes. Automatically honors operating system preferences (`prefers-color-scheme`) and persists choice using browser `localStorage`.

### 🛡️ Admin Management Console
- **Secure Authentication**: Authentication guarded by token-based JSON Web Tokens (JWT) stored as client-safe `httpOnly` cookies to mitigate XSS vulnerabilities.
- **Dynamic Statistics Board**: Live metrics grid displaying counter summaries of active projects, published blogs, category lists, and recent activity feeds.
- **Project Publisher CRUD**: Interactive interface to create, update, delete, and sort projects, featuring custom multi-image uploaders and Markdown description inputs.
- **Blog Publisher CRUD**: Comprehensive visual blogging engine with a built-in markdown editor, preview screens, tag lists, and publish status controls.
- **Category Manager**: Integrated color picker tool to dynamically define categories with hex codes.
- **Profile & Resume Customizer**: Form inputs to update bio description, skills grid, resume download links, and social links instantly.

---

## 2. System Architecture

### 📂 Directory Structure Overview
```
portfolio-monorepo/
  ├── client/             # Vite + React Frontend Application
  ├── server/             # Express.js + Mongoose Backend Application
  ├── package.json        # Root-level configuration for workspace orchestration
  └── walkthrough.md      # Database schemas, Tailwind configurations, and UI captures
```
*(For a line-by-line file layout of the client-side router files, please see `walkthrough.md`)*

### 🔄 Client-Server Communication
The client communicates with the server via an Axios instance configured with `withCredentials: true`. This allows the server to automatically set and receive secure, signed `httpOnly` cookie credentials in every request. 

### 🗄️ Database & Models
The data layer is managed with Mongoose models mapped to MongoDB Atlas.
- **Admin**: Credentials with Bcrypt password hashing.
- **Profile**: Owner details, skills array, career timeline, and social profiles.
- **Project**: Multi-image attachments, tech stack tags, and category associations.
- **BlogPost**: Articles supporting markdown content, categories, and tags.
- **Category**: Labels with distinct styling color variables.

*(For detailed visual class diagrams of these database tables, refer to Section 2 of `walkthrough.md`)*

### 🚀 Dual File Upload Pipeline
The media pipeline dynamically scales according to the target environment:
- **Production Mode**: Configured using `CloudinaryStorage` and the Cloudinary SDK, files uploaded by the admin are stored on the Cloudinary CDN.
- **Local Dev Mode**: If Cloudinary credentials are omitted or set to mock keys, the system automatically falls back to local disk storage (`server/public/uploads/`) using Multer's `diskStorage`.

---

## 3. REST API Documentation

Here is a list of the core routes exposed by the backend API:

| Route Path | Method | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **`/api`** | `GET` | Public | API health verification check |
| **`/api/auth/login`** | `POST` | Public (Rate Limited) | Validates credentials, issues JWT via HTTP-only cookie |
| **`/api/auth/me`** | `GET` | Protected (Admin) | Returns active admin details using credentials |
| **`/api/auth/logout`** | `POST` | Public | Clears the HTTP-only JWT credential cookie |
| **`/api/profile`** | `GET` | Public | Fetches portfolio owner profile metadata |
| **`/api/profile`** | `PATCH` | Protected (Admin) | Updates profile details, skills, and resume links |
| **`/api/projects`** | `GET` | Public | Retrieves projects, supports search and category filters |
| **`/api/projects/:slug`** | `GET` | Public | Retrieves detailed project details by url slug |
| **`/api/projects/by-id/:id`**| `GET` | Protected (Admin) | Fetches project metadata by its ObjectID |
| **`/api/projects`** | `POST` | Protected (Admin) | Creates a new portfolio showcase project |
| **`/api/projects/:id`** | `PATCH` | Protected (Admin) | Edits an existing project description and assets |
| **`/api/projects/:id`** | `DELETE`| Protected (Admin) | Deletes a project and cleans up remote image resources |
| **`/api/blog`** | `GET` | Public | Fetches published articles list |
| **`/api/blog/:slug`** | `GET` | Public | Fetches complete article contents by slug |
| **`/api/blog/by-id/:id`** | `GET` | Protected (Admin) | Fetches blog details by ObjectID for editor loading |
| **`/api/blog`** | `POST` | Protected (Admin) | Publishes or drafts a new blog post |
| **`/api/blog/:id`** | `PATCH` | Protected (Admin) | Updates blog details, tags, covers, and contents |
| **`/api/blog/:id`** | `DELETE`| Protected (Admin) | Removes blog from database |
| **`/api/categories`** | `GET` | Public | Retrieves all active project categories |
| **`/api/categories`** | `POST` | Protected (Admin) | Adds a new project category label with color |
| **`/api/categories/:id`** | `PATCH` | Protected (Admin) | Modifies category name or color |
| **`/api/categories/:id`** | `DELETE`| Protected (Admin) | Deletes a category |
| **`/api/upload/image`** | `POST` | Protected (Admin) | Uploads single image to target storage |
| **`/api/upload/image/:id`**| `DELETE`| Protected (Admin) | Deletes uploaded image by its public cloud ID |
| **`/api/contact`** | `POST` | Public | Submits contact request, triggers email dispatch |

---

## 4. Environment Setup & Configuration

You will need to configure environment variables for both the backend server and frontend client.

### Backend Configurations (`server/.env`)
Create a file named `.env` inside the `server/` directory and configure the following variables:
```ini
# Server Deployment Configuration
PORT=5000
NODE_ENV=development # Set to production in cloud deployment

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio # Or MongoDB Atlas connection string

# JSON Web Token Secret
JWT_SECRET=your_super_long_unpredictable_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend Origin URL (for CORS setup)
CLIENT_URL=http://localhost:5173

# Optional Cloudinary Configuration (Falls back to local disk if keys are empty/mocked)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional Mail Dispatch Configuration (Prints submissions to console if credentials are empty/mocked)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password_here
```

### Frontend Configurations (`client/.env`)
Create a file named `.env` inside the `client/` directory:
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Getting Started & Local Execution

Follow these step-by-step instructions to get the application up and running locally.

### Step 1: Install Dependencies
A workspace orchestration script is provided in the root `package.json` to install dependencies for the root, frontend, and backend packages concurrently:
```bash
npm run install:all
```

### Step 2: Seed the Database
You can populate the database with default projects, category taxonomies, and the custom profile for Bhushan Ghansham Patil:
```bash
# Navigate to the server folder
cd server

# Run core database seed (sets up admin user, categories, initial projects, and sample blog post)
node src/seed.js

# Run profile-specific seed (populates Bhushan Ghansham Patil's details and experience timeline)
node src/seed-profile.js
```
*Note: The default credentials for the Admin panel configured during seeding are:*
- **Email**: `sharewithbhushan@gmail.com`
- **Password**: `Mayur@bhushan`
*(These can be updated via environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding).*

### Step 3: Run the Development Server
Execute the concurrent startup command in the root folder. This spins up the server on port `5000` and the React dev environment on port `5173`:
```bash
npm run dev
```

### Step 4: Access the Application
- Open the public portfolio at `http://localhost:5173`
- Open the Admin login portal at `http://localhost:5173/admin/login`

---

## 6. Technical Implementation Deep Dive

### 🔑 Security & Session Protection
The authentication flow utilizes secure `httpOnly` cookies:
1. When the admin logs in successfully, the backend creates a signed JWT token containing the user identity.
2. The server returns the JWT inside a cookie header configured with the parameters `httpOnly: true`, `secure: true` (in production), and `sameSite: 'strict'`.
3. Because the cookie is marked `httpOnly`, browser-side scripts cannot access it, preventing token extraction via malicious XSS injections.
4. All admin CRUD routes on the backend check the validity of this cookie via the `verifyToken` middleware.
5. In addition, the login endpoint is protected by a rate limiter (`authLimiter`) allowing a maximum of 20 attempts per 15-minute window from a single IP to block brute-force vectors.

### ✉️ Nodemailer SMTP Dispatch
The contact form uses a nodemailer configuration:
- In production, configure Gmail SMTP with an App Password. The backend creates a nodemailer transporter and forwards messages directly to the administrator address.
- In local development mode, if the credentials are not provided or remain at mock levels, the system intercepts the request and prints the contact message details clearly in the backend terminal logs.

### 🔄 React Query Cache Synchronization
The client handles data validation using TanStack Query:
- When a user reads projects or blog posts, the data is stored in the React Query cache.
- When an administrator modifies a project, writes a blog, or edits profile info:
  - React Query triggers a mutation.
  - Upon mutation success, the application automatically triggers query cache invalidations (e.g. `queryClient.invalidateQueries(['projects'])`).
  - This prompts an instant, background re-fetch, keeping public screens fully in sync without forcing manual page reloads.

---

## 7. Supplementary Documentation

For additional information, please check:
*   [walkthrough.md](file:///home/mayurpatil/Desktop/projects-sprint/portfolio-v2.0/walkthrough.md): View database schemas, styling variable tables, and administrator dashboard captures.
