# BidMaster - Online Auction Platform
## Technical Project Overview

This document summarizes the technical architecture, component structure, and languages used in the **BidMaster** project for educational explanation.

---

### 1. Technology Stack (Languages & Frameworks)

*   **Frontend Core**: 
    *   **TypeScript (TSX)**: Used for all UI components to provide strict type safety and better developer experience.
    *   **React (v18+)**: The primary library for building the user interface using functional components and hooks.
    *   **Vite**: The build tool and development server used for high-performance bundling.
*   **Styling**:
    *   **Tailwind CSS**: Utility-first CSS framework used for rapid, responsive design and premium aesthetics.
    *   **Vanilla CSS**: Used in `index.css` for global design tokens and custom animations.
*   **Backend & Database**:
    *   **Supabase**: An open-source Firebase alternative.
        *   **PostgreSQL**: The relational database used to store users, auctions, and bids.
        *   **Supabase Auth**: Handles secure user registration and login.
        *   **Supabase Storage**: Manages image uploads for auction items.
    *   **SQL**: Used for defining the database schema and implementing complex business logic via PostgreSQL Triggers and Functions.
*   **Libraries**:
    *   **Lucide React**: For consistent, high-quality iconography.
    *   **Framer Motion**: For smooth entry animations and interactive transitions.
    *   **React Router Dom**: For handling client-side navigation.
    *   **React Hook Form & Zod**: For robust form handling and schema-based validation.
    *   **Date-fns**: For real-time date formatting and countdown logic.

---

### 2. Project Architecture (Components & Pages)

#### Core Components
*   **`MainLayout.tsx`**: The master wrapper that defines the global structure (Navbar + Main Content + Footer).
*   **`Navbar.tsx`**: The sticky navigation system featuring dynamic authentication states (Login/Register vs. Dashboard/Profile).

#### Functional Pages
1.  **`Home.tsx`**: High-conversion landing page with hero animations and feature highlights.
2.  **`Auctions.tsx`**: Real-time marketplace gallery with search, category filtering, and "Live/Ended" status indicators.
3.  **`AuctionDetail.tsx`**: In-depth view of a single item, featuring real-time bid history, dynamic countdowns, and the bidding interface.
4.  **`Dashboard.tsx`**: Personalized overview for users to track their recent bids, earnings, and inventory stats.
5.  **`CreateAuction.tsx`**: Multi-step form for sellers to list items, including image upload and category selection.
6.  **`EditAuction.tsx`**: Secure management page for sellers to update listings (with logic to lock prices once bids exist).
7.  **`MyListings.tsx`**: Management hub for sellers to view and delete their active auctions.
8.  **`MyBids.tsx`**: Tracking center for bidders to see if they are "Winning" or "Outbid".
9.  **`Login.tsx` / `Register.tsx`**: Secure authentication flows powered by Supabase.
10. **`Admin.tsx`**: Administrative panel for category management and system oversight.

---

### 3. Backend Logic (SQL)
The project utilizes **PostgreSQL Functions** to ensure data integrity:
*   **`handle_new_user()`**: Automatically creates a public profile record when a user signs up.
*   **`handle_new_bid()`**: A database trigger that automatically updates the auction price whenever a valid bid is placed, ensuring the UI is always in sync with the source of truth.

---

### 4. Key Features
*   **Real-time Updates**: Uses Supabase Realtime to push bid updates to users without refreshing the page.
*   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile views.
*   **Secure Bidding**: Implements Row Level Security (RLS) to ensure users can only modify their own data.
