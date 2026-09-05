import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

import { loginSchema, LoginInput } from '../lib/authSchema';
import { useAuthStore } from '../store/useAuthStore';

import {
  Terminal,
  Mail,
  Key,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  Calendar,
  Loader2,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';

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
    defaultValues: {
      email: 'linus_t@kernel.org',
      password: 'argon2_id_secure_token',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
      toast.success('Authenticated into CodeArena Workspace!');
      navigate('/problems');
    } catch (error: unknown) {
      setValue('password', '', { shouldValidate: false });

      let errorMessage = 'Invalid credentials. Please try again.';
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <main className="w-full min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between antialiased selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="h-14 w-full px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center border border-slate-700/80 text-cyan-400">
              <Terminal className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              CodeArena
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-500/30 font-mono text-[10px] font-semibold">
              v2.4
            </span>
          </div>


        </div>
      </header>

      {/* Main Viewport */}
      <div className="relative w-full overflow-hidden px-4 sm:px-6 pt-20 pb-12 flex items-center justify-center flex-1">
        {/* Ambient background depth glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Auth Form Card */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400" />

            {/* Brand Header */}
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 bg-slate-950/60 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 px-6 sm:px-10 pt-6 sm:pt-8 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
                  <Terminal className="h-4 w-4" />
                </div>
                <span className="font-mono text-xs tracking-wider text-cyan-400 uppercase font-semibold">
                  CodeArena / Auth Gateway
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400 bg-slate-800 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>TLS 1.3 / Isolated</span>
              </div>
            </div>

            {/* Form Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Welcome back, engineer
              </h1>
              <p className="text-sm text-slate-400 mt-1.5">
                Resume algorithmic training, benchmark runtimes, and keep your streak alive.
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => toast.info('GitHub Auth demo - use credentials form below')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg bg-slate-950 hover:bg-slate-800 text-white border border-slate-800 transition-all font-medium text-xs active:scale-[0.99]"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd" />
                </svg>
                <span>Continue with GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => toast.info('Google Auth demo - use credentials form below')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg bg-slate-950 hover:bg-slate-800 text-white border border-slate-800 transition-all font-medium text-xs active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" fill="#4285F4" />
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z" fill="#34A853" />
                  <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26A11.97 11.97 0 000 12c0 1.92.45 3.74 1.26 5.42l4.02-3.15z" fill="#FBBC05" />
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center my-6">
              <div className="w-full h-px bg-slate-800" />
              <span className="absolute bg-slate-900 px-3 font-mono text-[11px] text-slate-500 uppercase tracking-wider">
                Or credentials
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="block font-mono text-xs font-medium text-slate-300">
                    Developer Identity / Email
                  </label>
                  <span className="text-slate-500 font-mono text-[11px]">octocat or alex@domain.dev</span>
                </div>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoFocus
                    placeholder="name@company.com or handle"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-600 font-mono text-xs transition-colors focus:outline-none focus:border-cyan-500 border ${
                      errors.email ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p role="alert" className="text-xs text-rose-400 font-mono mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block font-mono text-xs font-medium text-slate-300">
                    Password Key
                  </label>
                  <a href="#" className="font-mono text-xs text-cyan-400 hover:underline">
                    Reset credentials?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Key className="absolute left-3 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-600 font-mono text-xs transition-colors focus:outline-none focus:border-cyan-500 border ${
                      errors.password ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 text-slate-400 hover:text-white flex items-center justify-center p-0.5 rounded"
                    title="Toggle password view"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="text-xs text-rose-400 font-mono mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 checked:bg-cyan-500 accent-cyan-500 text-slate-950 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400">
                    Keep JWT active across browser restarts (30 days)
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-cyan-500 text-slate-950 text-sm font-semibold hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Validating Token...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      <span>Authenticate into Workspace</span>
                      <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 rounded bg-slate-950/20 font-mono text-xs text-slate-950">
                        ↵ Enter
                      </kbd>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Switcher */}
            <div className="mt-6 pt-5 bg-slate-950/40 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 px-6 sm:px-10 pb-6 rounded-b-xl flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800">
              <span>New to CodeArena?</span>
              <Link
                to="/signup"
                className="font-medium text-cyan-400 hover:underline flex items-center gap-1 group"
              >
                <span>Initialize new engineer account</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>CodeArena Workstation</span>
            <span>•</span>
            <span>Runtime: Linux x86_64</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Docs</span>
            <span className="hover:text-slate-300 cursor-pointer">API</span>
            <span className="hover:text-slate-300 cursor-pointer">Telemetry</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LoginPage;
