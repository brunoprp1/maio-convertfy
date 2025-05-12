import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, Edit, Trash, ExternalLink, Receipt } from 'lucide-react';
import { clients, financialTransactions } from '../../data/mockData';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const ViewClient: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const client = clients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-medium">Cliente não encontrado</h2>
          <Link to="/admin/clients" className="text-[#0066FF] hover:underline mt-2 inline-block">
            Voltar para lista de clientes
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    // Here you would typically make an API call to delete the client
    // For now, we'll just navigate back to the clients list
    navigate('/admin/clients');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/clients" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold">Detalhes do Cliente</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/admin/clients/${id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit size={16} />
              Editar
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-red-600 hover:bg-red-50"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash size={16} />
            Excluir
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            <ExternalLink size={16} />
            Acessar Loja
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={client.name} size="lg" />
              <div>
                <h2 className="text-xl font-medium">{client.name}</h2>
                <p className="text-gray-500">{client.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Informações da Empresa</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">CNPJ:</span> 12.345.678/0001-90</p>
                  <p><span className="font-medium">Telefone:</span> (11) 98765-4321</p>
                  <p><span className="font-medium">Endereço:</span> Av. Paulista, 1000</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Informações da Loja</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">URL:</span> www.{client.name.toLowerCase().replace(/\s+/g, '')}.com.br</p>
                  <p><span className="font-medium">Plataforma:</span> Shopify</p>
                  <p><span className="font-medium">Data de Cadastro:</span> 10/01/2025</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium mb-4">Métricas de Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Faturamento Total</p>
                <p className="text-xl font-medium mt-1">R$ 102.850,00</p>
                <p className="text-sm text-green-600 mt-1">+8.2% esse mês</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Taxa de Conversão</p>
                <p className="text-xl font-medium mt-1">12.7%</p>
                <p className="text-sm text-green-600 mt-1">+7.8% esse mês</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Campanhas Ativas</p>
                <p className="text-xl font-medium mt-1">14</p>
                <p className="text-sm text-gray-500 mt-1">Últimos 30 dias</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-gray-400" />
                <h3 className="text-lg font-medium">Histórico de Cobranças</h3>
              </div>
              <Link to="/admin/billing" className="text-[#0066FF] text-sm hover:underline">
                Ver todas
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">TIPO</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">VALOR</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">VENCIMENTO</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">STATUS</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">MÉTODO</th>
                  </tr>
                </thead>
                <tbody>
                  {financialTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <span className="capitalize">
                          {transaction.type === 'subscription' ? 'Assinatura' : 'Comissão'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">{transaction.dueDate}</td>
                      <td className="py-3 px-4">
                        <Badge status={transaction.status}>
                          {transaction.status === 'paid' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {transaction.paymentMethod || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Informações Financeiras</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Plano Atual</p>
                <p className="font-medium">{client.plan}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor da Assinatura</p>
                <p className="font-medium">R$ {client.subscriptionValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Próximo Vencimento</p>
                <p className="font-medium">{client.nextBillingDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status do Pagamento</p>
                <span className={`inline-block px-2 py-1 text-sm rounded-full ${
                  client.subscriptionStatus === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {client.subscriptionStatus === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium mb-4">Integrações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Shopify</p>
                  <p className="text-sm text-green-600">Conectado</p>
                </div>
                <Link to={`/admin/clients/${id}/edit?tab=integrations`}>
                  <Button variant="outline" size="sm">Configurar</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Klaviyo</p>
                  <p className="text-sm text-yellow-600">Pendente</p>
                </div>
                <Link to={`/admin/clients/${id}/edit?tab=integrations`}>
                  <Button variant="outline" size="sm">Conectar</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir o cliente ${client.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ViewClient;