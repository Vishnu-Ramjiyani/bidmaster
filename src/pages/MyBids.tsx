import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Bid } from '../types';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Gavel, Clock, Frown, Loader2, Trophy } from 'lucide-react';

const MyBids: React.FC = () => {
    const { user } = useAuth();
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBids();
        }
    }, [user]);

    const fetchBids = async () => {
        try {
            const { data, error } = await supabase
                .from('bids')
                .select('*, auction:auctions(id, title, current_price, status)')
                .eq('bidder_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBids(data || []);
        } catch (error) {
            console.error('Error fetching bids:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">My Bidding History</h1>
                <p className="text-slate-500">Track all your active and past bids.</p>
            </div>

            <div className="space-y-6">
                {bids.length > 0 ? bids.map((bid) => (
                    <div key={bid.id} className="card p-6 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                                <Gavel className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{bid.auction?.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formatDistanceToNow(new Date(bid.created_at))} ago</span>
                                    {bid.amount >= (bid.auction?.current_price || 0) ? (
                                        <span className="flex items-center gap-1 text-green-600 font-bold"><Trophy className="h-4 w-4" /> Winning</span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-500 font-bold"><Frown className="h-4 w-4" /> Outbid</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-bold uppercase">Your Bid</p>
                                <p className="text-2xl font-black text-slate-900">${bid.amount.toLocaleString()}</p>
                            </div>
                            <Link to={`/auctions/${bid.auction?.id}`} className="btn-secondary px-6 py-2 text-sm font-bold">View Item</Link>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">You haven't placed any bids yet.</p>
                        <Link to="/auctions" className="btn-primary px-8 py-3 font-bold">Browse Auctions</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBids;
