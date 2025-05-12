import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Building, ShoppingBag, Mail, Phone, Lock, Globe, CheckSquare } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    storeName: '',
    email: '',
    phone: '',
    password: '',
    storeUrl: '',
    platform: '',
    termsAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic would go here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A2896] justify-center items-center">
        <div className="max-w-md text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-6">Crie sua conta na Convertfy</h1>
          <p className="text-xl mb-8">
            Comece a aumentar suas vendas com marketing de alta performance para e-commerce.
          </p>
          <img 
            src="https://placehold.co/400x300/ffffff/0A2896.png?text=Convertfy" 
            alt="Convertfy Marketing Platform" 
            className="mx-auto" 
          />
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Cadastro</h2>
            <p className="text-gray-600 mt-2">
              Preencha as informações para criar sua conta
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Nome da Empresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
                  placeholder="Sua Empresa Ltda."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                Nome da Loja
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShoppingBag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
                  placeholder="Minha Loja Virtual"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
                  placeholder="********"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                A senha deve ter no mínimo 8 caracteres e incluir letras maiúsculas, minúsculas e números.
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="storeUrl" className="block text-sm font-medium text-gray-700">
                URL da Loja
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="storeUrl"
                  name="storeUrl"
                  type="url"
                  required
                  value={formData.storeUrl}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
                  placeholder="https://www.sualoja.com.br"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                Plataforma
              </label>
              <select
                id="platform"
                name="platform"
                required
                value={formData.platform}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
              >
                <option value="" disabled>Selecione a plataforma</option>
                <option value="shopify">Shopify</option>
                <option value="woocommerce">WooCommerce</option>
                <option value="vtex">VTEX</option>
                <option value="magento">Magento</option>
                <option value="nuvemshop">Nuvemshop</option>
                <option value="other">Outra</option>
              </select>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="termsAccepted"
                  type="checkbox"
                  required
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#0066FF] focus:ring-[#0066FF] border-gray-300 rounded"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Concordo com os <Link to="/terms" className="text-[#0066FF]">Termos de Uso</Link> e <Link to="/privacy" className="text-[#0066FF]">Política de Privacidade</Link>
                </label>
              </div>
            </div>
            
            <Button type="submit" fullWidth variant="primary" size="lg">
              Cadastrar
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Já possui uma conta?{' '}
              <Link to="/login" className="text-[#0066FF] font-medium hover:text-[#0055D4]">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;