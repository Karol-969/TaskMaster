# Reart Events - Event Management & Booking Platform

A full-stack application for event management and booking services. This platform allows users to book artists, influencers, sound systems, venues, and event tickets.

![Reart Events Platform](https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80)

## Features

- **User Authentication**: Register, login, and manage user profiles
- **Booking Services**:
  - Artist Booking
  - Influencer Booking
  - Sound System Rental
  - Venue Booking
  - Event Ticket Purchase
- **Dashboard**:
  - User dashboard for booking history and QR codes
  - Admin dashboard with analytics and management tools
- **QR Code Generation**: For ticket confirmation
- **Responsive Design**: Optimized for both desktop and mobile
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Shadcn UI for component library
- Wouter for routing
- TanStack Query for data fetching
- React Hook Form for form handling

### Backend
- Node.js with Express
- In-memory database (for prototyping)
- JWT Authentication
- RESTful API endpoints

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application at http://localhost:5000

## Default User Accounts

The application comes with pre-configured user accounts for testing:

### Admin User
- Username: admin
- Password: admin123

### Regular User
- Username: user
- Password: user123

## Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express API
- `/shared`: Shared TypeScript types and schemas

## Available Pages

- **Home**: Landing page with services overview
- **Artists**: Browse and book artists
- **Influencers**: Browse and book influencers
- **Sound Systems**: Browse and rent sound equipment
- **Venues**: Browse and book event venues
- **Tickets**: Browse and purchase event tickets
- **Contact**: Contact information and form
- **Dashboard**: User booking management (authenticated users only)
- **Admin**: Administrative tools (admin users only)

## API Endpoints

### Authentication
- `POST /api/auth/register`: Create a new user account
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout
- `GET /api/auth/me`: Get current user information

### Resources
- Artists: `/api/artists`
- Influencers: `/api/influencers`
- Sound Systems: `/api/sound-systems`
- Venues: `/api/venues`
- Events: `/api/events`
- Bookings: `/api/bookings`
- Testimonials: `/api/testimonials`

Each resource follows RESTful conventions with GET, POST, PUT, and DELETE methods.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
