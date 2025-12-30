import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';
import type { Auction, Bid } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Gavel, User, ArrowLeft, Loader2, TrendingUp } from 'lucide-react';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { toast } from 'react-hot-toast';

const AuctionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [auction, setAuction] = useState<Auction | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [placingBid, setPlacingBid] = useState(false);

    useEffect(() => {
        if (id) {
            fetchAuctionData();
            const unsubscribeBids = subscribeToBids();
            const unsubscribeAuction = subscribeToAuction();
            return () => {
                unsubscribeBids();
                unsubscribeAuction();
            };
        }
    }, [id]);

    const fetchAuctionData = async () => {
        try {
            if (!id) return;
            const { data: auctionData, error: auctionError } = await supabase
                .from('auctions')
                .select(`
                  *,
                  seller:profiles!seller_id(username, avatar_url),
                  category:categories(name)
                `)
                .eq('id', id)
                .single();

            if (auctionError) throw auctionError;
            setAuction(auctionData);

            const { data: bidsData, error: bidsError } = await supabase
                .from('bids')
                .select(`
                  *,
                  bidder:profiles!bidder_id(username, avatar_url)
                `)
                .eq('auction_id', id)
                .order('created_at', { ascending: false });

            if (bidsError) throw bidsError;
            setBids(bidsData || []);
        } catch (error) {
            console.error('Error fetching auction detail:', error);
            toast.error('Failed to load auction details');
        } finally {
            setLoading(false);
        }
    };

    const subscribeToBids = () => {
        const channel = supabase
            .channel(`public:bids:auction_id=eq.${id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bids', filter: `auction_id=eq.${id}` },
                async (payload) => {
                    const { data: bidderData } = await supabase
                        .from('profiles')
                        .select('username, avatar_url')
                        .eq('id', payload.new.bidder_id)
                        .single();

                    const newBid: Bid = {
                        ...payload.new as Bid,
                        bidder: bidderData
                    };

                    setBids((prev) => [newBid, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const subscribeToAuction = () => {
        const channel = supabase
            .channel(`public:auctions:id=eq.${id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'auctions', filter: `id=eq.${id}` },
                (payload) => {
                    setAuction((prev) => prev ? { ...prev, current_price: payload.new.current_price } : null);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handlePlaceBid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to place a bid');
            navigate('/login');
            return;
        }

        if (!auction || !id) return;

        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= auction.current_price) {
            toast.error(`Bid must be higher than $${auction.current_price}`);
            return;
        }

        if (user.id === auction.seller_id) {
            toast.error('You cannot bid on your own item');
            return;
        }

        if (!isAfter(new Date(auction.end_time), new Date())) {
            toast.error('Auction has ended');
            return;
        }

        setPlacingBid(true);
        try {
            const { error: bidError } = await supabase
                .from('bids')
                .insert({
                    auction_id: id,
                    bidder_id: user.id,
                    amount: amount
                });

            if (bidError) throw bidError;

            const { error: auctionUpdateError } = await supabase
                .from('auctions')
                .update({ current_price: amount })
                .eq('id', id);

            if (auctionUpdateError) throw auctionUpdateError;

            setBidAmount('');
            toast.success('Your bid has been placed!');
        } catch (error: any) {
            console.error('Bid error:', error);
            toast.error(error.message || 'Failed to place bid');
        } finally {
            setPlacingBid(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        </div>
    );

    if (!auction) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold">Auction not found</h2>
            <button onClick={() => navigate('/auctions')} className="btn-secondary mt-4">Back to Auctions</button>
        </div>
    );

    const isEnded = !isAfter(new Date(auction.end_time), new Date());

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                        <img
                            src={auction.images?.[0] || 'https://via.placeholder.com/800'}
                            alt={auction.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {auction.category?.name || 'Category'}
                            </span>
                            {isEnded ? (
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Ended
                                </span>
                            ) : (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Live
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{auction.title}</h1>
                        <p className="text-sm font-medium text-slate-500">Listed by <span className="text-slate-900">{auction.seller?.username}</span></p>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div>
                                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">Current Bid</p>
                                <p className="text-4xl font-black">${auction.current_price.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">Time Left</p>
                                <div className="flex items-center gap-2 text-2xl font-bold">
                                    <Clock className="h-6 w-6 text-primary-400" />
                                    {isEnded ? 'Auction Ended' : formatDistanceToNow(new Date(auction.end_time))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isEnded && (
                        <form onSubmit={handlePlaceBid} className="space-y-4">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder={`Enter $${(auction.current_price + 1).toLocaleString()} or more`}
                                    className="w-full pl-8 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-0 transition-all font-bold text-lg"
                                    disabled={placingBid}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={placingBid || user?.id === auction.seller_id}
                                className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3"
                            >
                                {placingBid ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                    <>
                                        <Gavel className="h-6 w-6" /> Place Bid
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="pt-8 border-t border-slate-100">
                        <h3 className="font-bold text-xl text-slate-900 mb-4">Description</h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{auction.description}</p>
                    </div>

                    <div className="pt-8">
                        <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                            Bid History
                            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">{bids.length}</span>
                        </h3>
                        <div className="space-y-4">
                            <AnimatePresence initial={false}>
                                {bids.length > 0 ? bids.map((bid, i) => (
                                    <motion.div
                                        key={bid.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex items-center justify-between p-4 rounded-xl border ${i === 0 ? 'bg-primary-50 border-primary-100 ring-2 ring-primary-500 ring-opacity-10' : 'bg-slate-50 border-slate-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                                                <User className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{bid.bidder?.username || 'Buyer'}</p>
                                                <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(bid.created_at))} ago</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black text-lg ${i === 0 ? 'text-primary-600' : 'text-slate-900'}`}>
                                                ${bid.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        No bids yet.
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetail;
