import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../api/supabase';
import { toast } from 'react-hot-toast';
import { UserPlus, Loader2 } from 'lucide-react';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        username: data.username,
                        role: 'user',
                    }
                }
            });

            if (authError) {
                if (authError.status === 500) {
                    throw new Error('Server Error (500): Check if SUPABASE_SCHEMA.sql has been run in Supabase SQL Editor.');
                }
                throw authError;
            }

            if (authData.user) {
                toast.success('Registration successful! You can now sign in.');
                navigate('/login');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary-100 text-primary-600 mb-4">
                        <UserPlus className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Join BidMaster</h2>
                    <p className="mt-2 text-sm text-slate-600">Start your auction journey today</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            {...register('username')}
                            type="text"
                            placeholder="johndoe"
                            className={`input ${errors.username ? 'border-red-500' : ''}`}
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="john@example.com"
                            className={`input ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="••••••••"
                            className={`input ${errors.password ? 'border-red-500' : ''}`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-600">
                    Already have an account? <Link to="/login" className="font-semibold text-primary-600">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
