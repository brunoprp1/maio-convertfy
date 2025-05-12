import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClientTable from '../../components/admin/ClientTable';
import Button from '../../components/ui/Button';
import { Search, Plus, Filter } from 'lucide-react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Client } from '../../types/firebase';
import Card from '../../components/ui/Card';

const AdminClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    platform: 'all',
    subscriptionStatus: 'all'
  });

  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchQuery, filters, clients]);

  const fetchClients = async () => {
    try {
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef);
      const querySnapshot = await getDocs(q);
      
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];

      console.log('Clientes carregados:', clientsData);
      setClients(clientsData);
      setFilteredClients(clientsData);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar a lista de clientes. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];

    if (searchQuery) {
      filtered = filtered.filter(client => 
        client.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(client => client.status === filters.status);
    }

    if (filters.plan !== 'all') {
      filtered = filtered.filter(client => client.plan === filters.plan);
    }

    if (filters.platform !== 'all') {
      filtered = filtered.filter(client => client.platform === filters.platform);
    }

    if (filters.subscriptionStatus !== 'all') {
      filtered = filtered.filter(client => 
        client.subscriptionStatus === filters.subscriptionStatus
      );
    }

    setFilteredClients(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Gerenciamento de Clientes</h1>
        <Link to="/admin/clients/new">
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Novo Cliente
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0066FF] focus:border-[#0066FF]"
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filtros
        </Button>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plano
              </label>
              <select
                name="plan"
                value={filters.plan}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="partner">Parceiro</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plataforma
              </label>
              <select
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todas</option>
                <option value="shopify">Shopify</option>
                <option value="woocommerce">WooCommerce</option>
                <option value="vtex">VTEX</option>
                <option value="magento">Magento</option>
                <option value="nuvemshop">Nuvemshop</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status da Assinatura
              </label>
              <select
                name="subscriptionStatus"
                value={filters.subscriptionStatus}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos</option>
                <option value="active">Ativa</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
          </div>
        </Card>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredClients.length > 0 ? (
          <ClientTable clients={filteredClients} />
        ) : (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClients;