# ReArt Events Platform

## Overview

ReArt Events is a comprehensive event management platform that connects artists, venues, and event organizers. The platform provides booking services for artists, sound equipment rental, venue management, and comprehensive event planning services. Built as a full-stack web application with React frontend and Express.js backend, it features real-time chat functionality, admin dashboard, and multi-service booking capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration
- **Build Tool**: Vite for development and production builds
- **Authentication**: Context-based auth provider with session management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express-session with PostgreSQL store
- **Real-time Communication**: WebSocket server for chat functionality
- **File Handling**: Multer for file uploads
- **Payment Processing**: Khalti payment gateway integration with NRS currency
- **API Design**: RESTful API with structured error handling

### Database Schema
- **Users**: Authentication and profile management
- **Artists**: Artist profiles, pricing, and availability
- **Influencers**: Social media influencer profiles and collaboration rates
- **Events**: Event management and scheduling
- **Bookings**: Reservation and booking tracking
- **Payments**: Khalti payment transactions and status tracking
- **Sound Systems**: Equipment rental inventory
- **Venues**: Venue listings and amenities
- **Chat System**: Conversations and messaging
- **Content Management**: Blog posts and testimonials

## Key Components

### Authentication System
- Session-based authentication with secure cookies
- Role-based access control (user/admin)
- Protected routes and middleware
- Admin login system with separate credentials

### Booking Management
- Multi-service booking system (artists, venues, sound equipment)
- Availability checking and conflict resolution
- Pricing calculation and payment tracking
- Booking status management and notifications

### Real-time Chat System
- WebSocket-based chat functionality
- AI-powered chat assistant using OpenAI API
- Admin-user communication channels
- Conversation management and message history

### Admin Dashboard
- Comprehensive management interface
- User, artist, and event administration
- Content management for blog posts and testimonials
- Real-time chat monitoring and support

### Content Management
- Dynamic blog system with rich content
- Testimonial collection and display
- Service page management
- SEO optimization with React Helmet

## Data Flow

### Client-Server Communication
1. **API Requests**: TanStack Query handles caching and synchronization
2. **Authentication**: Session cookies maintain user state
3. **Real-time Updates**: WebSocket connections for chat features
4. **File Uploads**: Multipart form data for image and document uploads

### Database Operations
1. **ORM Layer**: Drizzle provides type-safe database operations
2. **Connection Pooling**: PostgreSQL connection pool for scalability
3. **Migrations**: Schema evolution through Drizzle migrations
4. **Data Validation**: Zod schemas for runtime type checking

### State Management
1. **Server State**: TanStack Query for API data caching
2. **Client State**: React Context for authentication and theme
3. **Form State**: React Hook Form for complex form handling
4. **Real-time State**: WebSocket message handling and state updates

## External Dependencies

### Core Dependencies
- **OpenAI API**: Powers AI chat assistant functionality
- **Database**: PostgreSQL for persistent data storage
- **Session Store**: connect-pg-simple for session persistence
- **Validation**: Zod for schema validation and type safety
- **UI Framework**: Radix UI primitives for accessible components

### Development Tools
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast JavaScript bundling for production
- **Tailwind CSS**: Utility-first styling framework
- **PostCSS**: CSS processing and optimization

### Optional Integrations
- **Replit Integration**: Development environment compatibility
- **Error Handling**: Runtime error overlay for development
- **Code Generation**: Cartographer plugin for Replit

## Deployment Strategy

### Docker Containerization
- **Multi-stage Build**: Optimized production image
- **Database Integration**: PostgreSQL container with persistent volumes
- **Environment Configuration**: Flexible environment variable setup
- **Health Checks**: Container health monitoring and automatic restarts

### Production Configuration
- **Process Management**: Node.js clustering for performance
- **Database Pooling**: Connection pool optimization
- **Static Assets**: Efficient asset serving and caching
- **Security**: Session secrets and secure cookie configuration

### Development Environment
- **Hot Reloading**: Vite development server with HMR
- **Database Seeding**: Automated sample data initialization
- **Environment Variables**: Development-specific configurations
- **Debugging**: Source maps and error tracking

## Changelog

Changelog:
- June 14, 2025. Simplified influencer booking from 4-step wizard to single-page form with direct Khalti payment integration
- June 14, 2025. Completed payment success flow with auto-redirect to home page and visual countdown
- June 14, 2025. Fixed Khalti return URL configuration for proper post-payment navigation
- June 14, 2025. Added payment success toast notifications and enhanced user experience
- June 14, 2025. Enhanced payment test page with real-time status tracking and comprehensive testing instructions
- June 14, 2025. Implemented payment status API endpoints supporting both ID and PIDX lookup for monitoring
- June 14, 2025. Updated Khalti service configuration for test environment compatibility
- June 14, 2025. Fixed Khalti payment flow to match documentation - removed internal authentication requirement, Khalti handles user auth on their platform
- June 14, 2025. Built comprehensive authentication system with login/registration pages for internal platform features
- June 14, 2025. Integrated Khalti payment gateway with NRS currency support
- June 14, 2025. Enhanced influencer system with individual profiles and booking capabilities  
- June 13, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.