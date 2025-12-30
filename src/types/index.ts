export type UserRole = 'buyer' | 'seller' | 'admin';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Auction {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  starting_price: number;
  current_price: number;
  end_time: string;
  category_id: string;
  images: string[];
  status: 'active' | 'ended' | 'cancelled';
  winner_id: string | null;
  created_at: string;
  seller?: Profile;
  category?: Category;
  bids_count?: number;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  bidder?: Profile;
  auction?: Auction;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'bid' | 'outbid' | 'won' | 'sold' | 'system';
  read: boolean;
  created_at: string;
}
