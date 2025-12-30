import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gavel, Shield, Zap, Clock, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-slate-900 border-b border-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent_50%)]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                                Discover & Bid on <span className="text-primary-400">Unique Treasures</span>
                            </h1>
                            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                                BidMaster is the premier destination for live auctions. From rare collectibles to everyday essentials, find your next prize today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/auctions" className="btn-primary px-8 py-4 text-lg font-semibold w-full sm:w-auto">
                                    Browse Auctions
                                </Link>
                                <Link to="/register" className="btn-secondary px-8 py-4 text-lg font-semibold bg-transparent text-white border-white/20 hover:bg-white/10 w-full sm:w-auto">
                                    Join Now
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose BidMaster?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Experince the thrill of live bidding with our secure and transparent auction platform.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: <Zap className="h-6 w-6" />, title: 'Real-time Bidding', desc: 'Get instant updates and bid against others in real-time.' },
                            { icon: <Shield className="h-6 w-6" />, title: 'Secure Payments', desc: 'Every transaction is protected with military-grade security.' },
                            { icon: <Clock className="h-6 w-6" />, title: 'Timed Auctions', desc: 'Know exactly when an auction ends with live countdown timers.' },
                            { icon: <Gavel className="h-6 w-6" />, title: 'Verified Sellers', desc: 'We vet our sellers to ensure you get authentic products.' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                            >
                                <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-900">{feature.title}</h3>
                                <p className="text-slate-600 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories / Call to action */}
            <section className="py-20 bg-primary-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-white">
                            <h2 className="text-3xl font-bold mb-4">Ready to start selling?</h2>
                            <p className="text-primary-100 text-lg opacity-90">Reach thousands of potential buyers in minutes.</p>
                        </div>
                        <Link to="/register?role=seller" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-lg">
                            Become a Seller <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
