# Broadcast Report App - TVRI

Aplikasi sistem laporan siaran TVRI yang dibangun dengan Next.js, Supabase, dan TypeScript.

## Fitur Utama

- **Autentikasi**: Login/signup dengan role-based access (Admin/Operator)
- **Dashboard**: Statistik laporan siaran dengan visualisasi data
- **Manajemen Laporan**: CRUD operations untuk laporan siaran
- **Export Data**: Export laporan ke Excel dan PDF
- **Role-based Access**: Admin dapat CRUD, Operator hanya view
- **Real-time Data**: Integrasi dengan Supabase untuk data real-time

## Demo Accounts

- **Admin**: bagus / password123
- **Operator**: alan / password123  
- **Operator**: hafiz / password123

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Export**: SheetJS (Excel), jsPDF (PDF)

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (Text)
- `username` (Text, Unique)
- `role` (Text: 'admin' | 'operator')
- `created_at`, `updated_at` (Timestamps)

### Broadcast Reports Table
- `id` (UUID, Primary Key)
- `tanggal` (Date)
- `jam_mulai`, `jam_selesai` (Time)
- `program` (Text)
- `kualitas_siaran` (Text: 'Baik' | 'Tidak Baik')
- `petugas` (Text Array)
- `kendala`, `penanganan`, `keterangan` (Text, Optional)
- `created_by` (UUID, Foreign Key)
- `created_at`, `updated_at` (Timestamps)

## Security

- Row Level Security (RLS) enabled
- Role-based access control
- Secure authentication with Supabase Auth
- Protected routes with middleware

## Setup Instructions

1. **Database Setup**:
   - Run `scripts/001_create_broadcast_tables.sql` in Supabase
   - Create demo accounts through the signup page
   - Run `scripts/004_insert_demo_reports.sql` for sample data

2. **Environment Variables**:
   - All Supabase environment variables are already configured
   - No additional setup required

3. **Usage**:
   - Access `/auth/login` to login
   - Admin users can create, edit, delete reports
   - Operator users can only view reports
   - Export functionality available in reports page

## File Structure

\`\`\`
app/
├── auth/                 # Authentication pages
├── dashboard/           # Dashboard page
├── reports/             # Report management pages
└── layout.tsx          # Root layout with AuthProvider

components/
├── auth-provider.tsx    # Authentication context
├── dashboard/          # Dashboard components
├── layout/             # Header and navigation
└── reports/            # Report form and table

lib/
├── supabase/           # Supabase client configuration
├── export-utils.ts     # Excel/PDF export functions
└── types.ts            # TypeScript type definitions

scripts/
└── *.sql               # Database migration scripts
\`\`\`

## Export Features

- **Excel Export**: Full report data with formatting
- **PDF Export**: Professional report layout with TVRI branding
- **Filtered Export**: Export only filtered/searched results
- **Auto-naming**: Files include current date in filename

## Responsive Design

- Mobile-first responsive design
- TVRI blue color scheme
- Professional layout with proper spacing
- Accessible UI components
