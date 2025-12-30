import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../api/supabase';
import type { Auction, Bid } from '../types';
import { motion } from 'framer-motion';
import { Gavel, ShoppingBag, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
    const { user, profile } = useAuth();
    const [recentBids, setRecentBids] = useState<Bid[]>([]);
    const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
    const [stats, setStats] = useState({
        activeBids: 0,
        activeListings: 0,
        totalSpent: 0,
        totalEarned: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            if (!user) return;

            // Fetch Bids with Auction info
            const { data: bidsData } = await supabase
                .from('bids')
                .select('*, auction:auctions(id, title, current_price, status)')
                .eq('bidder_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentBids(bidsData || []);

            // Fetch My Auctions
            const { data: auctionsData } = await supabase
                .from('auctions')
                .select('*')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            setMyAuctions(auctionsData || []);

            // Stats
            const { count: bidsCount } = await supabase
                .from('bids')
                .select('*', { count: 'exact', head: true })
                .eq('bidder_id', user.id);

            const { count: listingsCount } = await supabase
                .from('auctions')
                .select('*', { count: 'exact', head: true })
                .eq('seller_id', user.id)
                .eq('status', 'active');

            setStats({
                activeBids: bidsCount || 0,
                activeListings: listingsCount || 0,
                totalSpent: bidsData?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
                totalEarned: auctionsData?.reduce((acc, curr) => acc + curr.current_price, 0) || 0
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-16 w-16 border-4 border-slate-200 border-t-primary-600 rounded-full"
            />
            <p className="mt-4 text-slate-400 font-bold">Synchronizing your dashboard...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12">
                <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.3em] mb-4">Account Overview</h2>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                    Welcome back, <span className="gradient-text">{profile?.username || 'User'}</span>!
                </h1>
                <p className="text-slate-500 text-lg">Manage your listings, track your bids, and grow your collection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                    { label: 'Active Bids', value: stats.activeBids, icon: Gavel, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Live Listings', value: stats.activeListings, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Invested', value: `$${stats.totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Market Value', value: `$${stats.totalEarned.toLocaleString()}`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card p-8 border-none shadow-xl shadow-slate-200/40 flex flex-col gap-6"
                    >
                        <div className={`${stat.bg} ${stat.color} h-12 w-12 rounded-2xl flex items-center justify-center`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="card border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <Gavel className="h-6 w-6 text-primary-600" /> Recent Activity
                        </h2>
                        <Link to="/my-bids" className="btn-secondary py-2 px-4 text-xs tracking-wider">All Bids</Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentBids.length > 0 ? recentBids.map((bid) => (
                            <div key={bid.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div>
                                    <p className="font-black text-slate-900 text-lg mb-1">{bid.auction?.title || 'Private Listing'}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(bid.created_at))} ago
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-2xl text-slate-900 tracking-tighter">${bid.amount.toLocaleString()}</p>
                                    <span className="badge bg-primary-100 text-primary-700 mt-1">Leading</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-20 text-center">
                                <Gavel className="h-12 w-12 mx-auto text-slate-100 mb-4" />
                                <p className="text-slate-400 font-bold leading-relaxed">No bidding activity recorded.<br /><Link to="/auctions" className="text-primary-600 hover:underline">Find something to bid on</Link></p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card border-none shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <ShoppingBag className="h-6 w-6 text-primary-600" /> Your Inventory
                        </h2>
                        <Link to="/my-listings" className="btn-secondary py-2 px-4 text-xs tracking-wider">Inventory</Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {myAuctions.length > 0 ? myAuctions.map((auction) => (
                            <Link key={auction.id} to={`/auctions/${auction.id}`} className="p-8 hover:bg-slate-50/50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-md">
                                        <img src={auction.images?.[0] || 'https://images.unsplash.com/photo-1544216717-3bbf52512659?q=80&w=2070&auto=format&fit=crop'} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">{auction.title}</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                            Current Value: <span className="text-slate-900">${auction.current_price.toLocaleString()}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                            </Link>
                        )) : (
                            <div className="p-20 text-center">
                                <ShoppingBag className="h-12 w-12 mx-auto text-slate-100 mb-4" />
                                <p className="text-slate-400 font-bold leading-relaxed">Your inventory is empty.<br /><Link to="/create-auction" className="text-primary-600 hover:underline">List your first item</Link></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
