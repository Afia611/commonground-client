# CommonGround

### Different people. Shared purpose.

**CommonGround** is a community-driven volunteering and social service event management platform that connects people with meaningful opportunities to make a difference in their communities.

Users can explore local volunteering opportunities, create and manage social service events, register for activities, and track their participation through a personalized dashboard.

The platform is designed to make community involvement more accessible, organized, and engaging.

## Live Website

**Live Site:** https://commonground-client-tau.vercel.app/

## GitHub Repositories

- **Frontend:** https://github.com/Afia611/commonground-client
- **Backend:** https://github.com/Afia611/commonground-server

## Key Features

1. **User Authentication** — Secure user registration and login using BetterAuth, MongoDB, and JWT-based API authentication.
2. **Explore Volunteering Opportunities** — Browse community service events and view detailed information about each opportunity.
3. **Create Events** — Authenticated users can create volunteering opportunities with relevant event information.
4. **Manage Events** — Event organizers can view, edit, and delete their own events.
5. **Join and Leave Events** — Users can register for available volunteering opportunities and withdraw their participation.
6. **Participation Tracking** — Event capacity and available spots update according to participant registrations.
7. **Personalized Dashboard** — View statistics for created and joined events, with quick access to event management.
8. **My Joined Events** — View volunteering opportunities the user has registered for.
9. **Protected Routes** — Restrict authenticated functionality to signed-in users and preserve access when refreshing protected pages.
10. **Responsive Interface** — A modern, accessible interface designed for desktop, tablet, and mobile screens.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Authentication | BetterAuth, JWT |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git, GitHub |

## Main Pages

| Page | Description |
|---|---|
| `/` | Homepage featuring community volunteering opportunities |
| `/opportunities` | Browse available opportunities |
| `/opportunities/[id]` | Detailed information about an opportunity |
| `/login` | User sign-in |
| `/signup` | User registration |
| `/dashboard` | Personalized user dashboard |
| `/dashboard/joined` | Events joined by the user |
| `/events/create` | Create a new event |
| `/events/manage` | Manage events created by the user |

## How It Works

**For Volunteers**

1. Create an account or sign in.
2. Browse available volunteering opportunities.
3. Open an opportunity to review its details.
4. Join an event with available spots.
5. Track registrations in My Joined Events.
6. Leave an event when necessary.

**For Event Organizers**

1. Sign in to the platform.
2. Create a volunteering opportunity.
3. Provide the event information and capacity.
4. Manage existing events.
5. Edit or delete events when necessary.
6. Monitor created events from the dashboard.

## Getting Started

### Prerequisites

Ensure that you have installed:

- Node.js
- npm
- Git
- Access to the required MongoDB and authentication configuration

### Clone the Frontend

```bash
git clone https://github.com/Afia611/commonground-client.git
cd commonground-client
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the frontend project root.

Configure the environment variables required by your Next.js application, including the backend API URL and authentication settings.

Use the exact variable names referenced in the project's source code.

**Important:** Never commit actual database credentials, JWT secrets, or other sensitive environment values to GitHub.

### Run the Frontend

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Backend Setup

Clone the backend repository:

```bash
git clone https://github.com/Afia611/commonground-server.git
cd commonground-server
```

Install dependencies:

```bash
npm install
```

Configure the backend environment variables in `.env`, including:

```env
PORT=5000
DB_NAME=commonground
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_secure_jwt_secret
```

Also configure the MongoDB connection string and other authentication settings required by the backend.

Start the backend using the development script defined in its `package.json`.

The backend provides REST API endpoints for opportunities, event management, authentication-related authorization, and participation tracking.

## Project Architecture

The application uses a separate frontend and backend architecture.

**Frontend:** Next.js handles the user interface, navigation, forms, dashboards, and authenticated user interactions.

**Backend:** Express.js provides API routes, controllers, business logic, and database operations.

**Database:** MongoDB stores application data, including volunteering opportunities and participation records.

**Authentication:** BetterAuth handles user authentication, while JWT-based authorization protects backend operations.

## Deployment

- **Frontend:** Hosted on Vercel.
- **Backend:** Hosted on Render.
- **Database:** MongoDB Atlas.

The frontend communicates with the deployed backend through configured API endpoints.

## Project Highlights

CommonGround demonstrates practical full-stack development skills, including:

- Responsive frontend development with Next.js and TypeScript
- Authentication and protected application routes
- REST API development using Express.js
- MongoDB database integration
- CRUD operations for community events
- Event registration and participation management
- Personalized dashboards and dynamic UI updates
- Deployment of separate frontend and backend applications

## Future Improvements

- Search and filtering by location or event category
- Volunteer participation history
- Event reminders and notifications
- Organizer and volunteer profiles
- Additional community impact statistics

## Author

**Afia Zahin**

GitHub: https://github.com/Afia611

---

**CommonGround — Different people. Shared purpose.**

*Bringing communities together through meaningful action.*