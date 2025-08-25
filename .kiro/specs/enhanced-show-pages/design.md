# Design Document

## Overview

This design transforms the community clubs and business units show pages into engaging landing page-style layouts with comprehensive data management. The solution includes database schema enhancements, admin panel updates, and modern frontend components that create immersive user experiences.

## Architecture

### Database Layer
- Enhanced models with additional fields for rich content
- Proper relationships for galleries, testimonials, and team members
- Migration files for seamless database updates
- Separate testing database configuration

### Backend Layer
- Updated controllers with new CRUD operations
- Enhanced Inertia responses with additional data
- Comprehensive validation rules
- Pest test suite with SQLite testing database

### Frontend Layer
- Landing page-style React components
- Responsive design with modern UI patterns
- Interactive sections with smooth animations
- Enhanced admin forms for content management

## Components and Interfaces

### Database Schema Enhancements

#### Community Clubs Additional Fields
```sql
- gallery_images (JSON) - Array of image URLs for photo gallery
- testimonials (JSON) - Array of member testimonials with name, content, role, image
- social_media_links (JSON) - Social media platform links
- founded_year (INTEGER) - Year the community was founded
- member_count (INTEGER) - Approximate number of members
- upcoming_events (JSON) - Array of upcoming events with date, title, description, image
- achievements (JSON) - Array of community achievements and milestones
- hero_subtitle (TEXT) - Additional subtitle for hero section
- hero_cta_text (VARCHAR) - Custom call-to-action button text
- hero_cta_link (VARCHAR) - Custom call-to-action button link
```

#### Community Club Activities Enhancement
```sql
- activities table enhancement with detailed fields:
  - title (VARCHAR) - Activity name
  - description (TEXT) - Detailed activity description
  - image (VARCHAR) - Activity image URL
  - duration (VARCHAR) - Activity duration/schedule
  - max_participants (INTEGER) - Maximum number of participants (optional)
  - requirements (TEXT) - Prerequisites or requirements (optional)
  - benefits (JSON) - Array of activity benefits
```

#### Business Units Additional Fields
```sql
- team_members (JSON) - Array of team member profiles with name, role, bio, image, social_links
- client_testimonials (JSON) - Array of client testimonials with name, company, content, image, rating
- portfolio_items (JSON) - Array of portfolio/case studies with title, description, image, technologies, client
- certifications (JSON) - Array of certifications with name, issuer, date, image, description
- company_stats (JSON) - Key statistics like years in business, projects completed, clients served
- gallery_images (JSON) - Company/office photo gallery
- achievements (JSON) - Awards and recognitions with date, title, description, image
- core_values (JSON) - Company core values with title, description, icon
- hero_subtitle (TEXT) - Additional subtitle for hero section
- hero_cta_text (VARCHAR) - Custom call-to-action button text
- hero_cta_link (VARCHAR) - Custom call-to-action button link
```

#### Business Unit Services Enhancement
```sql
- services table enhancement with detailed fields:
  - title (VARCHAR) - Service name
  - description (TEXT) - Detailed service description
  - image (VARCHAR) - Service image URL
  - price_range (VARCHAR) - Price range or starting price
  - duration (VARCHAR) - Service delivery timeframe
  - features (JSON) - Array of service features
  - technologies (JSON) - Technologies or tools used
  - process_steps (JSON) - Step-by-step service process
```

### Frontend Component Structure

#### Landing Page Layout Sections
1. **Hero Section** - Enhanced with background image, compelling headline, and CTA
2. **Features/Services Section** - Grid layout showcasing key offerings
3. **Gallery Section** - Image carousel or grid for visual content
4. **Testimonials Section** - Rotating testimonials with member/client feedback
5. **Team/Community Section** - Profiles and member information
6. **Achievements Section** - Awards, milestones, and statistics
7. **Events/Portfolio Section** - Upcoming events or portfolio showcase
8. **Contact/CTA Section** - Enhanced contact information and call-to-action

#### Component Architecture
```
PublicLayout
├── HeroSection
├── FeaturesSection
├── GallerySection
├── TestimonialsSection
├── TeamSection
├── AchievementsSection
├── EventsPortfolioSection
└── ContactCTASection
```

### Admin Panel Enhancements

#### Form Components
- **ImageGalleryManager** - Multiple image upload and management
- **TestimonialManager** - Rich text editor for testimonials
- **TeamMemberManager** - Profile creation with image upload
- **EventManager** - Event scheduling and description
- **AchievementManager** - Milestone and award tracking

#### Admin Interface Updates
- Tabbed interface for organizing different content sections
- Drag-and-drop image uploading
- Rich text editors for descriptions and testimonials
- Preview functionality for content changes

## Data Models

### Enhanced CommunityClub Model
```php
class CommunityClub extends Model
{
    protected $fillable = [
        // Existing fields...
        'gallery_images',
        'testimonials',
        'social_media_links',
        'founded_year',
        'member_count',
        'upcoming_events',
        'achievements',
        'hero_subtitle',
        'hero_cta_text',
        'hero_cta_link'
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'testimonials' => 'array',
        'social_media_links' => 'array',
        'upcoming_events' => 'array',
        'achievements' => 'array'
    ];

    public function activities()
    {
        return $this->hasMany(CommunityClubActivity::class);
    }
}
```

### New CommunityClubActivity Model
```php
class CommunityClubActivity extends Model
{
    protected $fillable = [
        'community_club_id',
        'title',
        'description',
        'image',
        'duration',
        'max_participants',
        'requirements',
        'benefits'
    ];

    protected $casts = [
        'benefits' => 'array'
    ];

    public function communityClub()
    {
        return $this->belongsTo(CommunityClub::class);
    }
}
```

### Enhanced BusinessUnit Model
```php
class BusinessUnit extends Model
{
    protected $fillable = [
        // Existing fields...
        'team_members',
        'client_testimonials',
        'portfolio_items',
        'certifications',
        'company_stats',
        'gallery_images',
        'achievements',
        'core_values',
        'hero_subtitle',
        'hero_cta_text',
        'hero_cta_link'
    ];

    protected $casts = [
        'team_members' => 'array',
        'client_testimonials' => 'array',
        'portfolio_items' => 'array',
        'certifications' => 'array',
        'company_stats' => 'array',
        'gallery_images' => 'array',
        'achievements' => 'array',
        'core_values' => 'array'
    ];

    public function services()
    {
        return $this->hasMany(BusinessUnitService::class);
    }
}
```

### New BusinessUnitService Model
```php
class BusinessUnitService extends Model
{
    protected $fillable = [
        'business_unit_id',
        'title',
        'description',
        'image',
        'price_range',
        'duration',
        'features',
        'technologies',
        'process_steps'
    ];

    protected $casts = [
        'features' => 'array',
        'technologies' => 'array',
        'process_steps' => 'array'
    ];

    public function businessUnit()
    {
        return $this->belongsTo(BusinessUnit::class);
    }
}
```

## Error Handling

### Validation Rules
- Image uploads: file type, size, and dimension validation
- JSON fields: structure validation for arrays and objects
- Required field validation with user-friendly error messages
- Sanitization of user input for security

### Error Scenarios
- Missing or corrupted image files
- Invalid JSON data structure
- Database connection failures during testing
- File upload size limitations

### Error Recovery
- Graceful fallbacks for missing images (placeholder images)
- Default content when optional fields are empty
- Retry mechanisms for file uploads
- Clear error messaging in admin interface

## Testing Strategy

### Test Database Configuration
```php
// phpunit.xml configuration for SQLite testing
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

### Test Categories

#### Model Tests
- Field validation and casting
- Relationship integrity
- Data serialization/deserialization
- Model factory definitions

#### Controller Tests
- CRUD operations for enhanced fields
- File upload handling
- Inertia response structure
- Authorization and permissions

#### Feature Tests
- End-to-end page rendering
- Form submission workflows
- Image gallery functionality
- Admin panel interactions

#### Integration Tests
- Database migrations
- Seeder functionality
- Inertia page rendering
- Frontend-backend data flow through Inertia props

### Test Data Management
- Factory definitions for realistic test data
- Seeders for consistent test scenarios
- Image fixtures for upload testing
- JSON structure templates for complex fields

## Performance Considerations

### Image Optimization
- Automatic image resizing and compression
- Lazy loading for gallery images
- WebP format support with fallbacks
- CDN integration for image delivery

### Database Optimization
- Proper indexing for search functionality
- JSON field querying optimization
- Eager loading for related data
- Caching strategies for frequently accessed content

### Frontend Performance
- Component lazy loading
- Image preloading for critical content
- Smooth animations with CSS transforms
- Responsive image delivery based on device capabilities