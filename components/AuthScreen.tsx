
import React, { useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    AuthError
} from 'firebase/auth';
import { auth } from '../services/firebase';
import * as dbService from '../services/dbService';

type AuthMode = 'login' | 'signup' | 'reset';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email || !password) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
    }

    try {
      if (mode === 'signup') {
        const adminExists = await dbService.checkIfAdminExists();
        if (adminExists) {
            setError('Sign-up is disabled. Only one administrator account is allowed.');
            setLoading(false);
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await dbService.registerAdmin(userCredential.user.uid);
      } else { // Login
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
        const authError = err as AuthError;
        handleAuthError(authError);
    } finally {
        setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email) {
        setError("Please enter your email address.");
        setLoading(false);
        return;
    }
    
    try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset link sent! Please check your inbox.");
        setMode('login');
    } catch (err) {
        const authError = err as AuthError;
        handleAuthError(authError);
    } finally {
        setLoading(false);
    }
  };
  
  const handleAuthError = (authError: AuthError) => {
    switch (authError.code) {
        case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            setError('Invalid email or password.');
            break;
        case 'auth/email-already-in-use':
            setError('An account with this email already exists.');
            break;
         case 'auth/weak-password':
            setError('Password should be at least 6 characters.');
            break;
        default:
            setError('An unexpected error occurred. Please try again.');
            break;
    }
  };
  
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setEmail('');
    setPassword('');
    setError('');
    setMessage('');
  };
  
  const titles = {
      login: 'Welcome Back!',
      signup: 'Create an Account',
      reset: 'Reset Password'
  };
  
  const descriptions = {
      login: 'Sign in to access your documents.',
      signup: 'Create the single administrator account.',
      reset: 'Enter your email to receive a password reset link.'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Gemini Document Tracker
                </h1>
            </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {titles[mode]}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {descriptions[mode]}
          </p>
        </div>
        <form className="space-y-6" onSubmit={mode === 'reset' ? handlePasswordReset : handleAuthSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {message && <p className="text-sm text-green-500 text-center">{message}</p>}
          
           {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot Password?
                </button>
              </div>
            )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800"
            >
              {loading ? (
                 <div className="w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
              ) : (
                mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'
              )}
            </button>
          </div>
        </form>
        <div className="text-center">
          {mode === 'login' ? (
              <button
                onClick={() => { window.location.hash = '#/track'; }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Track a Document
              </button>
          ) : (
            <button
              onClick={() => switchMode('login')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {mode === 'signup' ? 'Already have an account? Sign in' : 'Back to Sign In'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;