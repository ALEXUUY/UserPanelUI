# Business Management Panel

## Overview

This is a comprehensive business management dashboard platform designed for Persian-speaking entrepreneurs and businesses. The system provides a multi-service business management solution including website creation, advertising campaigns, marketing tools, affiliate management, and publishing services. Built as a client-side web application with a responsive design that adapts to both desktop and mobile interfaces.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a **multi-page static website architecture** with client-side JavaScript for interactivity. Key architectural decisions include:

- **Static HTML Pages**: Each major feature (dashboard, website creation, advertising, etc.) has its own dedicated HTML page for clear separation of concerns and better SEO
- **Responsive Design**: Bootstrap 5 framework provides mobile-first responsive design with custom CSS variables for consistent theming
- **Component-Based Navigation**: Shared navigation components (sidebar for desktop, bottom navigation for mobile) across all pages for consistent user experience
- **CSS Custom Properties**: Centralized theming system using CSS variables for easy maintenance and potential theme switching

### Client-Side State Management
The application uses a **local storage-based state management** approach:

- **Class-Based JavaScript Architecture**: Modular JavaScript classes (Auth, Storage, App) handle different aspects of application functionality
- **Local Storage Persistence**: All user data, authentication state, and application settings stored in browser's localStorage
- **No Backend Dependency**: Entirely client-side application that can run without server infrastructure

### Authentication System
**Client-Side Authentication** with the following features:

- **Multiple Login Methods**: Support for email/password and Google OAuth integration
- **Local User Management**: User registration and authentication handled entirely client-side
- **Session Persistence**: Remember me functionality and session management through localStorage
- **Security**: Basic password hashing and validation (note: client-side only, suitable for demo/prototype purposes)

### User Experience Flow
**Business Selection Onboarding** pattern:

- **Initial Business Type Selection**: New users choose their business type (website creation, advertising, marketing, etc.) with associated pricing
- **Progressive Disclosure**: Features unlocked based on user's business type selection
- **Service-Based Navigation**: Dashboard adapts to show relevant tools based on user's chosen business services

### Mobile-First Design
**Adaptive Interface Architecture**:

- **Desktop**: Sidebar navigation with full feature visibility
- **Mobile**: Bottom tab navigation with condensed interface
- **Responsive Breakpoints**: Bootstrap's grid system ensures consistent experience across devices
- **Touch-Friendly**: Mobile interface optimized for touch interactions

### File Organization
**Modular File Structure**:

- **Page Separation**: Each major feature has dedicated HTML file (dashboard.html, advertising.html, etc.)
- **Shared Assets**: Common CSS and JavaScript files for consistency
- **Feature-Specific**: Individual pages can have specific functionality while sharing core components

### Internationalization
**Persian Language Support**:

- **RTL Layout**: Right-to-left text direction support throughout the interface
- **Persian Typography**: Font selections optimized for Persian text rendering
- **Cultural Adaptation**: Interface patterns adapted for Persian-speaking users

## External Dependencies

### CSS Frameworks
- **Bootstrap 5.3.0**: Primary UI framework for responsive design and component library
- **Font Awesome 6.0.0**: Icon library for consistent iconography across the interface

### CDN Dependencies
- **Bootstrap CSS/JS**: Delivered via jsDelivr CDN for reliable global distribution
- **Font Awesome**: Icon fonts delivered via Cloudflare CDN for fast loading

### Browser APIs
- **Local Storage API**: Core dependency for all data persistence and state management
- **File API**: For file upload functionality in various business tools

### Potential Integration Points
The architecture is designed to easily accommodate:

- **Google OAuth**: Authentication integration points already prepared
- **Payment Gateways**: Pricing structure implemented for easy payment system integration
- **Backend API**: Local storage can be easily replaced with REST API calls
- **Database Integration**: User and business data structure prepared for database migration

### Development Dependencies
- **Modern Browser Support**: Requires browsers with ES6+ support and localStorage API
- **No Build Process**: Direct HTML/CSS/JS development without compilation requirements
- **Version Control Ready**: Clean file structure suitable for Git-based development workflows