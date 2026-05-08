# BSSE Curriculum & Teacher Seeding Guide

## Overview
This guide explains how to seed the database with:
- **142 Software Engineering courses** from the complete BSSE (Bachelor of Science in Software Engineering) curriculum
- **20+ SWE department teachers** from teacher.json

## Files Created/Updated

### 1. **app/data/curriculum.json** (NEW)
Complete BSSE curriculum with all 8 semesters:
- **1st Semester**: Computer Fundamentals, Intro to SE, Mathematics, English, Philosophy (6 courses)
- **2nd Semester**: Structured Programming, Discrete Math, Digital Electronics (7 courses)
- **3rd Semester**: Data Structures, OOP, Architecture, Statistics (7 courses)
- **4th Semester**: Algorithms, DB Systems, OS & System Programming (9 courses)
- **5th Semester**: Networking, QA & Testing, Design Patterns (8 courses)
- **6th Semester**: Web Applications, Software Architecture, AI, ML (8 courses)
- **7th Semester**: Capstone Projects, Embedded Systems, Cyber Security, Data Science (10 courses)
- **8th Semester**: Professional Ethics, Numerical Analysis, HCI (3 courses)

**Total Credits**: 116-120 Theory + 25-29 Lab = 145 credits

### 2. **scripts/seed-firebase.ts** (UPDATED)
Enhanced with:
- **SWE Department Filter**: Only seeds teachers with `dep: "SWE"` from teacher.json
- **Curriculum Support**: Loads all courses from curriculum.json instead of cr.json
- **Round-Robin Assignment**: Distributes 142 courses among available SWE teachers
- **Batch Processing**: Uses Firestore batch writes for efficient seeding

## Prerequisites

### 1. Firebase Service Account Key
Get from Firebase Console:
```
1. Go to Firebase Console → Your Project
2. Project Settings → Service Accounts tab
3. Click "Generate New Private Key"
4. Save as `firebase-service-account.json` in project root
```

### 2. Environment Variables
Ensure `.env.local` has:
```env
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account.json
```

## Seeding Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Download Service Account Key
- Go to Firebase Console
- Download private key and save as `firebase-service-account.json` in project root

### Step 3: Run Seeding Script
```bash
npm run seed
```

### Expected Output
```
🚀 Starting Firebase seeding...

🌱 Starting teacher seeding...
✅ Added teacher: Dr. Imran Mahmud
✅ Added teacher: Dr. Md Fazla Elahe
... (20+ more teachers)
✨ Teacher seeding completed: 20 added, 0 skipped

🌱 Starting course seeding...
✅ Added course: SE 111 (Computer Fundamentals) → Dr. Imran Mahmud
✅ Added course: SE 112 (Computer Fundamentals Lab) → Dr. Md Fazla Elahe
... (142 courses total)
✨ Course seeding completed: 142 added, 0 skipped

✨ All seeding completed successfully!
```

## What Gets Seeded

### Teachers (SWE Department)
- **Designation**: Professor, Associate Professor, Assistant Professor
- **Status**: Auto-approved
- **Department**: SWE
- **Fields**: Name, Email, Phone, Office Room, Employee ID

**Example Teachers**:
1. Dr. Imran Mahmud (Professor & Head)
2. Dr. Md Fazla Elahe (Assistant Professor & Associate Head)
3. Dr. A. H. M. Saifullah Sadi (Professor)
4. A.H.M Shahariar Parvez (Associate Professor)
... and 16+ more

### Courses (142 Total)
Each course includes:
- **Course Code** (e.g., SE 111)
- **Title** (e.g., Computer Fundamentals)
- **Category** (CORE, LAB, MAJOR, PGC, GED, etc.)
- **Credits** (Theory and/or Lab)
- **Prerequisites** (array of course codes)
- **Teacher Assignment** (round-robin from SWE teachers)
- **Department**: SWE
- **Semester**: 1st through 8th

**Course Categories**:
- `CORE`: Software Engineering Core courses
- `LAB`: Laboratory courses
- `LAB-P`: Lab-based project courses
- `PGC`: Preparatory General Core
- `GED`: General Education
- `MAJOR`: Major-specific courses (RE, CS, DS)
- `PRO-THE`: Final Year Project/Thesis

## Firestore Collections After Seeding

### Teachers Collection
```javascript
{
  id: "teacher_doc_id",
  name: "Dr. Imran Mahmud",
  designation: "Professor & Head",
  email: "imranmahmud@daffodilvarsity.edu.bd",
  phone: "01711370502",
  room: "607",
  department: "SWE",
  approved: true,
  courses: [],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Courses Collection
```javascript
{
  id: "course_doc_id",
  courseCode: "SE 111",
  courseTitle: "Computer Fundamentals",
  category: "CORE",
  department: "SWE",
  teacherId: "teacher_doc_id",
  teacherName: "Dr. Imran Mahmud",
  semester: "1st",
  prerequisite: null,
  theory_credit: 3,
  lab_credit: null,
  createdAt: Timestamp
}
```

## Duplicate Prevention

The seeding script:
- **Skips duplicate teachers**: Checks for existing name + email combination
- **Skips duplicate courses**: Checks for existing course code (global, not per-teacher)
- **Safe to re-run**: Won't create duplicates if you run `npm run seed` multiple times

## Teacher Load Distribution

With round-robin assignment:
- **20 teachers** × **142 courses** = ~7 courses per teacher on average
- Ensures balanced workload across faculty

## Troubleshooting

### Error: "FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set"
**Solution**: Make sure `firebase-service-account.json` exists in project root
```bash
ls firebase-service-account.json
```

### Error: "Permission denied" or "Cannot read file"
**Solution**: Check file permissions
```bash
chmod 644 firebase-service-account.json
```

### Error: "No SWE teachers found"
**Solution**: Teachers weren't seeded. Run `npm run seed` again

### Error: Timeout or "PERMISSION_DENIED"
**Solution**: Check Firestore security rules and service account permissions
- Verify service account has "Editor" or "Firestore Editor" role
- Check Firestore rules allow writes to teachers and courses collections

## Viewing Seeded Data

### Firebase Console
1. Go to Firebase Console → Your Project
2. Firestore Database
3. View `teachers` collection → See 20+ documents
4. View `courses` collection → See 142 documents

### In Your App
After seeding:
1. Login as student: Visit `/student/dashboard`
2. Select department: Should see courses in that department
3. Visit `/student/mycourses`: See all 142 courses loaded
4. Login as super-admin: Visit `/admin/teachers` and `/admin/courses`

## Next Steps

1. ✅ Create curriculum.json with 142 courses
2. ✅ Create seeding script with teacher filtering
3. 🔄 Run: `npm run seed`
4. 🔄 Verify courses appear in student dashboard
5. 🔄 Test course filtering by department
6. 🔄 Deploy to production with seeded data

## Performance Notes

- **Seeding time**: ~30-60 seconds (depends on network)
- **Batch size**: Uses Firestore batch writes (max 500 per batch)
- **Memory**: ~5-10 MB for 142 courses + 20 teachers
- **Network**: ~200-300 KB upload to Firestore

## Additional Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Service Account Setup](https://firebase.google.com/docs/database/service-account-java)
- [BSSE Curriculum Details](./app/data/curriculum.json)
- [Teacher Database](./app/data/teacher.json)
