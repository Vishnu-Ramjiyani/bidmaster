import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gavel, Shield, Zap, Clock, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col hero-gradient overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-black uppercase tracking-widest mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                                </span>
                                Live Auctions Now
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                                Bid, Win, and <br />
                                <span className="gradient-text">Own the Rare.</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                                Join the world's most transparent auction platform. Discover unique treasures and list your own items with just a few clicks.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link to="/auctions" className="btn-primary px-10 py-4 text-lg w-full sm:w-auto text-center">
                                    Explore Auctions
                                </Link>
                                <Link to="/register" className="btn-secondary px-10 py-4 text-lg w-full sm:w-auto text-center">
                                    Start Selling
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-6 border-t border-slate-100 pt-8">
                                <div>
                                    <p className="text-2xl font-black text-slate-900">10k+</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Bidders</p>
                                </div>
                                <div className="h-8 w-px bg-slate-200"></div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">$2M+</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales</p>
                                </div>
                                <div className="h-8 w-px bg-slate-200"></div>
                                <div>
                                    <p className="text-2xl font-black text-slate-900">99%</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Safe & Secure</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-500/20 border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
                                    alt="Auction Hero"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-2xl">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Highest Bid</p>
                                            <p className="text-3xl font-black text-slate-900">$12,450.00</p>
                                        </div>
                                        <div className="bg-primary-600 text-white px-4 py-2 rounded-xl font-bold text-sm animate-pulse">
                                            Ending Soon
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.3em] mb-4">Features</h2>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Experience Premium Bidding</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Our platform is designed to provide the safest and most exhilarating auction experience on the web.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: <Zap className="h-6 w-6" />, title: 'Real-time Tenders', desc: 'Experience lightning-fast bid updates and live competition.' },
                            { icon: <Shield className="h-6 w-6" />, title: 'Escrow Protection', desc: 'Secure paymentsheld in escrow until you receive your item.' },
                            { icon: <Clock className="h-6 w-6" />, title: 'Smart Timers', desc: 'Anti-sniping protection ensures everyone gets a fair chance.' },
                            { icon: <Gavel className="h-6 w-6" />, title: 'Verified Only', desc: 'We pre-vet all high-value items for authenticity.' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl border border-slate-50 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="font-black text-xl mb-3 text-slate-900 tracking-tight">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sell Section */}
            <section className="py-24 bg-slate-900 relative overflow-hidden mx-4 md:mx-8 mb-20 rounded-[3rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Turn your items into <br /><span className="text-primary-400">instant cash.</span></h2>
                            <p className="text-slate-400 text-xl mb-8">List your collectibles, electronics, or fine art and reach thousands of verified buyers instantly.</p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                                <div className="flex items-center gap-2 text-slate-300 font-bold">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div> Low Commission
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 font-bold">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div> Instant Payouts
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 font-bold">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div> Global Reach
                                </div>
                            </div>
                        </div>
                        <Link to="/register" className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-2xl">
                            Start Selling <ArrowRight className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
