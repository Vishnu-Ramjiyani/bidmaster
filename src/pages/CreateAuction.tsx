import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../api/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Upload, X, Loader2, Plus, Clock, DollarSign, Tag } from 'lucide-react';
import { addDays, format } from 'date-fns';

const auctionSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    starting_price: z.string().refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Price must be greater than 0'),
    category: z.string().min(1, 'Please select a category'),
    end_time: z.string().min(1, 'Please set an end time'),
});

type AuctionForm = z.infer<typeof auctionSchema>;

const CreateAuction: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<AuctionForm>({
        resolver: zodResolver(auctionSchema),
        defaultValues: {
            end_time: format(addDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm"),
        }
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newUrls = [...imageUrls];

        for (const file of Array.from(files)) {
            try {
                // Sanitize filename: remove emojis/special characters that Supabase Storage might reject
                const sanitizedName = file.name.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, "_");
                const fileName = `${Date.now()}_${sanitizedName}`;

                const { data, error } = await supabase.storage
                    .from('auction-images')
                    .upload(`${user?.id}/${fileName}`, file);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('auction-images')
                    .getPublicUrl(data.path);

                newUrls.push(publicUrl);
            } catch (error: any) {
                toast.error(`Error uploading image: ${error.message}. Ensure 'auction-images' bucket is public.`);
            }
        }

        setImageUrls(newUrls);
        setUploading(false);
    };

    const onSubmit = async (data: AuctionForm) => {
        if (imageUrls.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        setSubmitting(true);
        try {
            // Category lookup
            const { data: catData } = await supabase
                .from('categories')
                .select('id')
                .eq('name', data.category)
                .single();

            const { data: auctionData, error } = await supabase
                .from('auctions')
                .insert({
                    seller_id: user?.id,
                    title: data.title,
                    description: data.description,
                    starting_price: parseFloat(data.starting_price),
                    current_price: parseFloat(data.starting_price),
                    category_id: catData?.id,
                    end_time: new Date(data.end_time).toISOString(),
                    images: imageUrls,
                    status: 'active'
                })
                .select()
                .single();

            if (error) throw error;

            toast.success('Auction listed successfully!');
            navigate(`/auctions/${auctionData.id}`);
        } catch (error: any) {
            console.error('Create auction error:', error);
            toast.error(error.message || 'Failed to create auction');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Create New Listing</h1>
                <p className="text-slate-600">Fill in the details below to list your item for auction.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="card p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Tag className="h-4 w-4" /> Item Title
                            </label>
                            <input
                                {...register('title')}
                                type="text"
                                placeholder="e.g. Vintage 1970s Polaroid Camera"
                                className={`input py-3 ${errors.title ? 'border-red-500' : ''}`}
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" /> Starting Price ($)
                            </label>
                            <input
                                {...register('starting_price')}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className={`input py-3 ${errors.starting_price ? 'border-red-500' : ''}`}
                            />
                            {errors.starting_price && <p className="mt-1 text-xs text-red-500">{errors.starting_price.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                            <select
                                {...register('category')}
                                className={`input py-3 ${errors.category ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Art">Art</option>
                                <option value="Collectibles">Collectibles</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home & Garden">Home & Garden</option>
                            </select>
                            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea
                                {...register('description')}
                                rows={5}
                                placeholder="Describe your item in detail..."
                                className={`input py-3 ${errors.description ? 'border-red-500' : ''}`}
                            ></textarea>
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Auction End Time
                            </label>
                            <input
                                {...register('end_time')}
                                type="datetime-local"
                                className={`input py-3 ${errors.end_time ? 'border-red-500' : ''}`}
                            />
                            {errors.end_time && <p className="mt-1 text-xs text-red-500">{errors.end_time.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="card p-6 md:p-8">
                    <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Product Images
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        {imageUrls.map((url, i) => (
                            <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 group">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}

                        {imageUrls.length < 8 && (
                            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors text-slate-400">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
                                <span className="text-xs mt-2 font-medium">Add Image</span>
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary px-8 py-3 font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="btn-primary px-12 py-3 font-bold flex items-center gap-2 shadow-lg shadow-primary-200"
                    >
                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'List Auction Now'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAuction;
