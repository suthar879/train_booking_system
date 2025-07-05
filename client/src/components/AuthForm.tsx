'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormProps = {
  type: 'login' | 'signup';
};

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // 👈 import from AuthContext

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const endpoint = type === 'signup' ? 'signup' : 'login';
      const res = await axios.post(
        `http://localhost:5000/api/auth/${endpoint}`,
        data
      );

      toast.success(`${type === 'signup' ? 'Signup' : 'Login'} successful`);
      localStorage.setItem('token', res.data.token);

      login(); // 👈 update global auth state
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md mx-auto bg-white shadow-md p-6 rounded-xl"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center capitalize">
        {type}
      </h2>

      {type === 'signup' && (
        <div>
          <Input placeholder="Name" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>
      )}

      <div>
        <Input placeholder="Email" type="email" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Password" type="password" {...register('password')} />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button className="w-full" disabled={loading}>
        {loading ? 'Loading...' : type === 'signup' ? 'Sign Up' : 'Login'}
      </Button>
    </form>
  );
}
