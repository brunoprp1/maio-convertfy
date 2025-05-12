import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Client } from '../../types/firebase';

const EditClient: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientData, setClientData] = useState<Client | null>(null);
  const [originalEmail, setOriginalEmail] = useState('');

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
    subscriptionStatus: 'active',

    // Integration Data
    klaviyoPublicKey: '',
    klaviyoPrivateKey: '',
    reportanaClientId: '',
    reportanaClientSecret: '',
  });

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        const clientDoc = await getDoc(doc(db, 'clients', id));
        if (clientDoc.exists()) {
          const data = clientDoc.data() as Client;
          setClientData(data);
          setOriginalEmail(data.contactEmail);
          setFormData({
            companyName: data.contactName || '',
            cnpj: data.cnpj || '',
            email: data.contactEmail || '',
            phone: data.contactPhone || '',
            address: data.address || '',
            storeName: data.storeName || '',
            storeUrl: data.storeUrl || '',
            platform: data.platform || '',
            plan: data.plan || 'partner',
            subscriptionValue: data.subscriptionValue || 297,
            commissionPercentage: data.commissionPercentage || 1.5,
            dueDate: data.dueDate || 15,
            subscriptionStatus: data.subscriptionStatus || 'active',
            klaviyoPublicKey: data.integrations?.klaviyo?.publicKey || '',
            klaviyoPrivateKey: data.integrations?.klaviyo?.apiKey || '',
            reportanaClientId: data.integrations?.reportana?.clientId || '',
            reportanaClientSecret: data.integrations?.reportana?.clientSecret || '',
          });
        } else {
          setError('Cliente não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar dados do cliente');
        console.error('Error fetching client:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'clients', id), {
        contactName: formData.companyName,
        cnpj: formData.cnpj,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        address: formData.address,
        storeName: formData.storeName,
        storeUrl: formData.storeUrl,
        platform: formData.platform,
        plan: formData.plan,
        subscriptionValue: Number(formData.subscriptionValue),
        commissionPercentage: Number(formData.commissionPercentage),
        dueDate: Number(formData.dueDate),
        subscriptionStatus: formData.subscriptionStatus,
        integrations: {
          klaviyo: {
            publicKey: formData.klaviyoPublicKey,
            apiKey: formData.klaviyoPrivateKey,
            enabled: Boolean(formData.klaviyoPublicKey && formData.klaviyoPrivateKey),
            updatedAt: serverTimestamp()
          },
          reportana: {
            clientId: formData.reportanaClientId,
            clientSecret: formData.reportanaClientSecret,
            enabled: Boolean(formData.reportanaClientId && formData.reportanaClientSecret),
            updatedAt: serverTimestamp()
          }
        },
        updatedAt: serverTimestamp(),
      });

      if (formData.email !== originalEmail) {
        await updateDoc(doc(db, 'users', id), {
          email: formData.email,
          updatedAt: serverTimestamp(),
        });
      }

      setSuccess('Cliente atualizado com sucesso!');
      setTimeout(() => {
        navigate('/admin/clients');
      }, 2000);
    } catch (err) {
      setError('Erro ao atualizar cliente');
      console.error('Error updating client:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-medium text-red-600">Cliente não encontrado</h2>
          <Link to="/admin/clients" className="text-[#0066FF] hover:underline mt-2 inline-block">
            Voltar para lista de clientes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/clients" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold">Editar Cliente</h1>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2"
          onClick={handleSubmit}
          disabled={saving}
        >
          <Save size={16} />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

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

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex">
            {['company', 'store', 'financial', 'integrations'].map((tab) => (
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
                {tab === 'integrations' && 'Integrações'}
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
                    Status da Assinatura
                  </label>
                  <select
                    name="subscriptionStatus"
                    value={formData.subscriptionStatus}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Ativo</option>
                    <option value="pending">Pendente</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor da Assinatura
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                    <input
                      type="number"
                      name="subscriptionValue"
                      value={formData.subscriptionValue}
                      onChange={handleChange}
                      className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentual de Comissão
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="commissionPercentage"
                      value={formData.commissionPercentage}
                      onChange={handleChange}
                      className="block w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  </div>
                </div>
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
                />
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Klaviyo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chave de API pública/ID do site
                    </label>
                    <input
                      type="text"
                      name="klaviyoPublicKey"
                      value={formData.klaviyoPublicKey}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="pk_xxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Encontre sua chave pública no painel do Klaviyo em Configurações {'>'} API Keys
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chave de API privada
                    </label>
                    <input
                      type="password"
                      name="klaviyoPrivateKey"
                      value={formData.klaviyoPrivateKey}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Encontre sua chave privada no painel do Klaviyo em Configurações {'>'} API Keys
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Reportana</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client ID
                    </label>
                    <input
                      type="text"
                      name="reportanaClientId"
                      value={formData.reportanaClientId}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="client_xxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Encontre seu Client ID no painel do Reportana em Configurações {'>'} API
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Secret
                    </label>
                    <input
                      type="password"
                      name="reportanaClientSecret"
                      value={formData.reportanaClientSecret}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Encontre seu Client Secret no painel do Reportana em Configurações {'>'} API
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditClient;