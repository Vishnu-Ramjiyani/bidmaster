import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">B</span>
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900">BidMaster</span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                            &copy; {new Date().getFullYear()} BidMaster. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm font-semibold text-slate-600">
                            <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
                            <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default MainLayout;
