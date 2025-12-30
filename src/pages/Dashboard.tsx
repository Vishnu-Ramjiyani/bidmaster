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
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 border-4 border-primary-100 border-t-primary-600 rounded-full"
            />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome Back, {profile?.username || 'User'}!</h1>
                <p className="text-slate-500">Track your auction activity and sales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Active Bids', value: stats.activeBids, icon: Gavel, color: 'bg-blue-500' },
                    { label: 'My Listings', value: stats.activeListings, icon: ShoppingBag, color: 'bg-purple-500' },
                    { label: 'Total Invested', value: `$${stats.totalSpent.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-500' },
                    { label: 'Potential Sales', value: `$${stats.totalEarned.toLocaleString()}`, icon: Clock, color: 'bg-orange-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card p-6 border-slate-100 flex items-center gap-4"
                    >
                        <div className={`${stat.color} p-3 rounded-xl text-white`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Gavel className="h-5 w-5 text-primary-600" /> Recent Bids
                        </h2>
                        <Link to="/my-bids" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentBids.length > 0 ? recentBids.map((bid) => (
                            <div key={bid.id} className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900">Bid on {bid.auction?.title || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(bid.created_at))} ago</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900">${bid.amount.toLocaleString()}</p>
                                    <span className="text-[10px] uppercase font-bold text-primary-600">Active</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-slate-400">No bids yet.</div>
                        )}
                    </div>
                </div>

                <div className="card border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-primary-600" /> My Listings
                        </h2>
                        <Link to="/my-listings" className="text-sm font-bold text-primary-600 hover:underline">Manage</Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {myAuctions.length > 0 ? myAuctions.map((auction) => (
                            <Link key={auction.id} to={`/auctions/${auction.id}`} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={auction.images?.[0] || 'https://via.placeholder.com/100'} alt="" className="h-10 w-10 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-bold text-slate-900 line-clamp-1">{auction.title}</p>
                                        <p className="text-xs text-slate-500">Current: ${auction.current_price.toLocaleString()}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-slate-300" />
                            </Link>
                        )) : (
                            <div className="p-12 text-center text-slate-400">No listings yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
