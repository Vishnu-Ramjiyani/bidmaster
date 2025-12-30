import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gavel, User, LogOut, PlusCircle, LayoutDashboard, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Gavel className="h-8 w-8 text-primary-600" />
                            <span className="font-bold text-xl tracking-tight">BidMaster</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/auctions" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                            Browse Auctions
                        </Link>

                        {user ? (
                            <>
                                {profile?.role === 'seller' && (
                                    <Link to="/create-auction" className="btn-primary flex items-center gap-2 text-sm">
                                        <PlusCircle className="h-4 w-4" />
                                        List Item
                                    </Link>
                                )}

                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </button>

                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        {profile?.role === 'admin' && (
                                            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                                <Settings className="h-4 w-4" />
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Register
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
