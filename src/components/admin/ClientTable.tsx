import React from 'react';
import { Link } from 'react-router-dom';
import { Client } from '../../types/firebase';
import Avatar from '../ui/Avatar';
import { Eye, Edit, Trash, ExternalLink } from 'lucide-react';
import Badge from '../ui/Badge';

type ClientTableProps = {
  clients: Client[];
};

const ClientTable: React.FC<ClientTableProps> = ({ clients }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">CLIENTE / LOJA</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">PLANO</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">STATUS</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">PLATAFORMA</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-500">DATA DE INÍCIO</th>
            <th className="text-center py-3 px-4 font-medium text-sm text-gray-500">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <Avatar name={client.storeName} className="mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">{client.storeName}</p>
                    <p className="text-sm text-gray-500">{client.contactEmail}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="capitalize">{client.plan}</span>
              </td>
              <td className="py-4 px-4">
                <Badge status={client.subscriptionStatus === 'active' ? 'active' : 'inactive'}>
                  {client.subscriptionStatus === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </td>
              <td className="py-4 px-4">
                <span className="capitalize">{client.platform}</span>
              </td>
              <td className="py-4 px-4">
                {client.contractStartDate?.toDate().toLocaleDateString('pt-BR')}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center space-x-2">
                  <Link to={`/admin/clients/${client.id}`} className="p-1 text-gray-500 hover:text-[#0066FF]">
                    <Eye size={18} />
                  </Link>
                  <Link to={`/admin/clients/${client.id}/edit`} className="p-1 text-gray-500 hover:text-[#0066FF]">
                    <Edit size={18} />
                  </Link>
                  <button className="p-1 text-gray-500 hover:text-red-500">
                    <Trash size={18} />
                  </button>
                  <a 
                    href={client.storeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-1 text-gray-500 hover:text-[#0066FF]"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;