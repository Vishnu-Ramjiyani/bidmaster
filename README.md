# BidMaster - Online Auction Website

A full-stack Online Auction Website built with React (Vite), Tailwind CSS, and Supabase.

## Features

- **Real-time Bidding**: Instant bid updates using Supabase Realtime.
- **Role-based Access**: Separate flows for Buyers, Sellers, and Admins.
- **Auction Management**: Create, view, and delete auction listings.
- **Authentication**: Email/Password authentication via Supabase Auth.
- **Database**: PostgreSQL database with Row Level Security (RLS).
- **Storage**: Image uploads for auction items.

## Setup Instructions

### 1. Supabase Project Setup
1. Create a new project on [Supabase](https://supabase.com/).
2. Run the code in `SUPABASE_SCHEMA.sql` in the **SQL Editor** of your Supabase dashboard.
3. Enable **Realtime** for the `bids` and `auctions` tables (already included in the script).
4. Create a **Storage Bucket** named `auction-images` and make it **Public**.

### 2. Local Environment Setup
1. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema Highlights
- `profiles`: Extends Supabase auth with `username` and `role`.
- `auctions`: Primary listing table.
- `bids`: Relationship table for tracking all bidding activity.
- `categories`: Pre-populated item categories.

## License
MIT
