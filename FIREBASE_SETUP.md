# Firebase Authentication & Role-Based System Setup

## Overview

This project implements a complete Firebase authentication system with role-based access control for DIU (Daffodil International University) students and administrators.

### Features

- **Google Authentication** with DIU email validation (@diu.edu.bd)
- **Role-Based Access Control** (Super Admin, Student)
- **Firestore Database** with security rules
- **Admin Dashboard** for managing teachers, courses, and students
- **Student Dashboard** with teacher search and department selection
- **Firebase Seeding Script** for batch importing data
- **Type-Safe** implementation with TypeScript and Zod validation

## Setup Instructions

### 1. Firebase Project Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in
   - Add your domain to authorized domains
3. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy security rules (see `firestore.rules`)

### 2. Environment Configuration

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

Add your Firebase config from Project Settings:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
DIU_EMAIL_DOMAIN=diu.edu.bd
```

### 3. Deploy Firestore Security Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

Content of `firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super-admin';
    }
    
    function isStudent() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }
    
    function isOwnUser(userId) {
      return request.auth.uid == userId;
    }

    // USERS Collection
    match /users/{userId} {
      allow read: if isAuthenticated() && isOwnUser(userId);
      allow read: if isSuperAdmin();
      allow create: if isAuthenticated() && isOwnUser(userId);
      allow update: if isOwnUser(userId) && 
                       (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']));
      allow update, delete: if isSuperAdmin();
    }

    // TEACHERS Collection
    match /teachers/{teacherId} {
      allow read: if isStudent() && resource.data.approved == true;
      allow read: if isSuperAdmin();
      allow create, update, delete: if isSuperAdmin();
    }

    // COURSES Collection
    match /courses/{courseId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isSuperAdmin();
    }
  }
}
```

### 4. Seed Firebase Database

#### Setup Service Account

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key" and save as `firebase-service-account.json`
3. Place it in your project root directory

#### Run Seeding Script

```bash
# Set environment variable
export FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account.json

# Run seed script
npm run seed
```

The script will:
- Import all teachers from `app/data/teacher.json`
- Import all courses from `app/data/cr.json`
- Prevent duplicate entries
- Auto-approve teachers from JSON
- Create relationships between teachers and courses

## File Structure

```
lib/
├── firebase-config.ts       # Firebase initialization
├── auth-store.ts            # Zustand auth store
├── firestore-service.ts     # Database operations
├── types.ts                 # TypeScript types
└── use-protected-route.ts   # Route protection hook

app/
├── login/page.tsx           # Login page
├── student/
│   ├── layout.tsx           # Student layout
│   ├── dashboard/page.tsx   # Student dashboard
│   └── assignment/page.tsx  # Assignment generator
└── admin/
    ├── layout.tsx           # Admin layout
    ├── page.tsx             # Admin dashboard
    ├── teachers/page.tsx    # Teacher management
    ├── courses/page.tsx     # Course management
    └── students/page.tsx    # Student management

components/
├── auth-initializer.tsx     # Auth state initialization
└── ui/                      # UI components

scripts/
└── seed-firebase.ts         # Firebase seeding script
```

## Database Schema

### Users Collection

```typescript
{
  uid: string;           // Firebase UID
  name: string;         // User's name
  email: string;        // DIU email (@diu.edu.bd)
  role: "student" | "super-admin";
  department?: string;  // SWE, CSE, etc.
  createdAt: string;    // ISO timestamp
  photoURL?: string;    // Google profile photo
}
```

### Teachers Collection

```typescript
{
  name: string;
  designation: string;      // Professor, Associate Prof, etc.
  department: string;       // SWE, CSE
  email?: string;
  phone?: string;
  room?: string;           // Office room number
  approved: boolean;       // Requires admin approval
  courses?: string[];      // Course IDs
  createdAt: string;
  updatedAt: string;
}
```

### Courses Collection

```typescript
{
  courseCode: string;      // e.g., "SWE-101"
  courseTitle: string;     // e.g., "Data Structures"
  department: string;      // SWE, CSE
  teacherId: string;       // Reference to teacher
  teacherName?: string;    // Cached teacher name
  semester?: string;
  createdAt: string;
}
```

## Usage

### For Students

1. **Login**: Click "Sign in with Google" and use your @diu.edu.bd email
2. **Select Department**: Choose between SWE or CSE
3. **Search Teachers**: Find teachers by name or browse all
4. **Select Course**: View courses under selected teacher
5. **Generate PDF**: Create assignment or lab report covers

### For Administrators

1. **Login**: Use super-admin account
2. **Dashboard**: View statistics and quick actions
3. **Manage Teachers**: 
   - Approve pending teachers
   - Edit teacher information
   - Delete teachers
4. **Manage Courses**:
   - Add/edit/delete courses
   - Associate courses with teachers
5. **View Students**:
   - Monitor student registrations
   - Promote students to admin

## Key Features

### Authentication
- Google OAuth 2.0 integration
- DIU email domain validation
- Automatic user creation on first login
- Persistent auth state with Zustand

### Route Protection
- Protected routes based on user role
- Automatic redirects for unauthorized access
- Loading states for auth initialization

### Data Validation
- Zod schema validation
- React Hook Form integration
- Custom error messages

### Error Handling
- Toast notifications for user feedback
- Comprehensive error logging
- Graceful fallbacks

### Performance
- Efficient Firestore queries
- Batch write operations
- Debounced search
- Lazy loading

## API Endpoints

All data operations use Firestore directly via `firestore-service.ts`:

```typescript
// Users
getUserByEmail(email)
updateUserDepartment(uid, department)
promoteUserToAdmin(uid)
getAllStudents()

// Teachers
getAllTeachers()
getApprovedTeachers(department?)
searchTeachers(searchTerm, department?)
addTeacher(teacher)
updateTeacher(id, updates)
approveTeacher(id)
deleteTeacher(id)

// Courses
getCoursesByTeacher(teacherId)
addCourse(course)
updateCourse(id, updates)
deleteCourse(id)
getAllCourses()

// Batch Operations
batchImportTeachers(teachers)
batchImportCourses(courses)

// Statistics
getStats()
```

## Troubleshooting

### Auth Issues

**"Only DIU student email accounts are allowed"**
- Make sure you're using a @diu.edu.bd email
- Check `DIU_EMAIL_DOMAIN` in `.env.local`

**User not persisting after refresh**
- Check Firebase config in `.env.local`
- Ensure `AuthInitializer` is in root layout
- Check browser console for errors

### Database Issues

**Collections not appearing in Firestore**
- Verify security rules are deployed
- Check your project ID matches `.env.local`
- Try seeding data: `npm run seed`

**Seeding fails**
- Ensure `firebase-service-account.json` is valid
- Check `app/data/teacher.json` exists
- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable is set

### Deployment

**Vercel Deployment**
- Add environment variables in Vercel dashboard
- Ensure API key is configured as public (`NEXT_PUBLIC_`)
- Deploy security rules separately via Firebase CLI

**Self-Hosted**
- Configure CORS for your domain in Firebase
- Ensure all env vars are set
- Test auth flow thoroughly

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Seed database
npm run seed

# Deploy to Vercel
vercel deploy
```

## License

This project is created for DIU students by Mohammad Ali Nayeem.
