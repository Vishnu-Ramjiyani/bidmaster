import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../api/supabase';
import { toast } from 'react-hot-toast';
import { UserPlus, Loader2, User, ShoppingBag } from 'lucide-react';

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    role: z.enum(['buyer', 'seller']),
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const defaultRole = (searchParams.get('role') as 'buyer' | 'seller') || 'buyer';

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: defaultRole,
        }
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        username: data.username,
                        role: data.role,
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
                toast.success('Registration successful! Check your email for verification.');
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
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setValue('role', 'buyer')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedRole === 'buyer'
                                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                                }`}
                        >
                            <User className="h-6 w-6" />
                            <span className="text-xs font-bold uppercase tracking-wider">Buyer</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('role', 'seller')}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedRole === 'seller'
                                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                                }`}
                        >
                            <ShoppingBag className="h-6 w-6" />
                            <span className="text-xs font-bold uppercase tracking-wider">Seller</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            {...register('username')}
                            type="text"
                            className={`input ${errors.username ? 'border-red-500' : ''}`}
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            className={`input ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            {...register('password')}
                            type="password"
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
