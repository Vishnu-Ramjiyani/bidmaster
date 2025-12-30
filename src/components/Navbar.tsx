import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gavel, LogOut, PlusCircle, LayoutDashboard, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className="glass sticky top-0 z-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                <Gavel className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-black text-2xl tracking-tight gradient-text">BidMaster</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/auctions" className="text-slate-600 hover:text-primary-600 px-1 py-2 text-sm font-bold transition-colors">
                            Browse
                        </Link>

                        {user ? (
                            <>
                                <Link to="/create-auction" className="hidden md:flex btn-primary items-center gap-2 text-xs py-2 px-4 uppercase tracking-wider font-black">
                                    <PlusCircle className="h-4 w-4" />
                                    List Item
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="h-8 w-8 rounded-lg object-cover" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <div className="hidden sm:block text-left">
                                            <p className="text-xs font-black text-slate-900 leading-none">{profile?.username}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{profile?.role}</p>
                                        </div>
                                    </button>

                                    <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-300/50 py-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200">
                                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
                                        </div>
                                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <Link to="/my-listings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                                            <Gavel className="h-4 w-4" />
                                            My Listings
                                        </Link>
                                        {profile?.role === 'admin' && (
                                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-t border-slate-50 mt-1 pt-2">
                                                <Settings className="h-4 w-4" />
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-t border-slate-50 mt-1 pt-2"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-slate-600 hover:text-primary-600 px-4 py-2 text-sm font-bold transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-xs py-2.5 px-6 uppercase tracking-wider">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
