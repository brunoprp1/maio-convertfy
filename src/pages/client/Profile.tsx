import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { Camera, Key, Building, Globe } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Client } from '../../types/firebase';
import { updateUserEmail, updateUserPassword } from '../../services/firebase/auth';

const ClientProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuthContext();
  const [clientData, setClientData] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    companyName: '',
    cnpj: '',
    address: '',
    storeName: '',
    storeUrl: '',
    platform: ''
  });

  useEffect(() => {
    const fetchClientData = async () => {
      if (!user?.id) return;
      
      try {
        const clientDoc = await getDoc(doc(db, 'clients', user.id));
        if (clientDoc.exists()) {
          const data = clientDoc.data() as Client;
          setClientData(data);
          setFormData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            phone: data.contactPhone || '',
            companyName: data.contactName || '',
            cnpj: data.cnpj || '',
            address: data.address || '',
            storeName: data.storeName || '',
            storeUrl: data.storeUrl || '',
            platform: data.platform || '',
          }));
        }
      } catch (err) {
        setError('Erro ao carregar dados do cliente');
      }
    };

    fetchClientData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update user document in Firestore
      await updateDoc(doc(db, 'users', user.id), {
        name: formData.name,
        updatedAt: new Date(),
      });

      // Update client document in Firestore
      await updateDoc(doc(db, 'clients', user.id), {
        contactName: formData.companyName,
        contactPhone: formData.phone,
        cnpj: formData.cnpj,
        address: formData.address,
        storeName: formData.storeName,
        storeUrl: formData.storeUrl,
        platform: formData.platform,
        updatedAt: new Date(),
      });

      setSuccess('Dados atualizados com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.email) {
      setError('Senha atual e novo email são obrigatórios');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserEmail(formData.currentPassword, formData.email);
      setSuccess('Email atualizado com sucesso! Por favor, faça login novamente.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('Erro ao atualizar email. Verifique sua senha atual.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserPassword(formData.currentPassword, formData.newPassword);
      setSuccess('Senha atualizada com sucesso! Por favor, faça login novamente.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('Erro ao atualizar senha. Verifique sua senha atual.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Meu Perfil</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar name={formData.name} size="lg" className="w-24 h-24 text-2xl" />
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 border border-gray-200">
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>
            <h2 className="mt-4 font-medium text-lg">{formData.name}</h2>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>

          <div className="mt-6 space-y-1">
            <button
              onClick={() => setActiveTab('personal')}
              className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                activeTab === 'personal' 
                  ? 'bg-[#0066FF] text-white' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              Dados Pessoais
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                activeTab === 'company' 
                  ? 'bg-[#0066FF] text-white' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              Dados da Empresa
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                activeTab === 'store' 
                  ? 'bg-[#0066FF] text-white' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              Dados da Loja
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                activeTab === 'security' 
                  ? 'bg-[#0066FF] text-white' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              Segurança
            </button>
          </div>
        </Card>

        <div className="md:col-span-3">
          {activeTab === 'personal' && (
            <Card>
              <h3 className="text-lg font-medium mb-6">Dados Pessoais</h3>
              <form className="space-y-6" onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
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
                      disabled
                    />
                  </div>
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
                  />
                </div>

                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'company' && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Building className="h-6 w-6 text-gray-400" />
                <h3 className="text-lg font-medium">Dados da Empresa</h3>
              </div>

              <form className="space-y-6" onSubmit={handleUpdateProfile}>
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
                  />
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
                  />
                </div>

                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'store' && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-6 w-6 text-gray-400" />
                <h3 className="text-lg font-medium">Dados da Loja</h3>
              </div>

              <form className="space-y-6" onSubmit={handleUpdateProfile}>
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
                  />
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

                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Key className="h-6 w-6 text-gray-400" />
                <h3 className="text-lg font-medium">Segurança</h3>
              </div>

              <div className="space-y-8">
                <form className="space-y-6" onSubmit={handleUpdateEmail}>
                  <h4 className="font-medium">Alterar Email</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Novo Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <Button 
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Atualizando...' : 'Atualizar Email'}
                  </Button>
                </form>

                <div className="border-t pt-8">
                  <form className="space-y-6" onSubmit={handleUpdatePassword}>
                    <h4 className="font-medium">Alterar Senha</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <Button 
                      variant="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Atualizando...' : 'Atualizar Senha'}
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;