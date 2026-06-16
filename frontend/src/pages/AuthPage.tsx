import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/authStore';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    login({
      id: 'user-1',
      email: 'test@familyconnect.com',
      name: 'Demo User',
      createdAt: new Date().toISOString()
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <span className="text-4xl mb-2 block">🌳</span>
          <h2 className="text-3xl font-extrabold text-[var(--color-navy)]">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-medium text-[var(--color-saffron)] hover:text-[#e65c2b]"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                id="name" 
                type="text" 
                required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input 
              id="email" 
              type="email" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
              defaultValue="demo@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              id="password" 
              type="password" 
              required 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[var(--color-saffron)] focus:border-[var(--color-saffron)]"
              defaultValue="password123"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              For this demo, just click the button above to enter the app.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
