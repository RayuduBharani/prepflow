# PrepFlow

PrepFlow is a comprehensive platform designed to help users prepare for technical interviews by providing a variety of resources, including job listings, internships, and DSA (Data Structures and Algorithms) sheets. The platform offers a user-friendly interface and a range of functionalities to enhance the preparation process.

## Description

PrepFlow is built using Next.js and TypeScript, leveraging modern web development practices to deliver a seamless user experience. The platform integrates with various services and libraries to provide a rich set of features, including authentication, data management, and UI components.

## Routes

- `/` - Home page
- `/jobs` - Browse job listings
- `/jobs/[jobview]` - View details of a specific job
- `/internships` - Browse internship listings
- `/internships/[id]` - View details of a specific internship
- `/dsa-sheets` - Browse DSA sheets
- `/dsa-sheets/[...carouselCategory]` - View specific DSA sheet categories
- `/admin/dashboard` - Admin dashboard for managing content
- `/admin/dashboard/jobs` - Admin page for managing job listings
- `/admin/dashboard/internships` - Admin page for managing internship listings

## Functionalities

- **User Authentication**: Secure user authentication using NextAuth.js.
- **Job Listings**: Browse and view detailed information about various job opportunities.
- **Internship Listings**: Browse and view detailed information about various internship opportunities.
- **DSA Sheets**: Access a curated list of DSA problems categorized by topics.
- **Admin Dashboard**: Manage job and internship listings, including adding, editing, and deleting entries.
- **User Progress Tracking**: Track user progress on solving DSA problems.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Search and Filter**: Easily search and filter job and internship listings based on various criteria.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```