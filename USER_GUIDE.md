# Road Damage Detection App - User Guide

## Quick Start

### 1. Start the Application
```bash
cd c:\Users\virat\OneDrive\Desktop\app\vmc\vmc
npm run dev
```

The app will be available at: **http://localhost:5173/**

### 2. Initial Setup
- The app opens at the landing page
- Click "Get Started" or navigate to the signup page
- Create an account (any credentials work for testing)
- You'll be redirected to the Dashboard

## Main Features

### Dashboard
The dashboard shows:
- **Total Inspections** - Number of completed inspections
- **Total Detections** - Sum of all detected road damages
- **High Severity Items** - Count of critical and high-priority detections
- **Processing Queue** - Videos currently being analyzed
- **Recent Inspections** - Quick access to last few inspections
- **Recent Detections** - Latest damages found with location data
- **Quick Actions** - Shortcuts to start recording, view reports, or see inspections

### Starting an Inspection

#### Method 1: Record Live
1. Click "New Inspection" or "Start Recording" button
2. Click the red **Record** button
3. The app will:
   - Request camera and GPS permissions
   - Start capturing video
   - Display GPS lock status and battery level
   - Begin frame-by-frame analysis
4. Drive/walk slowly to inspect the road
5. Click the red **Stop** button to end recording
6. You'll be automatically taken to the results page

#### Method 2: Upload Video
1. Click "New Inspection"
2. Go to the "Upload" tab
3. Select a pre-recorded video file
4. The app will analyze the video and generate detections

### Recording Interface

While recording, you'll see:
- **GPS Status** - "GPS Locked" (green) or "Acquiring..." (yellow)
- **Recording Indicator** - "REC" with elapsed time
- **Detection Counter** - Real-time count of road damages found
- **Current Coordinates** - Your exact GPS location
- **Battery Level** - Device battery percentage
- **Pause/Resume** - Pause recording without stopping
- **Stop Recording** - End the inspection

### Inspection Results

After recording completes:

#### Statistics Cards
- **Total Detections** - All damages found
- **Potholes** - Count of pothole detections
- **Cracks** - Count of crack detections
- **High Severity** - Critical and high-priority items

#### Viewing Detections

**Grid View** (Default):
- Visual thumbnails of each detection
- Hover to see severity and location
- Color-coded severity badges

**List View**:
- Compact list with detection cards
- Shows thumbnail, type, location, and confidence
- Easier to scroll through many detections

**Map View** (NEW):
- Interactive map showing all detection locations
- Color-coded markers:
  - 🟡 Yellow = Low severity
  - 🟠 Orange = Medium severity
  - 🔴 Red = High severity
  - 🟥 Dark Red = Critical severity
- Click markers to see details popup
- Auto-zooms to fit all detections
- Includes severity legend

#### Filtering Results
- **Severity Filter** - Show only specific severity levels
- **Type Filter** - Show only potholes or cracks
- **Combine Filters** - Use both together

### My Inspections

View all your completed inspections:
- **Video Thumbnail** - Visual representation of the inspection
- **Status** - Shows if completed, processing, or pending
- **Date** - When the inspection was created
- **Detection Count** - Total damages found
- **Progress Bar** - For videos being processed
- **Click to View** - See full results and map

### Reports

Generate and view inspection reports:
- Each report shows:
  - Report ID and organization
  - Creation date
  - Total detections
  - Breakdown by type (potholes vs cracks)
  - Severity distribution
  - Location coordinates
- **Actions**:
  - View full report details
  - Download as PDF
  - Export data

### Settings

Configure app preferences:
- User profile information
- Notification preferences
- Data storage options
- Privacy settings

### Admin Dashboard (Admin Only)

If logged in as admin:
- View all user inspections
- Monitor system statistics
- Manage user accounts
- Access heatmap of road damage hotspots

## Recording Tips for Best Results

### Camera Positioning
- Mount device on dashboard or windshield
- Angle to capture center of road clearly
- Ensure good lighting conditions
- Avoid reflections on windshield

### Driving Speed
- Drive at 15-25 mph for optimal frame capture
- Slower speeds increase detection coverage
- Consistent speed helps GPS accuracy

### GPS Accuracy
- Start recording in open area for GPS lock
- Allow 10-20 seconds for initial GPS acquisition
- Better accuracy in clear weather
- GPS tracked every second during recording

### Lighting Conditions
- Daytime recording produces best results
- Avoid extreme shadows or glare
- Cloudy days work well
- Night recording may have reduced accuracy

### Road Coverage
- Record entire area of interest
- Multiple passes improve detection confidence
- Include various road surface types
- Record both lanes if applicable

## Data Management

### Automatic Saving
- All inspections automatically save to device storage
- Detections persist between sessions
- GPS points stored with each detection
- Videos accessible from "My Inspections"

### Exporting Data
- Each inspection can be exported as:
  - PDF report with maps
  - JSON data for analysis
  - CSV for spreadsheets
- Use "Export" button on results page

### Data Privacy
- All data stored locally by default
- Option to backup to cloud (with Supabase)
- No data shared without consent
- Delete old inspections from settings

## Troubleshooting

### Camera Permission Issues
- Check browser camera permissions
- Ensure HTTPS is enabled (or localhost)
- Try different browser (Chrome recommended)
- Restart app if permission was denied

### GPS Not Locking
- Wait 20+ seconds after starting recording
- Ensure location services are enabled
- Move outside if indoors
- Check location permission in browser

### Slow Detection Processing
- Detection runs in real-time
- May vary based on device performance
- Close other browser tabs
- Restart browser if persistent

### No Detections Found
- Ensure good road visibility
- Check lighting conditions
- Record longer sections
- Try different routes

### Video Upload Issues
- Ensure video is in supported format (MP4, WebM)
- Keep file size under 500MB
- Check internet connection
- Try different browser

## Map Features

### Marker Colors
- **Yellow (Low)** - Minor wear, cosmetic damage
- **Orange (Medium)** - Notable damage, repair needed
- **Red (High)** - Significant damage, safety concern
- **Dark Red (Critical)** - Major hazard, urgent repair

### Marker Popup
Click any marker to see:
- Damage type (Pothole/Crack)
- Severity level
- Detection confidence (%)
- GPS coordinates
- Additional notes

### Map Controls
- **Zoom In/Out** - Use +/- buttons or scroll wheel
- **Pan** - Click and drag to move map
- **Fit to Bounds** - Automatically when detections load
- **Click Markers** - Show detailed information

## Advanced Features

### Report Generation
- Automatically creates report after inspection
- Includes all detection details
- Shows location map
- Calculates severity statistics
- Ready for sharing with authorities

### Heatmap Analysis (Admin)
- View concentration of road damages
- Identify problem areas
- Plan maintenance routes
- Track improvement over time

### CSV Export
- Compatible with spreadsheet applications
- Includes all detection metadata
- Sortable and filterable
- Ready for GIS analysis

## Keyboard Shortcuts

- **R + Enter** - Restart dev server (development)
- **C + Enter** - Clear console (development)
- **H + Enter** - Show help (development)
- **Q + Enter** - Quit server (development)

## Performance Tips

- Clear browser cache periodically
- Reduce number of tabs open
- Use Chrome/Edge for best performance
- Close background applications
- Ensure device has sufficient storage

## Support & Feedback

For issues or suggestions:
1. Check this guide first
2. Try troubleshooting steps
3. Check browser console for errors
4. Report issues with detailed description

---

**Version**: 1.0  
**Last Updated**: December 2025  
**Status**: Production Ready ✅

