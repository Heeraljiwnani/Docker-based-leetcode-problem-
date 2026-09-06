import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

import { loginSchema, LoginInput } from '../lib/authSchema';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import codeArenaLogo from '../../Logo/Put____inside_the_box_202609061559-removebg-preview.png';

/* ── Social Icons ─────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" fill="#4285F4"/>
    <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z" fill="#34A853"/>
    <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26A11.97 11.97 0 000 12c0 1.92.45 3.74 1.26 5.42l4.02-3.15z" fill="#FBBC05"/>
    <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
    <path clipRule="evenodd" fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M11.4 2H2v9.4h9.4V2z" fill="#F25022"/>
    <path d="M22 2h-9.4v9.4H22V2z" fill="#7FBA00"/>
    <path d="M11.4 12.6H2V22h9.4v-9.4z" fill="#00A4EF"/>
    <path d="M22 12.6h-9.4V22H22v-9.4z" fill="#FFB900"/>
  </svg>
);

/* ────────────────────────────────────────────────────────────────── */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const token = 'jwt_v2_session_token_xyz987';
      const user = {
        id: 'usr_001',
        email: data.email,
        name: data.email.split('@')[0],
      };
      login(token, user);
      toast.success('Welcome back!');
      navigate('/problems');
    } catch (error: unknown) {
      setValue('password', '', { shouldValidate: false });
      let msg = 'Invalid credentials. Please try again.';
      if (isAxiosError(error) && error.response?.data?.message) msg = error.response.data.message;
      else if (error instanceof Error) msg = error.message;
      toast.error(msg);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a2a1a 0%, #111 60%, #0a0a0a 100%)' }}
    >
      {/* Brand Logo Above Card */}
      <div className="mb-4 flex flex-col items-center justify-center">
        <img
          src={codeArenaLogo}
          alt="CodeArena Logo"
          className="w-56 h-auto object-contain transition-transform duration-300 hover:scale-105"
          style={{ filter: 'drop-shadow(0 0 24px rgba(132,204,22,0.4))' }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[420px] rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
      >
        {/* Header */}
        <div className="text-center mb-7">
          <h1
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "'Doppio One', sans-serif" }}
          >
            Welcome back, team
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Access your projects and manage your<br />deployments.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>

          {/* Email */}
          <div>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                id="email"
                type="email"
                autoFocus
                autoComplete="email"
                placeholder="Email"
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                  errors.email
                    ? 'ring-1 ring-rose-500'
                    : 'focus:ring-1 focus:ring-slate-600'
                }`}
                style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1 pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Password"
                className={`w-full pl-10 pr-11 py-3 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none transition-all ${
                  errors.password
                    ? 'ring-1 ring-rose-500'
                    : 'focus:ring-1 focus:ring-slate-600'
                }`}
                style={{ backgroundColor: '#111', border: '1px solid #2e2e2e' }}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                title="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 mt-1 pl-1">{errors.password.message}</p>
            )}
          </div>

          {/* Sign In Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer shadow-lg"
              style={{
                backgroundColor: '#84cc16',
                color: '#0a0a0a',
                boxShadow: '0 4px 20px rgba(132, 204, 22, 0.3)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#a3e635'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#84cc16'; }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign in to dashboard'
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ backgroundColor: '#2e2e2e' }} />
          <span className="text-xs text-slate-500">or sign in with your email</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#2e2e2e' }} />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => toast.info('Google Auth — use email/password above')}
            className="flex items-center justify-center py-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: '#252525', border: '1px solid #333' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2e2e2e'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#252525'; }}
            title="Sign in with Google"
          >
            <GoogleIcon />
          </button>

          <button
            type="button"
            onClick={() => toast.info('GitHub Auth — use email/password above')}
            className="flex items-center justify-center py-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: '#252525', border: '1px solid #333' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2e2e2e'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#252525'; }}
            title="Sign in with GitHub"
          >
            <GitHubIcon />
          </button>

          <button
            type="button"
            onClick={() => toast.info('Microsoft Auth — use email/password above')}
            className="flex items-center justify-center py-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: '#252525', border: '1px solid #333' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2e2e2e'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#252525'; }}
            title="Sign in with Microsoft"
          >
            <MicrosoftIcon />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Need access?{' '}
          <Link
            to="/signup"
            className="font-semibold hover:underline transition-colors"
            style={{ color: '#84cc16' }}
          >
            Request an account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
