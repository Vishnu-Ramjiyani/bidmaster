import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import type { Profile, Auction } from '../types';
import { toast } from 'react-hot-toast';
import { Shield, Users, Gavel, Trash2, Ban, Loader2 } from 'lucide-react';

const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'auctions'>('users');
    const [users, setUsers] = useState<Profile[]>([]);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, [activeTab]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
                setUsers(data || []);
            } else {
                const { data } = await supabase.from('auctions').select('*').order('created_at', { ascending: false });
                setAuctions(data || []);
            }
        } catch (error) {
            console.error('Admin fetch error:', error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAuction = async (id: string) => {
        if (!confirm('Are you sure you want to remove this auction?')) return;
        try {
            const { error } = await supabase.from('auctions').delete().eq('id', id);
            if (error) throw error;
            setAuctions(auctions.filter(a => a.id !== id));
            toast.success('Auction removed');
        } catch (error) {
            toast.error('Failed to remove auction');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-slate-900 rounded-2xl text-white shadow-xl">
                    <Shield className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Admin Panel</h1>
                    <p className="text-slate-500">Platform management and monitoring.</p>
                </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-8">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'users' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}
                >
                    <Users className="h-4 w-4" /> Users
                </button>
                <button
                    onClick={() => setActiveTab('auctions')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'auctions' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}
                >
                    <Gavel className="h-4 w-4" /> Auctions
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    {activeTab === 'users' ? (
                                        <>
                                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">User</th>
                                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">Role</th>
                                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 text-right">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">Auction</th>
                                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">Price</th>
                                            <th className="px-6 py-4 text-xs font-black uppercase text-slate-500 text-right">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {activeTab === 'users' ? users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 font-bold text-slate-900">{user.username}</td>
                                        <td className="px-6 py-4 uppercase text-xs font-bold text-slate-500">{user.role}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-red-600"><Ban className="h-5 w-5" /></button>
                                        </td>
                                    </tr>
                                )) : auctions.map(auction => (
                                    <tr key={auction.id}>
                                        <td className="px-6 py-4 font-bold text-slate-900">{auction.title}</td>
                                        <td className="px-6 py-4 font-black">${auction.current_price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDeleteAuction(auction.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="h-5 w-5" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
