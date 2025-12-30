import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Auction } from '../types';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Loader2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MyListings: React.FC = () => {
    const { user } = useAuth();
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchListings();
        }
    }, [user]);

    const fetchListings = async () => {
        try {
            const { data, error } = await supabase
                .from('auctions')
                .select('*')
                .eq('seller_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAuctions(data || []);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        try {
            const { error } = await supabase.from('auctions').delete().eq('id', id);
            if (error) throw error;
            setAuctions(auctions.filter(a => a.id !== id));
            toast.success('Listing deleted successfully');
        } catch (error) {
            toast.error('Failed to delete listing');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">My Auction Listings</h1>
                    <p className="text-slate-500">Manage your items and track sales.</p>
                </div>
                <Link to="/create-auction" className="btn-primary flex items-center gap-2 px-6 py-3 font-bold">
                    <Plus className="h-5 w-5" /> List New Item
                </Link>
            </div>

            {auctions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {auctions.map((auction) => (
                        <div key={auction.id} className="card group overflow-hidden border-slate-100">
                            <div className="aspect-video relative overflow-hidden">
                                <img src={auction.images?.[0] || 'https://via.placeholder.com/400x225'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{auction.status}</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-slate-900 mb-4 line-clamp-1">{auction.title}</h3>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Current Bid</p>
                                        <p className="text-xl font-black text-slate-900">${auction.current_price.toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => handleDelete(auction.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="h-5 w-5" /></button>
                                </div>
                                <Link to={`/auctions/${auction.id}`} className="btn-secondary block w-full text-center py-2 text-sm font-bold">View Listing</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <ShoppingBag className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Listings</h2>
                    <Link to="/create-auction" className="btn-primary inline-block mt-4 px-10 py-3 font-bold">Create Your First Listing</Link>
                </div>
            )}
        </div>
    );
};

export default MyListings;
