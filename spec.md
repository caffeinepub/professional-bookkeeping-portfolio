# Professional Bookkeeping Portfolio

## Overview
A professional portfolio web application for a bookkeeping and accounts payable/receivable specialist. The application showcases expertise, services, and experience through a clean, modern interface that conveys trust, reliability, and professionalism with a calm aesthetic using subtle greens and neutral tones. The portfolio features comprehensive editing capabilities allowing the owner to update all content directly from the frontend.

## Features
- **Home/About Section**: Professional introduction with calm, trustworthy tone highlighting expertise in bookkeeping, accounts payable, and accounts receivable
- **Experience Section**: Detailed work history showcasing focus areas including accounts payable, accounts receivable, reconciliations, and vendor management
- **Services Section**: Clear presentation of freelance and contract service offerings including bookkeeping, financial reporting, QuickBooks management, accounts payable management, and accounts receivable management
- **Tools & Expertise Section**: Prominent showcase of QuickBooks expertise with professional icons and brief descriptions for Excel proficiency and data accuracy specialization
- **Contact Form**: Simple, professional inquiry form for potential clients
- **Admin Edit Mode**: Toggle between viewing and editing modes for portfolio content management
- Responsive design optimized for desktop and mobile viewing
- Professional navigation between sections
- Clean, modern layout with excellent readability

## Admin Edit Mode
- **Edit Mode Toggle**: Intuitive toggle button to switch between viewing and editing modes
- **In-Place Editing**: Direct editing of text fields, titles, descriptions, and expertise lists
- **Dynamic Content Management**: Add and remove expertise items, experiences, and service details
- **Local Editing**: Changes saved locally with option to sync to backend
- **Confirmation Prompts**: User-friendly confirmation dialogs for important actions
- **Smooth Animations**: Gentle transitions matching the app's professional aesthetic
- **Auto-Save**: Automatic local saving of changes with manual sync option

## Editable Content Areas
### Experience Section
- Edit job titles, company names, dates, and descriptions
- Modify Key Expertise lists with add/remove functionality
- Update work history details and achievements

### Services Section
- Edit service titles and descriptions
- Modify service offerings and pricing information
- Update accounts payable and accounts receivable service details
- Manage key expertise lists for each service

### Tools & Expertise Section
- Edit tool descriptions and expertise levels
- Update QuickBooks expertise details
- Modify Excel proficiency and data accuracy descriptions

### Accounts Payable Management
- Edit key expertise items including invoice processing, record keeping, payment management
- Update account reconciliation and vendor relations details
- Modify reporting compliance and 2307 preparation information

### Accounts Receivable Management
- Edit expertise in invoice creation and payment tracking
- Update customer statement management details
- Modify receivable reconciliation processes

## Services Detail
### Accounts Payable Management
Key expertise includes:
- Invoice processing
- Record keeping
- Payment management
- Account reconciliation
- Vendor relations
- Reporting compliance
- Preparing 2307

### Accounts Receivable Management
Key expertise includes:
- Invoice creation
- Payment tracking
- Customer statement management
- Receivable reconciliation

## Experience Detail
### Bookkeeper Experience Entry
The bookkeeper experience entry includes a Key Expertise section with the following items:
- Maintained accuracy in recording financial transactions
- Reconciliation
- Accounts Payables
- Accounts Receivable
- Financial Reporting
- Compliance
- Journal Entries
- Maintaining General Ledger

This Key Expertise section is displayed as a visually formatted list in the bookkeeper's card on the Portfolio page, styled consistently with existing key lists and aligned with the QuickBooks expertise presentation.

## Contact Form Feature
- Simple contact form with essential fields:
  - Name (required)
  - Email (required)
  - Company/Organization (optional)
  - Message/Inquiry (required)
- Form validation for required fields
- Professional styling consistent with overall design
- Contact inquiries stored in backend for follow-up
- Success confirmation message after form submission

## Visual Design
- Clean, modern aesthetic with professional and reliable appearance
- Soft color palette featuring subtle greens and neutral tones
- Excellent typography hierarchy for professional readability
- Proper spacing and clean white/off-white backgrounds
- Professional iconography for tools and expertise
- Consistent branding throughout all sections
- Modern, trustworthy design elements that convey competence
- Smooth edit mode transitions with professional styling

## Content Structure
- **Home/About**: Professional bio emphasizing reliability, attention to detail, and bookkeeping expertise
- **Experience**: Work history with specific achievements in accounts payable, accounts receivable, reconciliations, and vendor management, including Key Expertise sections for relevant positions
- **Services**: Clear service descriptions for bookkeeping, financial reporting, QuickBooks setup and management, accounts payable management, and accounts receivable management with detailed key expertise
- **Tools & Expertise**: QuickBooks prominently featured with Excel and data accuracy skills highlighted
- **Contact**: Professional contact information and inquiry form

## Data Storage
- Contact form submissions stored in backend database
- Professional information and portfolio content managed through application data
- Service offerings and expertise details maintained in backend, including accounts payable and accounts receivable service descriptions and key expertise
- Experience entries with Key Expertise fields stored in backend, including the updated Bookkeeper experience entry with "Journal Entries" and "Maintaining General Ledger" expertise items
- Accounts payable and accounts receivable service details stored in backend
- Local storage for temporary edits before backend synchronization

## Backend Update Endpoints
- `updateExperience`: Update experience entries and key expertise
- `updateService`: Update service offerings and descriptions
- `updateAccountsPayable`: Update accounts payable service details
- `updateAccountsReceivable`: Update accounts receivable service details
- `updateTool`: Update tools and expertise information
- `updateAbout`: Update home/about section content

## Professional Branding
- Consistent professional tone throughout all content
- Trustworthy and reliable messaging
- Clean, modern visual identity
- Emphasis on accuracy, reliability, and expertise
- Professional color scheme with subtle greens and neutrals
- App content language: English
