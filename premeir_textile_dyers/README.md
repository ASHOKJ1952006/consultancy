# Premier Textile Dyers - Data Analytics Dashboard

A comprehensive React-based data analytics dashboard for Premier Textile Dyers, providing real-time insights into production, inventory, quality control, planning, and alerts management.

## 🚀 Features

### 📊 Dashboard
- **Real-time KPIs**: Machines running, weekly production, dyes in stock, colors inspected
- **Weekly Production Chart**: Visual representation of fabric output vs targets
- **Stock Alerts**: Low inventory notifications with critical level indicators
- **Trend Analysis**: Performance metrics with week-over-week comparisons

### 🔧 Machine Data
- **Live Machine Status**: Real-time monitoring of 8 Softflow machines
- **Efficiency Tracking**: Individual machine efficiency percentages
- **Job Details**: Party, color, lot number, quantity, and stage information
- **Runtime Monitoring**: Track active job duration
- **Status Indicators**: Running, idle, and maintenance states

### 🧪 Dyes & Chemicals Inventory
- **Comprehensive Inventory**: Track all dyes and chemical stock levels
- **Weekly Usage Trends**: Bar chart visualization of consumption patterns
- **Low Stock Alerts**: Critical and low-level stock indicators
- **Category Filtering**: Filter by dyes, chemicals, or view all items
- **Daily Tracking**: Monitor usage across the week (Sun-Fri)

### 🎨 Color Inspection
- **Lab Dip Approvals**: Quality control tracking for color matching
- **Delta E (ΔE) Measurements**: Color difference quantification
- **Approval Workflow**: Approved, pending, and rejected status tracking
- **Client Management**: Track inspections by client and lot number
- **Visual Analytics**: Pie chart showing inspection status distribution

### 📅 Production Schedule (NEW!)
- **Weekly Calendar View**: Visual overview of scheduled batches
- **Batch Planning**: Schedule production batches with all details
- **Priority Management**: Set batch priorities (high, medium, low)
- **Machine Assignment**: Assign batches to specific machines
- **Time Management**: Track batch timing and duration
- **Interactive Calendar**: Click to view day-specific schedules

### 🔔 Alerts & Notifications (NEW!)
- **Real-time Alerts**: Critical, warning, and informational notifications
- **Category-based Alerts**: Inventory, machine, quality, production, maintenance
- **Unread Tracking**: Visual indicators for unread notifications
- **Filter System**: Filter by alert type and status
- **Actionable Alerts**: Quick action links for critical issues
- **Settings Panel**: Customize notification preferences
- **Email Integration**: Toggle email notifications
- **Sound Alerts**: Optional audio alerts for critical issues

### 📜 Batch History (NEW!)
- **Complete Production Records**: Historical data of all batches
- **Recipe Tracking**: Detailed dye and chemical formulations
- **Process Stages**: Step-by-step production timeline
- **Quality Records**: Delta E measurements and approval status
- **Search Functionality**: Find batches by ID, color, lot, or party
- **Efficiency Analytics**: Track machine and operator performance
- **Export Reports**: Download batch reports for documentation
- **Operator Tracking**: Monitor operator assignments and performance

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Recharts**: Interactive charts and data visualization
- **Lucide React**: Beautiful icon library
- **CSS3**: Custom styling with CSS Grid and Flexbox

## 📦 Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd "c:\Users\HP\OneDrive\DS 2_files\OneDrive\Desktop\Premier textile Dyers"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Premier textile Dyers/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js               # Main layout with sidebar and header
│   │   └── Layout.css
│   ├── pages/
│   │   ├── Dashboard.js            # Main dashboard with KPIs
│   │   ├── Dashboard.css
│   │   ├── MachineData.js          # Machine monitoring
│   │   ├── MachineData.css
│   │   ├── DyesChemicals.js        # Inventory management
│   │   ├── DyesChemicals.css
│   │   ├── ColorInspection.js      # Quality control
│   │   ├── ColorInspection.css
│   │   ├── ProductionSchedule.js   # Production planning (NEW!)
│   │   ├── ProductionSchedule.css
│   │   ├── Alerts.js               # Notifications system (NEW!)
│   │   ├── Alerts.css
│   │   ├── BatchHistory.js         # Historical records (NEW!)
│   │   └── BatchHistory.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎯 Usage Guide

### Dashboard
1. View overall system metrics at a glance
2. Monitor weekly production trends
3. Check critical stock alerts
4. Track key performance indicators

### Machine Data
1. Monitor all machines in real-time
2. Click on machine cards to view details
3. Track efficiency and runtime
4. Identify idle or maintenance-required machines

### Dyes & Chemicals
1. Use tabs to filter by category
2. Review weekly usage patterns in the chart
3. Monitor stock levels with color indicators
4. Identify items requiring reorder

### Color Inspection
1. Filter inspections by status (All/Approved/Pending/Rejected)
2. Review Delta E values for quality assessment
3. Track approval rates and average Delta E
4. Click "New Inspection" to add entries

### Production Schedule
1. View weekly calendar for scheduled batches
2. Click on dates to see day-specific schedules
3. Click "Schedule Batch" to add new production runs
4. Set priorities and assign machines
5. Track batch quantities and durations

### Alerts & Notifications
1. View all system alerts in one place
2. Filter by type: Critical, Warning, Info
3. Review unread notifications (marked with blue dot)
4. Click "Take Action" on actionable alerts
5. Configure preferences in Settings
6. Toggle email and sound notifications

### Batch History
1. Search for specific batches using the search bar
2. View complete production records
3. Click "View Details" to see:
   - Full recipe (dyes and chemicals)
   - Process stages with timings
   - Quality metrics and Delta E
   - Operator information
4. Export batch reports for documentation
5. Track efficiency and performance trends

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for best performance.

### `npm test`
Launches the test runner in interactive watch mode.

## Features Overview

### Navigation
- **Sidebar Navigation**: Easy access to all modules
- **Collapsible Sidebar**: Toggle for more screen space
- **Active State Indicators**: Clear visual feedback
- **Search Functionality**: Quick search across the dashboard
- **Notifications**: Bell icon with notification count

### Dashboard Metrics
- **Machines Running**: 3/5 machines active
- **Weekly Production**: 2,770 kg output
- **Dyes in Stock**: 42 items tracked
- **Colors Inspected**: 28 inspections this week

### Machine Monitoring
- **Real-time Status**: Live updates on machine states
- **Efficiency Metrics**: 85-94% efficiency range
- **Job Tracking**: Current jobs with full details
- **Stage Information**: Soap Run, TD Load, Soap Steam, Unload

### Inventory Management
- **12 Total Items**: 8 dyes + 4 chemicals
- **11 Low Stock Items**: Critical alerts for timely reordering
- **Usage Trends**: Weekly consumption patterns
- **Category Filtering**: Separate dye and chemical views

### Quality Control
- **15 Total Inspections**: Comprehensive quality tracking
- **67% Approval Rate**: Quality performance metric
- **0.83 Average ΔE**: Color accuracy measurement
- **3 Pending Reviews**: Items awaiting approval

## Color Coding

- **Green**: Running machines, approved items, positive trends
- **Orange/Yellow**: Warnings, low stock, pending items
- **Red**: Critical alerts, rejected items, maintenance required
- **Blue**: Information, neutral states
- **Purple**: Special metrics (Delta E, inspections)

## Responsive Design

The dashboard is fully responsive and works seamlessly on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted grid layouts
- **Mobile**: Stacked layouts with touch-friendly controls

## Data Visualization

- **Area Charts**: Weekly production trends
- **Bar Charts**: Dyes and chemicals usage
- **Pie Charts**: Inspection status distribution
- **Progress Bars**: Stock levels and machine efficiency
- **KPI Cards**: Quick metric overview

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- Real-time data integration with backend API
- Export reports to PDF/Excel
- Advanced filtering and search
- User authentication and roles
- Historical data analysis
- Predictive analytics for stock management
- Mobile app version

## License

© 2026 Premier Textile Dyers. All rights reserved.

## Support

For issues or questions, please contact the development team.
