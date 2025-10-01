# EduGameHub Frontend

A modern React frontend for the EduGameHub gamified educational platform. This frontend provides an intuitive user interface for students and administrators to interact with the backend API.

## 🎯 Project Overview

This React application serves as the user interface for EduGameHub, allowing students to track their progress, participate in events, earn achievements, and compete on leaderboards. Administrators can manage events, award points, and monitor student progress.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **EduGameHub Backend** running on http://localhost:5000
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edugamehub-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open [http://localhost:5173](http://localhost:5173) in your browser

## 📁 Project Structure

```
edugamehub-frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── AchievementBadge.tsx
│   │   ├── ProgressCard.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── pages/             # Page components
│   │   ├── Index.tsx
│   │   ├── LoginSelection.tsx
│   │   ├── StudentLogin.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFound.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── lib/               # Utility functions
│   │   └── utils.ts
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Frontend entry point
├── public/                # Static assets
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🎨 UI Components

This project uses **shadcn/ui** components built on top of:
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Key Components
- **Authentication Forms** - Login and registration
- **Dashboard Layouts** - Student and admin dashboards
- **Progress Cards** - Visual progress tracking
- **Achievement Badges** - Gamified achievements
- **Data Tables** - Event and user management
- **Charts** - Progress visualization

## 🔐 Authentication Flow

### Student Authentication
1. **Login Selection** - Choose student or admin portal
2. **Student Login** - Email/password authentication
3. **Dashboard Access** - Personalized student dashboard
4. **Progress Tracking** - View points, level, and achievements

### Admin Authentication
1. **Admin Login** - Admin credentials
2. **Admin Dashboard** - Management interface
3. **Event Management** - Create and manage events
4. **User Management** - Monitor student progress

## 📊 Features

### Student Features
- **Progress Tracking** - Academic, sports, and extracurricular progress
- **Achievement System** - Unlock achievements with different rarity levels
- **Event Participation** - Join events and earn points
- **Leaderboards** - Department and college rankings
- **Profile Management** - Update personal information

### Admin Features
- **Event Management** - Create, update, and delete events
- **Achievement Management** - Create and manage achievements
- **User Management** - View and manage student accounts
- **Analytics** - Student progress and engagement metrics
- **Point System** - Award points for various activities

## 🔌 API Integration

The frontend communicates with the backend through a centralized API service:

### API Service Features
- **Centralized Configuration** - Single point for API URL configuration
- **Token Management** - Automatic JWT token handling
- **Error Handling** - Consistent error handling across the app
- **Request/Response Interceptors** - Automatic token attachment and error processing

### Authentication Context
- **State Management** - Centralized authentication state
- **User Data** - Current user information and permissions
- **Login/Logout** - Authentication flow management
- **Token Persistence** - Automatic token storage and retrieval

## 🎯 Key Technologies

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client for API calls

## 🧪 Testing

### Manual Testing
1. **Start Backend** - Ensure EduGameHub backend is running
2. **Start Frontend** - Run `npm run dev`
3. **Test Authentication** - Try login with demo credentials
4. **Test Features** - Navigate through all application features

### Demo Credentials
- **Student**: student@demo.edu / demo123
- **Admin**: admin@demo.edu / admin123

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### Deploy to Netlify
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com/api`

## 🔧 Development

### Adding New Features

1. **Create Components**
   ```bash
   # Add new components in src/components/
   ```

2. **Create Pages**
   ```bash
   # Add new pages in src/pages/
   ```

3. **Update API Service**
   ```bash
   # Add new API methods in src/services/api.ts
   ```

4. **Update Routes**
   ```bash
   # Add new routes in src/App.tsx
   ```

### Code Style

- Use TypeScript for type safety
- Follow React hooks patterns
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

## 📚 Learning Objectives

By working with this frontend, you'll learn:

1. **React Fundamentals**
   - Component architecture
   - Hooks and state management
   - Event handling and forms
   - Conditional rendering

2. **TypeScript**
   - Type definitions
   - Interface design
   - Type safety
   - Generic types

3. **Modern CSS**
   - Tailwind CSS utilities
   - Responsive design
   - Component styling
   - Dark mode support

4. **State Management**
   - Context API
   - Custom hooks
   - State persistence
   - Error boundaries

5. **API Integration**
   - HTTP requests
   - Authentication handling
   - Error management
   - Loading states

6. **Build Tools**
   - Vite configuration
   - TypeScript compilation
   - CSS processing
   - Asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
- Check the troubleshooting section
- Review browser console for errors
- Ensure backend is running
- Check network requests in DevTools

## 🎉 Next Steps

1. **Explore the codebase** - Understand the component structure
2. **Run the application** - Test all features
3. **Modify components** - Customize the UI
4. **Add new features** - Extend functionality
5. **Deploy to production** - Share your application

This frontend provides a solid foundation for building modern React applications with TypeScript and Tailwind CSS!
