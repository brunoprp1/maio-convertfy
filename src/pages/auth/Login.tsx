import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { signIn } from '../../services/firebase/auth';
import { useAuthContext } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#171E28] justify-center items-center">
        <div className="max-w-md text-center p-8">
          <img 
            src="/src/assets/logo convertfy svg.png" 
            alt="Convertfy" 
            className="h-8 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold mb-6 mt-8 text-white">Bem-vindo à Convertfy</h1>
          <p className="text-xl mb-8 text-gray-300">
            A plataforma completa para gestão de campanhas e automações de marketing para e-commerces.
          </p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1E293B]">Entrar</h2>
            <p className="text-[#4B5563] mt-2">
              Faça login para acessar sua conta
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#1E293B]">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#94A3B8]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-[#CBD5E1] rounded-md text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#5947FD] focus:border-[#5947FD]"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[#1E293B]">
                  Senha
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-[#5947FD] hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#94A3B8]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-[#CBD5E1] rounded-md text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#5947FD] focus:border-[#5947FD]"
                  placeholder="********"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#5947FD] text-white rounded-md font-medium hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;