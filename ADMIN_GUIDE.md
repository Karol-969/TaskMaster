# Admin Panel Guide for ReArt Events

## Quick Start for Local Deployment

After running `docker-compose up`, the application will be available at `http://localhost:5000` with full admin functionality.

### Admin Access

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

**Admin Panel URLs:**
- Main Dashboard: `http://localhost:5000/admin-dashboard`
- Home Content Management: `http://localhost:5000/admin/home-content`
- Artists Management: `http://localhost:5000/admin/artists`
- Events Management: `http://localhost:5000/admin/events`
- Sound Equipment: `http://localhost:5000/admin/sound-equipment`
- Influencers Management: `http://localhost:5000/admin/influencers`
- Blog Posts: `http://localhost:5000/admin/blog-posts`

## Home Page Content Management

The admin panel allows you to completely customize all sections of the home page:

### Available Sections

1. **Hero Section**
   - Main title and subtitle
   - Background image
   - Call-to-action buttons
   - Description text

2. **Services Section**
   - Service items with icons
   - Descriptions and links
   - Section title

3. **About Section**
   - Company description
   - Section image
   - Statistics display

4. **Journey Section**
   - Timeline items with years
   - Milestone titles and descriptions
   - Company history

5. **Testimonials**
   - Customer reviews
   - Approval/rejection controls
   - Rating system

### How to Update Content

1. **Access Admin Panel:**
   - Go to `http://localhost:5000/admin-dashboard`
   - Login with admin credentials
   - Click on "Home Content" in the navigation

2. **Edit Sections:**
   - Select the tab for the section you want to edit
   - Make your changes in the form fields
   - Click "Save [Section Name]" to apply changes
   - Changes are immediately visible on the live site

3. **Image Uploads:**
   - All sections support image uploads
   - Images are stored in `/public/uploads/` directory
   - Use the image upload components for easy file management

### Timeline Management (Journey Section)

- **Add Timeline Items:** Click "Add Timeline Item" button
- **Edit Items:** Modify year, title, and description fields
- **Remove Items:** Click the trash icon on any timeline item
- **Reorder:** Items display in the order they appear in the admin panel

### Testimonials Management

- **Approval Control:** Toggle approved/pending status
- **Delete Reviews:** Remove inappropriate testimonials
- **View Details:** See customer contact information and submission dates

## Data Persistence

All changes made through the admin panel are:
- ✅ Saved to PostgreSQL database
- ✅ Persistent across container restarts
- ✅ Available immediately on the frontend
- ✅ Backed up with database volume

## API Endpoints

The admin panel uses secure API endpoints:

```
GET    /api/admin/home-content      - Fetch all home content
PUT    /api/admin/home-content/:section - Update specific section
GET/POST/PUT/DELETE /api/admin/testimonials - Manage testimonials
```

All admin endpoints require authentication and admin role verification.

## Security

- Session-based authentication
- Admin role verification
- Secure cookie management
- CORS protection
- Input validation

## Troubleshooting

**Can't Login:**
- Verify credentials: admin / admin123
- Check database connection
- Restart Docker containers if needed

**Changes Not Appearing:**
- Check browser cache (hard refresh)
- Verify save operation completed
- Check console for JavaScript errors

**Database Issues:**
- Restart with: `docker-compose down && docker-compose up`
- Check database logs in container output

For technical support, check the application logs in the Docker container output.