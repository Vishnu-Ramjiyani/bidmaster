import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const MainLayout: React.FC = () => {
    return (
        <div className="min-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} BidMaster. All rights reserved.</p>
                </div>
            </footer>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default MainLayout;
