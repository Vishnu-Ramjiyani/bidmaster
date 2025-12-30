import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import type { Auction } from '../types';
import { motion } from 'framer-motion';
import { Search, Clock, Gavel, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Auctions: React.FC = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            const { data, error } = await supabase
                .from('auctions')
                .select(`
                  *,
                  seller:profiles!seller_id(username, avatar_url),
                  category:categories(name)
                `)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAuctions(data || []);
        } catch (error) {
            console.error('Error fetching auctions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAuctions = auctions.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === 'all' || a.category?.name === category)
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Active Auctions</h1>
                    <p className="text-slate-600">Find and bid on the best items available right now.</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-grow md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search auctions..."
                            className="input pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="input w-auto min-w-[140px]"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Art">Art</option>
                        <option value="Collectibles">Collectibles</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home & Garden">Home & Garden</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
            ) : filteredAuctions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredAuctions.map((auction, i) => (
                        <motion.div
                            key={auction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card group hover:shadow-xl hover:shadow-slate-200/50 transition-all border-slate-100"
                        >
                            <Link to={`/auctions/${auction.id}`}>
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={auction.images?.[0] || 'https://via.placeholder.com/500'}
                                        alt={auction.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-primary-700 shadow-sm">
                                        {auction.category?.name || 'Item'}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(auction.end_time))} left
                                        </div>
                                        <div className="text-xs font-medium text-slate-400">
                                            By {auction.seller?.username}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg mb-4 text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                        {auction.title}
                                    </h3>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1 leading-none uppercase tracking-wider font-bold">Current Bid</p>
                                            <p className="text-2xl font-black text-slate-900 leading-none">
                                                ${auction.current_price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="btn-primary p-2 rounded-lg">
                                            <Gavel className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 text-lg">No auctions found.</p>
                </div>
            )}
        </div>
    );
};

export default Auctions;
