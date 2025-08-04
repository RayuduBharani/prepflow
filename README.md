
# PrepFlow

PrepFlow is a comprehensive platform designed to help users prepare for technical interviews by providing a variety of resources, including job listings, internships, DSA (Data Structures and Algorithms) sheets, a built-in code compiler, and companywise DSA questions. The platform offers a user-friendly interface and a range of functionalities to enhance the preparation process.


<!-- ## Description

PrepFlow is built using Next.js and TypeScript, leveraging modern web development practices to deliver a seamless user experience. The platform integrates with various services and libraries to provide a rich set of features, including authentication, data management, UI components, and an online code compiler. It also offers companywise DSA questions to help users target their preparation for specific companies. -->

## Why We Built This

As students passionate about web development and technical growth, we (Rayudu Bharani and Ashok Atragadda) built **PrepFlow** to solve a real problem we faced during our own preparation: scattered resources, lack of structure, and the absence of a unified platform to prepare for internships and full-time roles.

PrepFlow is our solution—a centralized, beginner-friendly hub that offers:

- Curated DSA sheets to practice with focus.
- Company-specific DSA questions to prepare with intent.
- Internship and job listings to explore opportunities.
- A built-in code compiler to instantly run and test logic.
- Admin tools to keep the platform fresh and updated.

We built this not just as a project, but as a platform that **we wish we had when we started our journey**—and now we're sharing it with every aspiring developer who needs a better way to prepare.



## Routes

- `/` - Home page
- `/jobs` - Browse job listings
- `/jobs/[jobview]` - View details of a specific job
- `/internships` - Browse internship listings
- `/internships/[id]` - View details of a specific internship
- `/dsa-sheets` - Browse DSA sheets
- `/dsa-sheets/[...carouselCategory]` - View specific DSA sheet categories
- `/companies` - Browse companywise DSA questions
- `/compiler` - Online code compiler for practicing coding problems
- `/admin/dashboard` - Admin dashboard for managing content
- `/admin/dashboard/jobs` - Admin page for managing job listings
- `/admin/dashboard/internships` - Admin page for managing internship listings


## Features

- **User Authentication**: Secure user authentication using NextAuth.js.
- **Job Listings**: Browse and view detailed information about various job opportunities.
- **Internship Listings**: Browse and view detailed information about various internship opportunities.
- **DSA Sheets**: Access a curated list of DSA problems categorized by topics.
- **Companywise DSA Questions**: Practice DSA questions asked by specific companies to target your preparation.
- **Online Compiler**: Write, run, and test code directly in the browser for supported languages.
- **Admin Dashboard**: Manage job and internship listings, including adding, editing, and deleting entries.
- **User Progress Tracking**: Track your progress on solving DSA problems.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Search and Filter**: Easily search and filter job and internship listings based on various criteria.


## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in the required values (e.g., database URL, NextAuth secrets).

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Next.js Server Actions, Express.js, Prisma ORM with PostgreSQL (or your preferred DB)
- **Authentication:** NextAuth.js
- **Other:** ESLint

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request.


## Authors

- **Ashok Atragadda** – Creator of PrepFlow  
  - GitHub: [@AshokAtragadda](https://github.com/cygnuxxs)  
  - LinkedIn: [Ashok Atragadda](https://www.linkedin.com/in/ashok-atragadda/)
  
- **Rayudu Bharani Satya Siva Durga Prasad** – Creator of PrepFlow  
  - GitHub: [@RayuduBharani](https://github.com/RayuduBharani)  
  - LinkedIn: [Rayudu Bharani](https://www.linkedin.com/in/rayudu-bharani/)


## License

This project is licensed under the MIT License.