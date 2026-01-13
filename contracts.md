# API Contracts & Integration Plan

## Current Mock Data (Frontend)
Located in: `/app/frontend/src/data/mockData.js`

### Mocked Data:
1. **Projects** - 6 sample projects with images
2. **Testimonials** - 4 client testimonials
3. **Abilities** - 6 service offerings (static, no backend needed)
4. **Tech Stack** - Technology list (static, no backend needed)
5. **Contact Form** - Form submission (not saved)

## Backend Models

### 1. Project Model
```python
{
    "id": "auto-generated",
    "title": "string",
    "description": "string",
    "category": "string (Web Development | Mobile Development)",
    "technologies": ["string array"],
    "image": "string (file path or URL)",
    "link": "string (optional)",
    "created_at": "datetime"
}
```

### 2. Testimonial Model
```python
{
    "id": "auto-generated",
    "name": "string",
    "role": "string",
    "content": "string",
    "rating": "integer (1-5)",
    "avatar": "string (file path or URL)",
    "created_at": "datetime"
}
```

### 3. Contact Submission Model
```python
{
    "id": "auto-generated",
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "status": "string (new | read | replied)",
    "created_at": "datetime"
}
```

### 4. Admin User Model
```python
{
    "id": "auto-generated",
    "username": "string",
    "email": "string",
    "password_hash": "string (hashed)",
    "created_at": "datetime"
}
```

## API Endpoints

### Public Endpoints (No Auth Required)

#### Projects
- `GET /api/projects` - Get all projects (with optional category filter)
- `GET /api/projects/{id}` - Get single project

#### Testimonials
- `GET /api/testimonials` - Get all testimonials

#### Contact
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Auth Required)

#### Authentication
- `POST /api/admin/login` - Admin login (returns JWT token)
- `POST /api/admin/logout` - Admin logout

#### Projects Management
- `POST /api/admin/projects` - Create new project (with image upload)
- `PUT /api/admin/projects/{id}` - Update project
- `DELETE /api/admin/projects/{id}` - Delete project

#### Testimonials Management
- `POST /api/admin/testimonials` - Create testimonial (with avatar upload)
- `PUT /api/admin/testimonials/{id}` - Update testimonial
- `DELETE /api/admin/testimonials/{id}` - Delete testimonial

#### Contact Management
- `GET /api/admin/contacts` - Get all contact submissions
- `GET /api/admin/contacts/{id}` - Get single submission
- `PUT /api/admin/contacts/{id}` - Update status (mark as read/replied)
- `DELETE /api/admin/contacts/{id}` - Delete submission

#### File Upload
- `POST /api/admin/upload` - Upload image file (returns file URL)

## File Upload Strategy

### Storage Location
- Files stored in: `/app/backend/uploads/`
- Subdirectories: `projects/`, `testimonials/`
- Served statically via FastAPI

### File Handling
- Accept: images (jpg, jpeg, png, webp, gif)
- Max size: 5MB per file
- Generate unique filenames (UUID + extension)
- Return public URL for frontend access

## Frontend Integration

### Files to Update

1. **Projects Section** (`/app/frontend/src/components/ProjectsSection.jsx`)
   - Remove mock import
   - Add API call to `GET /api/projects`
   - Handle loading and error states

2. **Testimonials Section** (`/app/frontend/src/components/TestimonialsSection.jsx`)
   - Remove mock import
   - Add API call to `GET /api/testimonials`
   - Handle loading and error states

3. **Contact Form** (`/app/frontend/src/components/ContactSection.jsx`)
   - Update form submission to call `POST /api/contact`
   - Show success/error messages
   - Store submission in database

4. **Admin Dashboard** (New)
   - Create admin routes: `/admin/login`, `/admin/dashboard`
   - Implement protected routes with JWT
   - Build CRUD interfaces for projects and testimonials
   - Create contact submissions viewer

## Admin Dashboard Features

### Pages:
1. **Login Page** - Authentication
2. **Dashboard Overview** - Stats (total projects, testimonials, contacts)
3. **Projects Management** - List, Create, Edit, Delete with image upload
4. **Testimonials Management** - List, Create, Edit, Delete with avatar upload
5. **Contact Submissions** - View and manage enquiries

### Components:
- Admin Navbar with logout
- Data tables with actions
- Forms with file upload
- Image preview
- Confirmation modals for delete

## Authentication Flow

1. Admin logs in with username/password
2. Backend validates credentials, returns JWT token
3. Frontend stores token in localStorage
4. All admin API calls include token in Authorization header
5. Backend validates token on each request
6. Token expires after 24 hours

## Security Measures

- Password hashing with bcrypt
- JWT token validation
- File type validation for uploads
- File size limits
- CORS configuration
- Admin routes protected with middleware

## Database Collections

MongoDB collections:
- `projects`
- `testimonials`
- `contacts`
- `admins`

## Initial Setup

Create default admin user:
- Username: admin
- Email: admin@sbdevstudio.com
- Password: Admin@123 (should be changed after first login)
