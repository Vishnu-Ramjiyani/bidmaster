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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                <div className="max-w-xl">
                    <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.3em] mb-4">Marketplace</h2>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Active Auctions</h1>
                    <p className="text-slate-500 text-lg">Explore and bid on thousands of unique items from our verified seller community.</p>
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    <div className="relative flex-grow md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find items..."
                            className="input pl-12"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="input w-full sm:w-auto min-w-[180px] font-bold text-slate-700 bg-white"
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
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-600 mb-4" />
                    <p className="text-slate-400 font-bold animate-pulse">Scanning the catalog...</p>
                </div>
            ) : filteredAuctions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredAuctions.map((auction, i) => (
                        <motion.div
                            key={auction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card group cursor-pointer"
                        >
                            <Link to={`/auctions/${auction.id}`}>
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={auction.images?.[0] || 'https://images.unsplash.com/photo-1544216717-3bbf52512659?q=80&w=2070&auto=format&fit=crop'}
                                        alt={auction.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="badge glass text-slate-900 border-none shadow-sm">
                                            {auction.category?.name || 'Manual'}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(auction.end_time))} left
                                        </div>
                                        <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest">
                                            @{auction.seller?.username}
                                        </div>
                                    </div>

                                    <h3 className="font-black text-xl mb-6 text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                        {auction.title}
                                    </h3>

                                    <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 mb-1 font-black uppercase tracking-widest">Current Bid</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tight">
                                                ${auction.current_price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="btn-primary p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                            <Gavel className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <Search className="h-16 w-16 mx-auto text-slate-200 mb-6" />
                    <h2 className="text-3xl font-black text-slate-900 mb-2">No items found</h2>
                    <p className="text-slate-400 mb-8">Try adjusting your search or category filters.</p>
                    <button onClick={() => { setSearch(''); setCategory('all'); }} className="btn-primary px-10">Clear all filters</button>
                </div>
            )}
        </div>
    );
};

export default Auctions;
