import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { signUp } from '../../services/firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Client } from '../../types/firebase';

const CreateClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Company Data
    companyName: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    
    // Store Data
    storeName: '',
    storeUrl: '',
    platform: '',
    
    // Financial Data
    plan: 'partner',
    subscriptionValue: 297,
    commissionPercentage: 1.5,
    dueDate: 15,
    
    // User Account
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Create user account
      const userCredential = await signUp(
        formData.email,
        formData.password,
        formData.companyName,
        'client'
      );

      // Create client record
      const clientData: Partial<Client> = {
        userId: userCredential.uid,
        storeName: formData.storeName,
        contactName: formData.companyName,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        plan: 'partner',
        subscriptionStatus: 'active',
        contractStartDate: serverTimestamp(),
        platform: formData.platform,
        storeUrl: formData.storeUrl,
        settings: {
          notificationEmail: true,
          notificationWhatsapp: true,
          notificationSystem: true,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'clients', userCredential.uid), clientData);

      navigate('/admin/clients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/clients" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold">Novo Cliente</h1>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save size={16} />
          {loading ? 'Criando...' : 'Criar Cliente'}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex">
            {['company', 'store', 'financial', 'account'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-[#0066FF] text-[#0066FF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'company' && 'Dados da Empresa'}
                {tab === 'store' && 'Dados da Loja'}
                {tab === 'financial' && 'Dados Financeiros'}
                {tab === 'account' && 'Conta de Acesso'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Nome da empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="12.345.678/0001-90"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="contato@empresa.com.br"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Endereço completo"
                ></textarea>
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Loja
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Nome da loja"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL da Loja
                  </label>
                  <input
                    type="url"
                    name="storeUrl"
                    value={formData.storeUrl}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://www.sualoja.com.br"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataforma
                </label>
                <select 
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione a plataforma</option>
                  <option value="shopify">Shopify</option>
                  <option value="woocommerce">WooCommerce</option>
                  <option value="vtex">VTEX</option>
                  <option value="magento">Magento</option>
                  <option value="nuvemshop">Nuvemshop</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plano
                  </label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="partner">Parceiro</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor da Assinatura
                  </label>
                  <input
                    type="number"
                    name="subscriptionValue"
                    value={formData.subscriptionValue}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="297.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentual de Comissão
                  </label>
                  <input
                    type="number"
                    name="commissionPercentage"
                    value={formData.commissionPercentage}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="1.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dia do Vencimento
                  </label>
                  <input
                    type="number"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    max="31"
                    placeholder="15"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Digite a senha"
                />
                <p className="mt-1 text-sm text-gray-500">
                  A senha deve ter no mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Confirme a senha"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateClient;