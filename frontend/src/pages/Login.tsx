import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('admin@fraudguard.com'); // Pre-fill for portfolio demo
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. For demo purposes, any credentials might fail if DB is empty.');
      // Fallback for UI demo if backend isn't up
      if (err.message === 'Network Error') {
        console.warn("Backend unavailable. Proceeding with mock login for portfolio display.");
        localStorage.setItem('token', 'mock_token');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-card/40 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <ShieldAlert className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to FraudGuard</h2>
          <p className="text-muted-foreground text-center text-sm">Enter your credentials to access the AI detection platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="admin@fraudguard.com"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-5 h-5" /> Sign In to Portal</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
