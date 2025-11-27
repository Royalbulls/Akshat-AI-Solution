import React, { useState } from 'react';
import { BotIcon, LockClosedIcon, UserIcon, EnvelopeIcon, GoogleIcon } from './Icons';
import { AuthUser } from '../types';

interface AuthViewProps {
    onLogin: (user: AuthUser) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Authenticating...');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        setLoadingText(isLogin ? 'Verifying Credentials...' : 'Creating Secure Account...');

        // Simulate network delay
        setTimeout(() => {
            setIsLoading(false);
            if (email && password) {
                const mockUser: AuthUser = {
                    id: 'local-user-' + Date.now(),
                    name: name || email.split('@')[0] || 'User',
                    email: email
                };
                onLogin(mockUser);
            } else {
                setError("Invalid credentials");
            }
        }, 1500);
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        setLoadingText('Connecting to Google...');
        
        // Simulate Google Auth delay
        setTimeout(() => {
            setIsLoading(false);
            const mockUser: AuthUser = {
                id: 'google-user-' + Date.now(),
                name: 'Demo User',
                email: 'demo@akshat.ai'
            };
            onLogin(mockUser);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative z-10 w-full max-w-md bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-700 overflow-hidden animate-fade-in-slide-up">
                {/* Header */}
                <div className="bg-gray-900/80 p-8 text-center border-b border-gray-700">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)] border border-amber-500/30">
                        <BotIcon className="w-10 h-10 text-amber-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white neon-text-gold tracking-wide">AKSHAT AI</h1>
                    <p className="text-amber-500/80 text-xs font-bold uppercase tracking-[0.3em] mt-2">Enterprise Solutions</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <h2 className="text-xl font-bold text-white mb-6 text-center">
                        {isLogin ? 'Secure Portal Login' : 'Create New Account'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg shadow hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 mb-6 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isLoading && loadingText === 'Connecting to Google...' ? (
                             <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                             <GoogleIcon className="w-5 h-5" />
                        )}
                        <span>Sign in with Google</span>
                    </button>

                    <div className="flex items-center mb-6">
                        <div className="flex-1 border-t border-gray-600"></div>
                        <span className="px-3 text-gray-500 text-xs uppercase">Or continue with email</span>
                        <div className="flex-1 border-t border-gray-600"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Full Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-500" />
                                    </span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-500" />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                        >
                            {isLoading && loadingText !== 'Connecting to Google...' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{loadingText}</span>
                                </>
                            ) : (
                                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                                className="ml-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors hover:underline"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthView;